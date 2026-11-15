"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import OLMap from "ol/Map.js";
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
  ENVIRONMENT_LAYERS,
  GLOBAL_MAP_LAYERS,
  REGIONAL_MAP_LAYERS,
  type MapLayerConfig,
} from "./mapLayers";
import {
  configureMarsPointResolution,
  registerMarsProjection,
} from "./marsProjection";
import { createLandmarkLayer } from "./landmarks/createLandmarkLayer";
import type VectorLayer from "ol/layer/Vector.js";
import type VectorSource from "ol/source/Vector.js";
import {
  createInitialMissionDataLayerVisibility,
  createMissionDataLayers,
} from "./missionDataLayers";
import { createJezeroStudyAreaLayer } from "./mission/jezeroStudyArea";

const GLOBAL_MARS_LAYER_INDEX = 1;

export type RegionalMapLayerVisibility = Record<string, boolean>;
export type EnvironmentMapLayerVisibility = Record<string, boolean>;

function createInitialRegionalMapLayerVisibility(): RegionalMapLayerVisibility {
  return Object.fromEntries(
    REGIONAL_MAP_LAYERS.map(({ id, visibleByDefault }) => [
      id,
      visibleByDefault,
    ]),
  );
}

function createInitialEnvironmentMapLayerVisibility(): EnvironmentMapLayerVisibility {
  return Object.fromEntries(
    ENVIRONMENT_LAYERS.map(({ id, visibleByDefault }) => [
      id,
      visibleByDefault,
    ]),
  );
}

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
  const mapInstance = useRef<OLMap | null>(null);
  const imageryLayer = useRef<TileLayer<WMTS> | null>(null);
  const globalLayer = useRef<TileLayer<WMTS> | null>(null);
  const globalMaxZoom = useRef(0);
  const globalSourceKeys = useRef<EventsKey[]>([]);
  const pointerMoveKey = useRef<EventsKey | undefined>(undefined);
  const selectedLayerIndexRef = useRef(0);
  const missionDataLayersRef = useRef(
    new Map<string, VectorLayer<VectorSource>>(),
  );
  const regionalMapLayersRef = useRef(
    new Map<string, TileLayer<WMTS>>(),
  );
  const environmentMapLayersRef = useRef(
    new Map<string, TileLayer<WMTS>>(),
  );
  const missionAreaLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const missionAreaVisibilityRef = useRef(false);
  const regionalLayerMaxZoomRef = useRef(new Map<string, number>());
  const environmentLayerMaxZoomRef = useRef(new Map<string, number>());
  const missionDataLayerVisibilityRef = useRef(
    createInitialMissionDataLayerVisibility(),
  );
  const regionalMapLayerVisibilityRef = useRef(
    createInitialRegionalMapLayerVisibility(),
  );
  const environmentMapLayerVisibilityRef = useRef(
    createInitialEnvironmentMapLayerVisibility(),
  );

  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [regionalMapLayerVisibility, setRegionalMapLayerVisibility] = useState(
    createInitialRegionalMapLayerVisibility,
  );
  const [environmentMapLayerVisibility, setEnvironmentMapLayerVisibility] =
    useState(createInitialEnvironmentMapLayerVisibility);
  const [missionAreaVisible, setMissionAreaVisible] = useState(false);
  const [missionDataLayerVisibility, setMissionDataLayerVisibility] = useState(
    createInitialMissionDataLayerVisibility,
  );
  const [status, setStatus] = useState(
    `Loading ${GLOBAL_MAP_LAYERS[0].name} imagery...`,
  );
  const [map, setMap] = useState<OLMap | null>(null);
  const [landmarkLayer, setLandmarkLayer] =
    useState<VectorLayer<VectorSource> | null>(null);
  const [cursorCoordinates, setCursorCoordinates] =
    useState<CursorCoordinates | null>(null);

  const onLayerChange = useCallback((index: number) => {
    const layerConfig = GLOBAL_MAP_LAYERS[index];
    if (!layerConfig) return;

    selectedLayerIndexRef.current = index;
    setStatus(`Loading ${layerConfig.name} imagery...`);
    setSelectedLayerIndex(index);
  }, []);

  const onRegionalMapLayerVisibilityChange = useCallback(
    (id: string, visible: boolean) => {
      const layerConfig = REGIONAL_MAP_LAYERS.find((layer) => layer.id === id);
      if (!layerConfig) return;

      regionalMapLayerVisibilityRef.current = {
        ...regionalMapLayerVisibilityRef.current,
        [id]: visible,
      };
      const layer = regionalMapLayersRef.current.get(id);
      layer?.setVisible(visible);

      const activeMap = mapInstance.current;
      if (activeMap) {
        const regionalMaxZooms = Object.entries(
          regionalMapLayerVisibilityRef.current,
        )
          .filter((entry) => entry[1])
          .map(
            ([layerId]) => regionalLayerMaxZoomRef.current.get(layerId) ?? 0,
          );
        const environmentMaxZooms = Object.entries(
          environmentMapLayerVisibilityRef.current,
        )
          .filter((entry) => entry[1])
          .map(
            ([layerId]) =>
              environmentLayerMaxZoomRef.current.get(layerId) ?? 0,
          );
        activeMap
          .getView()
          .setMaxZoom(
            Math.max(
              globalMaxZoom.current,
              ...regionalMaxZooms,
              ...environmentMaxZooms,
            ),
          );
      }

      setRegionalMapLayerVisibility(regionalMapLayerVisibilityRef.current);
    },
    [],
  );

  const onEnvironmentMapLayerVisibilityChange = useCallback(
    (id: string, visible: boolean) => {
      const layerConfig = ENVIRONMENT_LAYERS.find((layer) => layer.id === id);
      if (!layerConfig) return;

      environmentMapLayerVisibilityRef.current = {
        ...environmentMapLayerVisibilityRef.current,
        [id]: visible,
      };
      environmentMapLayersRef.current.get(id)?.setVisible(visible);

      const activeMap = mapInstance.current;
      if (activeMap) {
        const regionalMaxZooms = Object.entries(
          regionalMapLayerVisibilityRef.current,
        )
          .filter((entry) => entry[1])
          .map(
            ([layerId]) => regionalLayerMaxZoomRef.current.get(layerId) ?? 0,
          );
        const environmentMaxZooms = Object.entries(
          environmentMapLayerVisibilityRef.current,
        )
          .filter((entry) => entry[1])
          .map(
            ([layerId]) =>
              environmentLayerMaxZoomRef.current.get(layerId) ?? 0,
          );
        activeMap
          .getView()
          .setMaxZoom(
            Math.max(
              globalMaxZoom.current,
              ...regionalMaxZooms,
              ...environmentMaxZooms,
            ),
          );
      }

      setEnvironmentMapLayerVisibility(
        environmentMapLayerVisibilityRef.current,
      );
    },
    [],
  );

  const onMissionAreaVisibilityChange = useCallback((visible: boolean) => {
    missionAreaVisibilityRef.current = visible;
    missionAreaLayerRef.current?.setVisible(visible);
    setMissionAreaVisible(visible);
  }, []);

  const onMissionDataLayerVisibilityChange = useCallback(
    (id: string, visible: boolean) => {
      missionDataLayerVisibilityRef.current = {
        ...missionDataLayerVisibilityRef.current,
        [id]: visible,
      };
      missionDataLayersRef.current.get(id)?.setVisible(visible);
      setMissionDataLayerVisibility(missionDataLayerVisibilityRef.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const layerConfig = GLOBAL_MAP_LAYERS[selectedLayerIndex];

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

        const [globalImage, selectedImage, missionDataLayers] = await Promise.all([
          loadWmtsLayer(
            GLOBAL_MAP_LAYERS[GLOBAL_MARS_LAYER_INDEX],
            controller.signal,
          ),
          selectedLayerIndex === GLOBAL_MARS_LAYER_INDEX
            ? Promise.resolve(null)
            : loadWmtsLayer(layerConfig, controller.signal),
          createMissionDataLayers(controller.signal),
        ]);
        const [regionalImages, environmentImages] = await Promise.all([
          Promise.all(
            REGIONAL_MAP_LAYERS.map(async (regionalConfig) => ({
              config: regionalConfig,
              image: await loadWmtsLayer(regionalConfig, controller.signal),
            })),
          ),
          Promise.all(
            ENVIRONMENT_LAYERS.map(async (environmentConfig) => ({
              config: environmentConfig,
              image: await loadWmtsLayer(environmentConfig, controller.signal),
            })),
          ),
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
            setStatus(
              `${GLOBAL_MAP_LAYERS[GLOBAL_MARS_LAYER_INDEX].name} loaded.`,
            );
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
        const regionalMapLayers = new Map(
          regionalImages.map(({ config, image }) => {
            const layer = new TileLayer({
              source: image.source,
              visible:
                regionalMapLayerVisibilityRef.current[config.id] ??
                config.visibleByDefault,
              properties: { title: config.name },
            });
            regionalLayerMaxZoomRef.current.set(
              config.id,
              image.resolutions.length - 1,
            );
            return [config.id, layer] as const;
          }),
        );
        const environmentMapLayers = new Map(
          environmentImages.map(({ config, image }) => {
            const layer = new TileLayer({
              source: image.source,
              visible:
                environmentMapLayerVisibilityRef.current[config.id] ??
                config.visibleByDefault,
              properties: { title: config.name },
            });
            environmentLayerMaxZoomRef.current.set(
              config.id,
              image.resolutions.length - 1,
            );
            return [config.id, layer] as const;
          }),
        );
        const visibleOverlayMaxZooms = [
          ...Object.entries(regionalMapLayerVisibilityRef.current).flatMap(
            ([id, visible]) => {
              return visible
                ? [regionalLayerMaxZoomRef.current.get(id) ?? 0]
                : [];
            },
          ),
          ...Object.entries(environmentMapLayerVisibilityRef.current).flatMap(
            ([id, visible]) => {
              return visible
                ? [environmentLayerMaxZoomRef.current.get(id) ?? 0]
                : [];
            },
          ),
        ];
        view.setMaxZoom(
          Math.max(
            view.getMaxZoom() ?? globalMaxZoom.current,
            ...visibleOverlayMaxZooms,
          ),
        );
        const landmarkLayer = createLandmarkLayer();
        const missionAreaLayer = createJezeroStudyAreaLayer();
        missionAreaLayer.setVisible(missionAreaVisibilityRef.current);
        for (const [id, layer] of missionDataLayers) {
          layer.setVisible(
            missionDataLayerVisibilityRef.current[id] ?? false,
          );
        }
        const map = new OLMap({
          target: mapElement.current,
          layers: [
            baseLayer,
            nextImageryLayer,
            ...regionalMapLayers.values(),
            ...environmentMapLayers.values(),
            ...missionDataLayers.values(),
            landmarkLayer,
            missionAreaLayer,
          ],
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
        missionDataLayersRef.current = missionDataLayers;
        regionalMapLayersRef.current = regionalMapLayers;
        environmentMapLayersRef.current = environmentMapLayers;
        missionAreaLayerRef.current = missionAreaLayer;
        mapInstance.current = map;
        setMap(map);
        setLandmarkLayer(landmarkLayer);
        (
          globalThis as typeof globalThis & { marsMapDebug?: OLMap }
        ).marsMapDebug = map;
        setRegionalMapLayerVisibility(regionalMapLayerVisibilityRef.current);
        setEnvironmentMapLayerVisibility(
          environmentMapLayerVisibilityRef.current,
        );
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
      missionDataLayersRef.current.clear();
      regionalMapLayersRef.current.clear();
      environmentMapLayersRef.current.clear();
      missionAreaLayerRef.current = null;
      regionalLayerMaxZoomRef.current.clear();
      environmentLayerMaxZoomRef.current.clear();
      globalMaxZoom.current = 0;
    },
    [],
  );

  return {
    cursorCoordinates,
    landmarkLayer,
    missionDataLayerVisibility,
    onRegionalMapLayerVisibilityChange,
    map,
    onLayerChange,
    onMissionDataLayerVisibilityChange,
    regionalMapLayerVisibility,
    environmentMapLayerVisibility,
    onEnvironmentMapLayerVisibilityChange,
    missionAreaVisible,
    onMissionAreaVisibilityChange,
    selectedLayerIndex,
    status,
  };
}
