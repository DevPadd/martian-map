import type { MarsLandmark } from "./landmarkTypes";

const STORAGE_KEY = "martian-map.custom-landmarks";
const LANDMARK_CATEGORIES = ["crater", "delta", "mountain", "canyon", "misc"];

function isCustomLandmark(value: unknown): value is MarsLandmark {
  if (typeof value !== "object" || value === null) return false;
  const landmark = value as Partial<MarsLandmark>;
  const markerColor = landmark.markerColor;
  return (
    typeof landmark.id === "string" &&
    landmark.id.startsWith("user-") &&
    typeof landmark.name === "string" &&
    landmark.name.trim().length > 0 &&
    typeof landmark.category === "string" &&
    LANDMARK_CATEGORIES.includes(landmark.category) &&
    (markerColor === undefined ||
      (typeof markerColor === "string" &&
        /^#[0-9a-f]{6}$/i.test(markerColor))) &&
    Array.isArray(landmark.coordinates) &&
    landmark.coordinates.length === 2 &&
    Number.isFinite(landmark.coordinates[0]) &&
    Number.isFinite(landmark.coordinates[1]) &&
    Math.abs(landmark.coordinates[0]) <= 180 &&
    Math.abs(landmark.coordinates[1]) <= 90 &&
    typeof landmark.description === "string" &&
    typeof landmark.details === "string" &&
    Array.isArray(landmark.images) &&
    landmark.images.length === 0
  );
}

export function loadCustomLandmarks(): MarsLandmark[] {
  const storedLandmarks = window.localStorage.getItem(STORAGE_KEY);
  if (storedLandmarks === null) return [];

  const parsed: unknown = JSON.parse(storedLandmarks);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(isCustomLandmark) ||
    new Set(parsed.map(({ id }) => id)).size !== parsed.length
  ) {
    throw new Error("Stored custom landmarks have an invalid format.");
  }

  return parsed;
}

export function saveCustomLandmarks(landmarks: MarsLandmark[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(landmarks));
}
