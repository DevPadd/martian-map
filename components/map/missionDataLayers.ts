import GeoJSON from "ol/format/GeoJSON.js";
import type Feature from "ol/Feature.js";
import type Geometry from "ol/geom/Geometry.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import Text from "ol/style/Text.js";

import { MARS_CRS } from "./marsProjection";

const ROVER_PATH_URL = "/data/Rover%20Drive%20Path.geojson";
const SAMPLING_LOCATIONS_URL = "/data/Sampling%20Locations.geojson";

async function loadFeatures(
  url: string,
  signal: AbortSignal,
): Promise<Feature<Geometry>[]> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Could not load mission data (${response.status}): ${url}`);
  }

  const data: unknown = await response.json();
  const features = new GeoJSON().readFeatures(data, {
    dataProjection: MARS_CRS,
    featureProjection: MARS_CRS,
  });

  if (features.length === 0) {
    throw new Error(`The mission data file contains no features: ${url}`);
  }

  return features;
}

export async function createMissionDataLayers(signal: AbortSignal): Promise<{
  roverPathLayer: VectorLayer<VectorSource>;
  samplingLocationsLayer: VectorLayer<VectorSource>;
}> {
  const [roverPathFeatures, sampleFeatures] = await Promise.all([
    loadFeatures(ROVER_PATH_URL, signal),
    loadFeatures(SAMPLING_LOCATIONS_URL, signal),
  ]);

  const roverPathLayer = new VectorLayer({
    source: new VectorSource({ features: roverPathFeatures }),
    style: [
      new Style({
        stroke: new Stroke({ color: "#111827", width: 5 }),
      }),
      new Style({
        stroke: new Stroke({ color: "#22d3ee", width: 2.5 }),
      }),
    ],
    properties: { title: "Perseverance traverse" },
  });

  const samplingLocationsLayer = new VectorLayer({
    source: new VectorSource({ features: sampleFeatures }),
    declutter: true,
    style: (feature) => {
      const sampleName = feature.get("sample_name");
      const sampleNumber = feature.get("sample_num");
      const label =
        typeof sampleName === "string" && sampleName
          ? sampleName
          : typeof sampleNumber === "string"
            ? `Sample ${sampleNumber}`
            : "";

      return new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: "#facc15" }),
          stroke: new Stroke({ color: "#111827", width: 2 }),
        }),
        text: label
          ? new Text({
              text: label,
              offsetY: 13,
              font: "11px sans-serif",
              fill: new Fill({ color: "#fff" }),
              stroke: new Stroke({ color: "#111827", width: 3 }),
            })
          : undefined,
      });
    },
    properties: { title: "Perseverance sampling locations" },
  });

  return { roverPathLayer, samplingLocationsLayer };
}
