import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import Text from "ol/style/Text.js";

import { LANDMARK_CATALOG } from "./landmarkCatalog";
import {
  LANDMARK_CATEGORY_COLORS,
  type MarsLandmark,
} from "./landmarkTypes";

export function createLandmarkFeature(landmark: MarsLandmark): Feature<Point> {
  const color =
    landmark.markerColor ?? LANDMARK_CATEGORY_COLORS[landmark.category];
  const feature = new Feature({
    geometry: new Point(landmark.coordinates),
    id: landmark.id,
    name: landmark.name,
    category: landmark.category,
    description: landmark.description,
  });

  feature.setId(landmark.id);
  feature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: "#111827", width: 2 }),
      }),
      text: new Text({
        text: landmark.name,
        offsetY: 16,
        font: "14px jetbrains-mono, monospace",
        fill: new Fill({ color: "#fdba74" }),
        stroke: new Stroke({ color: "#111827", width: 3 }),
      }),
    }),
  );

  return feature;
}

export function createLandmarkLayer(
  customLandmarks: MarsLandmark[] = [],
): VectorLayer<VectorSource> {
  const source = new VectorSource({
    features: [...LANDMARK_CATALOG, ...customLandmarks].map(
      createLandmarkFeature,
    ),
  });

  return new VectorLayer({
    source,
    declutter: true,
    properties: {
      title: "Premade Mars landmarks",
    },
  });
}

export function updateCustomLandmarks(
  layer: VectorLayer<VectorSource>,
  customLandmarks: MarsLandmark[],
): void {
  const source = layer.getSource();
  if (!source) return;

  source.clear();
  source.addFeatures(
    [...LANDMARK_CATALOG, ...customLandmarks].map(createLandmarkFeature),
  );
}
