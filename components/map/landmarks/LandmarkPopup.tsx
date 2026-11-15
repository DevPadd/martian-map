"use client";

import type { RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";

import type { MarsLandmark } from "./landmarkTypes";

type LandmarkPopupProps = {
  landmark: MarsLandmark | null;
  elementRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onSeeMore: (landmark: MarsLandmark) => void;
};

export default function LandmarkPopup({
  landmark,
  elementRef,
  onClose,
  onSeeMore,
}: LandmarkPopupProps) {
  return (
    <div
      ref={elementRef}
      className="mars-landmark-popup"
      role="dialog"
      aria-label={landmark ? `${landmark.name} details` : undefined}
    >
      <AnimatePresence>
        {landmark && (
          <motion.article
            key={landmark.id}
            className="w-72 border border-orange-500/50 bg-black/90 p-4 text-sm text-orange-100 shadow-xl"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-orange-400">
                {landmark.category}
              </p>
              <h2 className="text-base font-semibold text-orange-300">
                {landmark.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 text-lg leading-6 text-orange-300 hover:bg-orange-500/20"
              aria-label="Close landmark details"
            >
              ×
            </button>
          </div>
          <p className="mb-3 text-xs text-orange-200/80">{landmark.description}</p>
          <p className="font-mono text-xs text-orange-400">
            LAT {landmark.coordinates[1].toFixed(4)}° · LON{" "}
            {landmark.coordinates[0].toFixed(4)}°
          </p>
          <button
            type="button"
            className="mt-3 cursor-pointer border border-orange-500/50 px-3 py-1 text-xs text-orange-300 hover:bg-orange-500/20"
            onClick={() => onSeeMore(landmark)}
          >
            See more
          </button>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
