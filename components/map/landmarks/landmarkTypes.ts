export type LandmarkCategory =
  | "crater"
  | "delta"
  | "mountain"
  | "canyon"
  | "misc";

export const LANDMARK_CATEGORY_COLORS: Record<LandmarkCategory, string> = {
  crater: "#f97316",
  delta: "#38bdf8",
  mountain: "#facc15",
  canyon: "#c084fc",
  misc: "#22c55e",
};

export type MarsLandmark = {
  id: string;
  name: string;
  category: LandmarkCategory;
  markerColor?: string;
  coordinates: [longitude: number, latitude: number];
  description: string;
  details: string;
  images: LandmarkImage[];
};

export type LandmarkImage = {
  src: string;
  alt: string;
  caption: string;
  attribution: string;
  sourceUrl: string;
  width: number;
  height: number;
};
