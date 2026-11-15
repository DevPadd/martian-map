"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import { defaults as defaultControls } from "ol/control/defaults.js";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS.js";
import WMTSCapabilities from "ol/format/WMTSCapabilities.js";
import { get as getProjection } from "ol/proj.js";
import { unByKey } from "ol/Observable.js";
import type { EventsKey } from "ol/events.js";

import {
  JEZERO_CENTER,
  JEZERO_ZOOM,
  MAP_LAYERS,
  type MapLayerConfig,
} from "./mapLayers";
import {
  configureMarsPointResolution,
  registerMarsProjection,
} from "./marsProjection";
import { createLandmarkLayer } from "./landmarks/createLandmarkLayer";
import type VectorLayer from "ol/layer/Vector.js";
import type VectorSource from "ol/source/Vector.js";

const GLOBAL_MARS_LAYER_INDEX = 1;

export type CursorCoordinates = {
  latitude: number;
  longitude: number;
};

async function loadWmtsLayer(config: MapLayerConfig, signal: AbortSignal) {
  const response = await fetch(config.capabilitiesUrl, { signal });

  if (!response.ok) {
    throw new Error(`NASA returned HTTP ${response.status}`);
  }

  const xml = await response.text();

  registerMarsProjection();

  const normalizedXml = xml.replace(
    /<(MatrixWidth|MatrixHeight)>\s*(\d+)\.0+\s*<\/\1>/g,
    (_match, element: string, value: string) =>
      `<${element}>${value}</${element}>`,
  );
  const parser = new WMTSCapabilities();
  const capabilities = parser.read(normalizedXml);
  const options = optionsFromCapabilities(capabilities, {
    layer: config.id,
  });

  if (!options) {
    throw new Error(`Could not find the WMTS layer "${config.id}".`);
  }

  const projection = getProjection(options.projection);

  if (!projection) {
    throw new Error("The WMTS projection could not be resolved.");
  }

  configureMarsPointResolution(projection);

  const extent = options.tileGrid.getExtent();

  if (!extent) {
    throw new Error("The WMTS layer has no usable extent.");
  }

  return {
    extent,
    resolutions: options.tileGrid.getResolutions(),
    source: new WMTS({
      ...options,
    }),
    projection,
  };
}

export function useMarsMap(mapElement: RefObject<HTMLDivElement | null>) {
  const mapInstance = useRef<Map | null>(null);
  const imageryLayer = useRef<TileLayer<WMTS> | null>(null);
  const globalLayer = useRef<TileLayer<WMTS> | null>(null);
  const globalMaxZoom = useRef(0);
  const globalSourceKeys = useRef<EventsKey[]>([]);
  const pointerMoveKey = useRef<EventsKey | undefined>(undefined);
  const selectedLayerIndexRef = useRef(0);

  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [status, setStatus] = useState(
    `Loading ${MAP_LAYERS[0].name} imagery...`,
  );
  const [map, setMap] = useState<Map | null>(null);
  const [landmarkLayer, setLandmarkLayer] =
    useState<VectorLayer<VectorSource> | null>(null);
  const [cursorCoordinates, setCursorCoordinates] =
    useState<CursorCoordinates | null>(null);

  const onLayerChange = useCallback((index: number) => {
    const layerConfig = MAP_LAYERS[index];
    if (!layerConfig) return;

    selectedLayerIndexRef.current = index;
    setStatus(`Loading ${layerConfig.name} imagery...`);
    setSelectedLayerIndex(index);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const layerConfig = MAP_LAYERS[selectedLayerIndex];

    async function loadLayer(): Promise<void> {
      try {
        const existingMap = mapInstance.current;

        if (existingMap) {
          if (selectedLayerIndex === GLOBAL_MARS_LAYER_INDEX) {
            if (!imageryLayer.current || !globalLayer.current) {
              throw new Error("The map imagery layers are unavailable.");
            }

            imageryLayer.current.setVisible(false);
            existingMap.getView().setMaxZoom(globalMaxZoom.current);
            setStatus(`Showing global ${layerConfig.name} imagery...`);
            return;
          }

          if (!imageryLayer.current || !globalLayer.current) {
            throw new Error("The map imagery layers are unavailable.");
          }

          const loadedLayer = await loadWmtsLayer(
            layerConfig,
            controller.signal,
          );
          if (cancelled) return;

          loadedLayer.source.on("tileloadend", () => {
            if (!cancelled) {
              setStatus(`${layerConfig.name} imagery loaded.`);
            }
          });
          loadedLayer.source.on("tileloaderror", () => {
            console.error("A NASA WMTS imagery tile failed to load.");
            if (!cancelled) {
              setStatus("Map loaded, but an imagery tile failed to load.");
            }
          });
          imageryLayer.current.setSource(loadedLayer.source);
          imageryLayer.current.setVisible(true);
          existingMap.getView().setMaxZoom(loadedLayer.resolutions.length - 1);
          setStatus(`Map ready; loading ${layerConfig.name}...`);
          return;
        }

        const [globalImage, selectedImage] = await Promise.all([
          loadWmtsLayer(MAP_LAYERS[GLOBAL_MARS_LAYER_INDEX], controller.signal),
          selectedLayerIndex === GLOBAL_MARS_LAYER_INDEX
            ? Promise.resolve(null)
            : loadWmtsLayer(layerConfig, controller.signal),
        ]);

        if (cancelled || !mapElement.current) return;

        const baseLayer = new TileLayer({ source: globalImage.source });
        const nextImageryLayer = new TileLayer({
          source: selectedImage?.source ?? globalImage.source,
          visible: selectedLayerIndex !== GLOBAL_MARS_LAYER_INDEX,
        });
        const globalTileCount = globalImage.resolutions.length;
        globalMaxZoom.current = globalTileCount - 1;
        const globalTileErrorKey = globalImage.source.on(
          "tileloaderror",
          () => {
            console.error("A NASA global Mars imagery tile failed to load.");
            if (selectedLayerIndexRef.current === GLOBAL_MARS_LAYER_INDEX) {
              setStatus("Global Mars imagery failed to load.");
            }
          },
        );
        const globalTileLoadKey = globalImage.source.on("tileloadend", () => {
          if (selectedLayerIndexRef.current === GLOBAL_MARS_LAYER_INDEX) {
            setStatus(`${MAP_LAYERS[GLOBAL_MARS_LAYER_INDEX].name} loaded.`);
          }
        });
        globalSourceKeys.current = [globalTileErrorKey, globalTileLoadKey];

        if (selectedImage) {
          selectedImage.source.on("tileloadend", () => {
            if (!cancelled) {
              setStatus(`${layerConfig.name} imagery loaded.`);
            }
          });
          selectedImage.source.on("tileloaderror", () => {
            console.error("A NASA WMTS imagery tile failed to load.");
            if (!cancelled) {
              setStatus("Map loaded, but an imagery tile failed to load.");
            }
          });
        }

        const view = new View({
          projection: globalImage.projection,
          maxResolution: globalImage.resolutions[0],
          extent: globalImage.extent,
          center: JEZERO_CENTER,
          zoom: JEZERO_ZOOM,
          zoomFactor: globalImage.resolutions[0] / globalImage.resolutions[1],
          maxZoom:
            selectedLayerIndex === GLOBAL_MARS_LAYER_INDEX
              ? globalTileCount - 1
              : (selectedImage?.resolutions.length ?? globalTileCount) - 1,
        });
        const landmarkLayer = createLandmarkLayer();
        const map = new Map({
          target: mapElement.current,
          layers: [baseLayer, nextImageryLayer, landmarkLayer],
          view,
          controls: defaultControls({ zoom: false }),
        });
        pointerMoveKey.current = map.on("pointermove", ({ coordinate }) => {
          setCursorCoordinates({
            latitude: coordinate[1],
            longitude: coordinate[0],
          });
        });

        globalLayer.current = baseLayer;
        imageryLayer.current = nextImageryLayer;
        mapInstance.current = map;
        setMap(map);
        setLandmarkLayer(landmarkLayer);
        (
          globalThis as typeof globalThis & { marsMapDebug?: Map }
        ).marsMapDebug = map;
        setStatus(`Map ready; loading ${layerConfig.name}...`);
      } catch (error) {
        if (
          cancelled ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        console.error("Map initialization failed:", error);
        setStatus(
          error instanceof Error ? error.message : "Failed to initialize map",
        );
      }
    }

    void loadLayer();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [mapElement, selectedLayerIndex]);

  useEffect(
    () => () => {
      if (pointerMoveKey.current) {
        unByKey(pointerMoveKey.current);
      }
      unByKey(globalSourceKeys.current);
      globalSourceKeys.current = [];
      mapInstance.current?.setTarget(undefined);
      mapInstance.current = null;
      imageryLayer.current = null;
      globalLayer.current = null;
      globalMaxZoom.current = 0;
    },
    [],
  );

  return {
    cursorCoordinates,
    landmarkLayer,
    map,
    onLayerChange,
    selectedLayerIndex,
    status,
  };
}
