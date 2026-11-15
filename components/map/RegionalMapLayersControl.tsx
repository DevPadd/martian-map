"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { REGIONAL_MAP_LAYERS } from "./mapLayers";
import type { RegionalMapLayerVisibility } from "./useMarsMap";

type RegionalMapLayersControlProps = {
  visibility: RegionalMapLayerVisibility;
  onVisibilityChange: (id: string, visible: boolean) => void;
};

export default function RegionalMapLayersControl({
  visibility,
  onVisibilityChange,
}: RegionalMapLayersControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="w-full shrink-0 border border-orange-500/40 bg-black/90 p-2 text-xs text-orange-200 shadow-lg shadow-black/40 sm:p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-md   text-orange-500 focus-visible:outline-2 focus-visible:outline-orange-400"
        aria-expanded={isExpanded}
        aria-controls="regional-map-layers"
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span>Regional map overlays</span>
        <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="regional-map-layers"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="pt-3">
              <div className="space-y-3">
                {REGIONAL_MAP_LAYERS.map((layer) => (
                  <label
                    key={layer.id}
                    className="flex cursor-pointer items-start gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={
                        visibility[layer.id] ?? layer.visibleByDefault
                      }
                      onChange={(event) =>
                        onVisibilityChange(layer.id, event.target.checked)
                      }
                    />
                    <span>{layer.name}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 border-t border-orange-500/20 pt-2 text-[0.65rem] text-orange-200/60">
                Regional imagery is drawn over the selected global basemap
                where coverage exists.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
