"use client";

import { useEffect, useRef, useState } from "react";

import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS.js";
import WMTSCapabilities from "ol/format/WMTSCapabilities.js";
import { getCenter } from "ol/extent.js";
import { get as getProjection } from "ol/proj.js";
import { unByKey } from "ol/Observable.js";
import type { EventsKey } from "ol/events.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";

const LAYER_ID = "JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd";
const MARS_CRS = "urn:ogc:def:crs:EPSG::104905";
const MARS_CRS_DEFINITION =
  "+proj=longlat +a=3396190 +rf=169.894447223612 +no_defs +type=crs";

// Paste the URL copied from NASA's WMTS Capabilities button.
const CAPABILITIES_URL =
  "https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/WMTSCapabilities.xml";

export default function MarsMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  const [status, setStatus] = useState("Loading Mars imagery...");
  const [cursorCoordinates, setCursorCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    let cancelled = false;
    let pointerMoveKey: EventsKey | undefined;

    async function initializeMap() {
      try {
        // 1. Retrieve NASA WMTS capabilities.
        const response = await fetch(CAPABILITIES_URL);

        if (!response.ok) {
          throw new Error(`NASA returned HTTP ${response.status}`);
        }

        const xml = await response.text();

        proj4.defs("EPSG:104905", MARS_CRS_DEFINITION);
        proj4.defs(MARS_CRS, MARS_CRS_DEFINITION);
        register(proj4);

        // 2. Parse the XML.
        const normalizedXml = xml.replace(
          /<(MatrixWidth|MatrixHeight)>\s*(\d+)\.0+\s*<\/\1>/g,
          (_match, element: string, value: string) =>
            `<${element}>${value}</${element}>`,
        );
        const parser = new WMTSCapabilities();
        const capabilities = parser.read(normalizedXml);

        // 3. Generate the WMTS configuration.
        const options = optionsFromCapabilities(capabilities, {
          layer: LAYER_ID,
        });

        if (!options) {
          throw new Error("Could not find the requested WMTS layer.");
        }

        const projection = getProjection(options.projection);

        if (!projection) {
          throw new Error("The WMTS projection could not be resolved.");
        }

        const extent = options.tileGrid.getExtent();

        if (!extent) {
          throw new Error("The WMTS layer has no usable extent.");
        }

        if (cancelled || !mapElement.current) return;

        // 4. Create the NASA imagery layer.
        const imagerySource = new WMTS({
          ...options,
          attributions: "Imagery: NASA / USGS / MRO CTX",
        });
        imagerySource.on("tileloadend", () => {
          setStatus("マルスマップが読み込まれました。"); // "Mars map loaded." in Japanese
        });
        imagerySource.on("tileloaderror", () => {
          console.error("A NASA WMTS imagery tile failed to load.");
          setStatus("Map loaded, but an imagery tile failed to load.");
        });
        const imageryLayer = new TileLayer({ source: imagerySource });

        // 5. Create the map.
        const view = new View({
          projection,
          resolutions: options.tileGrid.getResolutions(),
          extent,
          center: getCenter(extent),
        });

        const map = new Map({
          target: mapElement.current,
          layers: [imageryLayer],
          view,
        });

        pointerMoveKey = map.on("pointermove", ({ coordinate }) => {
          setCursorCoordinates({
            latitude: coordinate[1],
            longitude: coordinate[0],
          });
        });

        view.fit(extent, {
          padding: [40, 40, 40, 40],
          maxZoom: options.tileGrid.getMaxZoom(),
        });

        mapInstance.current = map;
        (
          globalThis as typeof globalThis & { marsMapDebug?: Map }
        ).marsMapDebug = map;
        setStatus("Map ready; loading Jezero imagery...");
      } catch (error) {
        console.error("Map initialization failed:", error);

        setStatus(
          error instanceof Error ? error.message : "Failed to initialize map",
        );
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      if (pointerMoveKey) {
        unByKey(pointerMoveKey);
      }
      mapInstance.current?.setTarget(undefined);
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="relative h-screen w-full bg-white">
      <div ref={mapElement} className="h-full w-full" />
      <div className="absolute flex flex-column items-center justify-between left-0 top-0 right-0 z-10 border border-red-500/40 bg-black/80 px-4 py-2 text-xs text-red-500">
        <h1 className="text-lg">M.A.R.S.</h1>
        <div className="flex flex-column gap-4 align-items">
          <p>LAT: {cursorCoordinates?.latitude.toFixed(6) ?? "--"}</p>
          <p>LON: {cursorCoordinates?.longitude.toFixed(6) ?? "--"}</p>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-10 border border-red-500/40 bg-black/80 px-4 py-2 text-xs text-red-500">
        <h1 className="">{status}</h1>
      </div>
    </div>
  );
}
