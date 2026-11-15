import GeoJSON from "ol/format/GeoJSON.js";
import type Feature from "ol/Feature.js";
import type Geometry from "ol/geom/Geometry.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import type { StyleFunction } from "ol/style/Style.js";
import Text from "ol/style/Text.js";

import { MARS_CRS } from "./marsProjection";

type MissionDataLayerConfig = {
  id: string;
  file: string;
  label: string;
  visibleByDefault: boolean;
  description?: string;
  style?: StyleFunction;
};

const roverPathStyle: StyleFunction = () => [
  new Style({
    stroke: new Stroke({ color: "#111827", width: 5 }),
  }),
  new Style({
    stroke: new Stroke({ color: "#22d3ee", width: 2.5 }),
  }),
];

const samplingLocationsStyle: StyleFunction = (feature) => {
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
};

const craterMorphologyColors: Record<string, string> = {
  DLE: "#fb923c",
  LARLE: "#f472b6",
  MLE: "#a78bfa",
  SLE: "#4ade80",
};

const layeredCratersStyle: StyleFunction = (feature) => {
  const morphology = feature.get("lrd_morph");
  const color =
    typeof morphology === "string"
      ? (craterMorphologyColors[morphology] ?? "#f8fafc")
      : "#f8fafc";

  return new Style({
    image: new CircleStyle({
      radius: 3,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "#111827", width: 1 }),
    }),
  });
};

const defaultStyle: StyleFunction = (feature) => {
  const geometryType = feature.getGeometry()?.getType();

  if (geometryType === "Point" || geometryType === "MultiPoint") {
    return new Style({
      image: new CircleStyle({
        radius: 4,
        fill: new Fill({ color: "#fb923c" }),
        stroke: new Stroke({ color: "#111827", width: 1.5 }),
      }),
    });
  }

  if (geometryType === "LineString" || geometryType === "MultiLineString") {
    return new Style({
      stroke: new Stroke({ color: "#fb923c", width: 2.5 }),
    });
  }

  return new Style({
    fill: new Fill({ color: "rgba(251, 146, 60, 0.25)" }),
    stroke: new Stroke({ color: "#fb923c", width: 2 }),
  });
};

// Add one entry per file in public/data; custom styles are optional.
export const MISSION_DATA_LAYER_CONFIG: readonly MissionDataLayerConfig[] = [
  {
    id: "roverPath",
    file: "Rover Drive Path.geojson",
    label: "Perseverance traverse path",
    visibleByDefault: false,
    style: roverPathStyle,
  },
  {
    id: "curiosityPath",
    file: "curiosity-path.geojson",
    label: "Curiosity traverse path",
    visibleByDefault: false,
  },
  // {
  //   id: "samplingLocations",
  //   file: "Sampling Locations.geojson",
  //   label: "Sampling locations",
  //   visibleByDefault: true,
  //   style: samplingLocationsStyle,
  // },
  {
    id: "layeredCraters",
    file: "alagain_martian_crater_layered_db.geojson",
    label: "Layered ejecta craters",
    // description: "Markers are colored by ejecta morphology.",
    visibleByDefault: false,
    style: layeredCratersStyle,
  },
];

export type MissionDataLayerVisibility = Record<string, boolean>;

export function createInitialMissionDataLayerVisibility(): MissionDataLayerVisibility {
  return Object.fromEntries(
    MISSION_DATA_LAYER_CONFIG.map(({ id, visibleByDefault }) => [
      id,
      visibleByDefault,
    ]),
  );
}

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

export async function createMissionDataLayers(
  signal: AbortSignal,
): Promise<Map<string, VectorLayer<VectorSource>>> {
  const layers = await Promise.all(
    MISSION_DATA_LAYER_CONFIG.map(async (config) => {
      const url = `/data/${encodeURIComponent(config.file)}`;
      const features = await loadFeatures(url, signal);
      const layer = new VectorLayer({
        source: new VectorSource({ features }),
        declutter: true,
        visible: config.visibleByDefault,
        style: config.style ?? defaultStyle,
        properties: { title: config.label },
      });

      return [config.id, layer] as const;
    }),
  );

  return new Map(layers);
}
