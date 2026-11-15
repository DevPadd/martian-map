import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import Text from "ol/style/Text.js";

export const JEZERO_STUDY_AREA_CENTER: [number, number] = [77.43, 18.43];

export const JEZERO_STUDY_AREA_COORDINATES: [number, number][][] = [
  [
    [77.37, 18.43],
    [77.39, 18.47],
    [77.43, 18.49],
    [77.48, 18.47],
    [77.5, 18.43],
    [77.48, 18.39],
    [77.44, 18.37],
    [77.39, 18.39],
    [77.37, 18.43],
  ],
];

export function createJezeroStudyAreaLayer(): VectorLayer<VectorSource> {
  const feature = new Feature({
    geometry: new Polygon(JEZERO_STUDY_AREA_COORDINATES),
    name: "Illustrative Jezero study area",
  });
  feature.setId("jezero-life-search-study-area");

  return new VectorLayer({
    source: new VectorSource({ features: [feature] }),
    visible: false,
    style: new Style({
      fill: new Fill({ color: "rgba(16, 185, 129, 0.08)" }),
      stroke: new Stroke({
        color: "#34d399",
        width: 3,
        lineDash: [10, 8],
      }),
      text: new Text({
        text: "Illustrative study area",
        font: "bold 13px jetbrains-mono, monospace",
        fill: new Fill({ color: "#a7f3d0" }),
        stroke: new Stroke({ color: "#052e2b", width: 4 }),
      }),
    }),
    properties: { title: "Illustrative Jezero life-search study area" },
  });
}
