"use client";

import { useEffect, useState } from "react";
import { MapPinPlusInside, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type Map from "ol/Map.js";
import { unByKey } from "ol/Observable.js";

import {
  LANDMARK_CATEGORY_COLORS,
  type LandmarkCategory,
  type MarsLandmark,
} from "./landmarkTypes";

const LANDMARK_CATEGORIES: LandmarkCategory[] = [
  "crater",
  "delta",
  "mountain",
  "canyon",
  "misc",
];

function isLandmarkCategory(value: string): value is LandmarkCategory {
  return LANDMARK_CATEGORIES.some((category) => category === value);
}

type AddLandmarkControlProps = {
  map: Map | null;
  landmarks: MarsLandmark[];
  isAdding: boolean;
  drawingDisabled: boolean;
  storageError: string | null;
  onLandmarksChange: (landmarks: MarsLandmark[]) => void;
  onDrawingChange: (isAdding: boolean) => void;
};

export default function AddLandmarkControl({
  map,
  landmarks,
  isAdding,
  drawingDisabled,
  storageError,
  onLandmarksChange,
  onDrawingChange,
}: AddLandmarkControlProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState<LandmarkCategory>("misc");
  const [markerColor, setMarkerColor] = useState(
    LANDMARK_CATEGORY_COLORS.misc,
  );
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!map || !isAdding) return;

    const mapTarget = map.getTargetElement();
    if (mapTarget) mapTarget.style.cursor = "crosshair";

    const clickKey = map.on("singleclick", ({ coordinate }) => {
      if (
        !Number.isFinite(coordinate[0]) ||
        !Number.isFinite(coordinate[1]) ||
        Math.abs(coordinate[0]) > 180 ||
        Math.abs(coordinate[1]) > 90
      ) {
        setFormError("Select a valid Mars longitude and latitude.");
        onDrawingChange(false);
        return;
      }

      setCoordinates([coordinate[0], coordinate[1]]);
      setFormError(null);
      onDrawingChange(false);
    });

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        onDrawingChange(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (mapTarget) mapTarget.style.cursor = "";
      unByKey(clickKey);
    };
  }, [isAdding, map, onDrawingChange]);

  function startAdding(): void {
    setCoordinates(null);
    setName("");
    setDetails("");
    setCategory("misc");
    setMarkerColor(LANDMARK_CATEGORY_COLORS.misc);
    setFormError(null);
    onDrawingChange(true);
  }

  function cancel(): void {
    setCoordinates(null);
    setName("");
    setDetails("");
    setCategory("misc");
    setMarkerColor(LANDMARK_CATEGORY_COLORS.misc);
    setFormError(null);
    onDrawingChange(false);
  }

  function save(): void {
    const normalizedName = name.trim();
    if (!coordinates || !normalizedName) {
      setFormError("Choose a map location and enter a point name.");
      return;
    }

    const landmark: MarsLandmark = {
      id: `user-${crypto.randomUUID()}`,
      name: normalizedName,
      category,
      markerColor,
      coordinates,
      description: details.trim() || "User-added Mars point.",
      details: details.trim() || "User-added Mars point.",
      images: [],
    };
    onLandmarksChange([...landmarks, landmark]);
    cancel();
  }

  function removeLandmark(id: string): void {
    onLandmarksChange(landmarks.filter((landmark) => landmark.id !== id));
  }

  const panelVisible =
    isAdding ||
    coordinates !== null ||
    landmarks.length > 0 ||
    formError !== null ||
    storageError !== null;

  return (
    <div className="relative z-50 flex justify-end">
      <button
        type="button"
        className="mars-map-tool-button cursor-pointer border border-sky-400/60 bg-black/90 text-sky-300 shadow-lg shadow-black/40 transition hover:bg-sky-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!map || (drawingDisabled && !isAdding)}
        onClick={isAdding ? cancel : startAdding}
        aria-label={isAdding ? "Cancel adding a map point" : "Add a map point"}
        aria-pressed={isAdding}
        title={
          drawingDisabled
            ? "Finish or cancel the other map drawing first"
            : "Add a point to the map"
        }
      >
        {isAdding ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MapPinPlusInside className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      <AnimatePresence>
        {panelVisible && (
          <motion.section
            className="mars-add-landmark-panel absolute right-0 mb-2 w-[min(20rem,calc(100vw-1rem))] border border-sky-400/60 bg-black/95 p-3 text-xs text-sky-100 shadow-xl shadow-black/50"
            aria-label="Add and manage map points"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sky-300">
                {isAdding
                  ? "Choose a point location"
                  : coordinates
                    ? "Save map point"
                    : "Custom map points"}
              </p>
              <button
                type="button"
                onClick={cancel}
                className="text-lg leading-4 text-sky-300 hover:text-white"
                aria-label="Close add point panel"
              >
                ×
              </button>
            </div>
            {isAdding && (
              <p className="mt-1 leading-relaxed text-sky-100/75">
                Click the map to set the location. Press Esc to cancel.
              </p>
            )}
            {coordinates && (
              <div className="mt-2 space-y-2">
                <p className="font-mono text-sky-200/80">
                  LAT {coordinates[1].toFixed(4)}° · LON{" "}
                  {coordinates[0].toFixed(4)}°
                </p>
                <label className="grid gap-1">
                  <span>Point name</span>
                  <input
                    autoFocus
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="border border-sky-400/40 bg-black px-2 py-1 text-sky-100 outline-sky-400"
                    placeholder="e.g. Rover waypoint"
                  />
                </label>
                <label className="grid gap-1">
                  <span>Category</span>
                  <select
                    value={category}
                    onChange={(event) => {
                      const nextCategory = event.target.value;
                      if (!isLandmarkCategory(nextCategory)) return;
                      setCategory(nextCategory);
                      setMarkerColor(LANDMARK_CATEGORY_COLORS[nextCategory]);
                    }}
                    className="border border-sky-400/40 bg-black px-2 py-1 text-sky-100 outline-sky-400"
                  >
                    {LANDMARK_CATEGORIES.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center justify-between gap-2">
                  <span>Marker color</span>
                  <input
                    type="color"
                    value={markerColor}
                    onChange={(event) => setMarkerColor(event.target.value)}
                    aria-label="Marker color"
                    className="h-8 w-12 cursor-pointer border border-sky-400/40 bg-black p-0.5"
                  />
                </label>
                <label className="grid gap-1">
                  <span>Notes (optional)</span>
                  <textarea
                    maxLength={1000}
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    className="min-h-16 resize-y border border-sky-400/40 bg-black px-2 py-1 text-sky-100 outline-sky-400"
                    placeholder="Add a description or field notes"
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancel}
                    className="border border-sky-400/40 px-2 py-1 hover:bg-sky-950"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={!name.trim()}
                    className="border border-sky-400/60 px-2 py-1 text-sky-200 hover:bg-sky-950 disabled:opacity-50"
                  >
                    Save point
                  </button>
                </div>
              </div>
            )}
            {formError && (
              <p className="mt-2 text-red-300" role="alert">
                {formError}
              </p>
            )}
            {storageError && (
              <p className="mt-2 text-amber-300" role="alert">
                {storageError}
              </p>
            )}
            {landmarks.length > 0 && (
              <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto border-t border-sky-400/20 pt-2">
                {landmarks.map((landmark) => (
                  <li
                    key={landmark.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate">{landmark.name}</span>
                    <button
                      type="button"
                      onClick={() => removeLandmark(landmark.id)}
                      className="shrink-0 p-1 text-sky-300 hover:text-red-300"
                      aria-label={`Delete ${landmark.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
