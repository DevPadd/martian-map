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
  {
    id: "JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd",
    name: "Jezero Crater HiRISE Ortho Mosaic",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/WMTSCapabilities.xml",
  },
  {
    id: "Gale_CTX_BlockAdj_dd",
    name: "MRO CTX, Gale Crater Mosaic",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Gale_CTX_BlockAdj_dd/1.0.0/WMTSCapabilities.xml",
  },
] as const satisfies readonly MapLayerConfig[];

export const GLOBAL_MAP_LAYERS = MAP_LAYERS.slice(0, 2);
export const REGIONAL_MAP_LAYERS = MAP_LAYERS.slice(2).map((layer) => ({
  ...layer,
  visibleByDefault: false,
}));

export const JEZERO_CENTER: [number, number] = [77.3835, 18.4836];
export const JEZERO_ZOOM = 5;
