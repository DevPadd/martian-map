export type MapLayerConfig = {
  id: string;
  name: string;
  capabilitiesUrl: string;
};

export const MAP_LAYERS = [
  {
    id: "Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw",
    name: "MGS MOLA and Mars Express HRSC, Hillshade Blend",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw/1.0.0/WMTSCapabilities.xml",
  },
  {
    id: "Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw",
    name: "MGS MOLA and Mars Express HRSC, Color Hillshade Blend",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw/1.0.0/WMTSCapabilities.xml",
  },
] as const satisfies readonly MapLayerConfig[];

export const JEZERO_CENTER: [number, number] = [77.3835, 18.4836];
export const JEZERO_ZOOM = 5;
