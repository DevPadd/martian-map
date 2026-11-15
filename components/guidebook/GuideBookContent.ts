export type GuideBookSection = {
  heading: string;
  body: string;
  steps?: string[];
};

export const GUIDEBOOK_TITLE = "M.A.R.S. Mission Field Guide";

export const GUIDEBOOK_INTRO =
  "Welcome aboard, astronaut. You are joining a Mars surface reconnaissance mission as a junior explorer. Use this map to get oriented, inspect major terrain features, and understand the imagery before planning your next observation.";

export const GUIDEBOOK_SECTIONS: GuideBookSection[] = [
  {
    heading: "Your assignment",
    body:
      "Survey the Martian surface, identify locations worth a closer look, and use the available map tools to build situational awareness. This guide is an introduction to the M.A.R.S. map interface, not operational flight or surface-safety guidance.",
  },
  {
    heading: "Navigate the surface",
    body:
      "Explore the map as you would a digital chart. The coordinates shown in the header follow the map's Mars longitude and latitude convention.",
    steps: [
      "Drag the map to pan across Mars.",
      "Use the plus and minus controls, or your scroll wheel, to zoom.",
      "Read the distance scale at the bottom to estimate ground distance.",
    ],
  },
  {
    heading: "Choose your imagery",
    body:
      "Use the layer selector in the header to change the raster imagery. Global elevation and hillshade layers provide broad context, while regional datasets reveal more detail where coverage is available. The visible detail depends on the selected layer.",
  },
  {
    heading: "Inspect landmarks",
    body:
      "Premade markers identify notable craters, deltas, mountains, and other locations. Hover over a marker for a quick summary. Select “See more” to open its field dossier with additional notes, coordinates, images, and source credits.",
  },
  {
    heading: "Coordinate convention",
    body:
      "The map uses a Mars-specific longitude/latitude reference. Longitudes are displayed in the map's -180° to 180° range. Do not treat these coordinates as Earth locations or convert them with an Earth map projection.",
  },
];