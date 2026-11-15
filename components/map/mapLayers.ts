export type MapLayerConfig = {
  id: string;
  name: string;
  capabilitiesUrl: string;
};

export type RegionalMapLayerConfig = MapLayerConfig & {
  visibleByDefault: boolean;
};

export type EnvironmentMapLayerConfig = MapLayerConfig & {
  visibleByDefault: boolean;
  colorScale: readonly [
    startColor: string,
    ...intermediateColors: string[],
    endColor: string,
  ];
  scaleLabels: readonly [lowLabel: string, highLabel: string];
};

export const GLOBAL_MAP_LAYERS = [
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

export const REGIONAL_MAP_LAYERS = [
  {
    id: "JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd",
    name: "Jezero Crater HiRISE Ortho Mosaic",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
  },
  {
    id: "Gale_CTX_BlockAdj_dd",
    name: "MRO CTX, Gale Crater Mosaic",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Gale_CTX_BlockAdj_dd/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
  },
] as const satisfies readonly RegionalMapLayerConfig[];

export const ENVIRONMENT_LAYERS = [
  {
    id: "mola_roughness",
    name: "Roughness",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/mola_roughness/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
    colorScale: ["#4a5b47", "#d6dfe4"],
    scaleLabels: ["smooth", "rough"],
  },
  {
    id: "TES_Dust",
    name: "Dust",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/TES_Dust/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
    colorScale: ["#3b82f6", "#22c55e", "#ef4444"],
    scaleLabels: ["Low", "High"],
  },
  {
    id: "TES_Clinopyroxene",
    name: "Clinopyroxene",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/TES_Clinopyroxene/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
    colorScale: ["#3b82f6", "#22c55e", "#ef4444"],
    scaleLabels: ["Low", "High"],
  },
  {
    id: "TES_Plagioclase",
    name: "Plagioclase",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/TES_Plagioclase/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
    colorScale: ["#3b82f6", "#22c55e", "#ef4444"],
    scaleLabels: ["Low", "High"],
  },
  {
    id: "TES_Glass_Clay",
    name: "Glass Clay",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/TES_Glass_Clay/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
    colorScale: ["#3b82f6", "#22c55e", "#ef4444"],
    scaleLabels: ["Low", "High"],
  },
  {
    id: "Mars_MGS_TES_Albedo_mosaic_global_7410m",
    name: "Albedo",
    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_TES_Albedo_mosaic_global_7410m/1.0.0/WMTSCapabilities.xml",
    visibleByDefault: false,
    colorScale: ["#374151", "#e5e7eb"],
    scaleLabels: ["Low reflectivity", "High reflectivity"],
  },
] as const satisfies readonly EnvironmentMapLayerConfig[];

export const JEZERO_CENTER: [number, number] = [77.3835, 18.4836];
export const JEZERO_ZOOM = 5;
