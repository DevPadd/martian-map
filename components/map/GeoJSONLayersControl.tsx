"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { MISSION_DATA_LAYER_CONFIG } from "./missionDataLayers";
import type { MissionDataLayerVisibility } from "./missionDataLayers";

type GeoJSONLayersControlProps = {
  visibility: MissionDataLayerVisibility;
  onVisibilityChange: (id: string, visible: boolean) => void;
};

export default function GeoJSONLayersControl({
  visibility,
  onVisibilityChange,
}: GeoJSONLayersControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className="w-full shrink-0 border border-orange-500/40 bg-black/90 p-2 text-xs text-orange-200 shadow-lg shadow-black/40 sm:p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-md text-orange-500 focus-visible:outline-2 focus-visible:outline-orange-400"
        aria-expanded={isExpanded}
        aria-controls="geojson-map-layers"
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span>GeoJSON overlays</span>
        <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="geojson-map-layers"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="pt-3">
              <div className="space-y-3">
                {MISSION_DATA_LAYER_CONFIG.map(({ id, label, description }) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-start gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={visibility[id] ?? false}
                      onChange={(event) =>
                        onVisibilityChange(id, event.target.checked)
                      }
                    />
                    <span>
                      <span className="block">{label}</span>
                      {description && (
                        <span className="mt-1 block text-[0.65rem] text-orange-200/60">
                          {description}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
