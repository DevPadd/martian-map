export type GuideBookSection = {
  heading: string;
  body: string;
  steps?: string[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const GUIDEBOOK_TITLE = "WELCOME ABOARD, ASTRONAUT!";

export const GUIDEBOOK_INTRO =
  "You are joining a Mars surface reconnaissance mission as a junior explorer. Use the map to compare terrain datasets, inspect landmarks and rover routes, and try the drawing tools. The mission and survival material is educational context, not operational guidance.";

export const GUIDEBOOK_SECTIONS: GuideBookSection[] = [
  {
    heading: "Navigate the map",
    body: "The map opens centered on Jezero Crater. Explore it to compare terrain and put landmarks, routes, and scientific context in their geographic setting.",
    steps: [
      "Drag the map to pan. Use the plus/minus controls or scroll to zoom.",
      "Read the header coordinates to see the cursor's Mars latitude and longitude; use the scale bar to estimate ground distance.",
      "Select a global imagery layer from the header to change the map's basemap.",
    ],
    image: {
      src: "/guidebook/pan-and-zoom.png",
      alt: "Map control buttons for panning and zooming.",
      width: 500,
      height: 500,
    },
  },
  {
    heading: "Compare map layers",
    body: "The layer panels add information over the selected basemap. Global elevation and shaded-relief products show broad context; regional imagery provides more detail where available; environmental products show mapped properties such as roughness, dust, and mineral detections.",
    image: {
      src: "/guidebook/environment-layers.png",
      alt: "Map controls showing GeoJSON, regional, and environmental layer checkboxes.",
      width: 267,
      height: 515,
    },
    steps: [
      "Expand Regional map overlays, Environmental map layers, or GeoJSON overlays.",
      "Turn individual checkboxes on or off to compare products. An environmental layer's color scale and labels appear while it is enabled.",
      "Enable GeoJSON overlays to view rover traverse paths and layered-ejecta crater data.",
    ],
  },
  {
    heading: "Explore landmarks and add map points",
    body: "Preset landmarks identify notable places and include additional science context. You can also add personal points to mark locations you want to revisit.",
    image: {
      src: "/guidebook/create-custom-landmark.png",
      alt: "Custom map point form with location coordinates, name, category, color, and notes fields.",
      width: 334,
      height: 597,
    },
    steps: [
      "Select a preset marker to read its summary, then choose “See more” to open its dossier when available.",
      "Choose the add-map-point control, click a location on the map, then enter a name and optional category, color, and notes before saving.",
      "Manage or delete your custom points in the points panel. They are saved in this browser's local storage.",
    ],
  },
  {
    heading: "Measure a route",
    body: "The distance tool measures a freehand line along the Mars surface and can estimate travel time and per-person food allocation using values you provide.",
    image: {
      src: "/guidebook/distance-estimator.png",
      alt: "A Mars route measurement with distance, travel rate, food allocation, and estimated results.",
      width: 794,
      height: 404,
    },
    steps: [
      "Choose the distance-measurement control, then click and drag on the map to sketch a route; release to finish.",
      "Enter a planned travel rate in km/sol to estimate sols and Earth days. Enter a food allocation in kg per person per sol to estimate the ration per person.",
      "Use the clear button to remove the measurement. The estimate depends on your inputs and is not a mission-ready prediction.",
    ],
  },
  {
    heading: "Draw a research perimeter",
    body: "Sketch a freehand area to see its approximate size. This temporary annotation is useful for exploration, but it is not saved as a project.",
    image: {
      src: "/guidebook/draw-perimeter.png",
      alt: "A freehand research perimeter drawn on the map, with its approximate area and clear control.",
      width: 394,
      height: 243,
    },
    steps: [
      "Choose the perimeter control, then click and drag on the map to outline an area; release to finish.",
      "Read the approximate area in the panel. Choose “Clear perimeter” to remove it, or start drawing again to replace it.",
      "Press Escape to cancel an active drawing. Only one map drawing tool can be active at a time.",
    ],
  },
  {
    heading: "Explore the mission and survival guides",
    body: "The ADAM Expedition briefing and timeline describe a fictional Jezero life-search concept. The Survival Module is a searchable learning guide about Mars, exploration hazards, and past missions.",
    steps: [
      "Open the mission briefing to read its objectives and potential obstructions. Turn on “Show Jezero study-area perimeter” to display the illustrative boundary and focus the map on it.",
      "Use “Focus map on study area” to return to the outlined area. Show or hide the mission timeline with its timeline control.",
      "Open the Survival Module to browse or search articles, filter by category, and follow related hazard, map-layer, or landmark references.",
    ],
  },
  {
    heading: "Coordinate convention",
    body: "The map uses a Mars-specific longitude/latitude reference. Longitudes are displayed in the map's -180° to 180° range. Do not treat these coordinates as Earth locations or convert them with an Earth map projection.",
  },
  {
    heading: "Use data responsibly",
    body: "Imagery and overlays may be incomplete, dated, unavailable at some zoom levels, or limited by their resolution. The map, fictional mission schedule, survival guide, and user-entered estimates are educational tools—not certified navigation, route-safety, survival, or real-time hazard systems.",
  },
];
