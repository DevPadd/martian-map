export type LandmarkCategory =
  | "crater"
  | "delta"
  | "mountain"
  | "canyon"
  | "misc";

export type MarsLandmark = {
  id: string;
  name: string;
  category: LandmarkCategory;
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
