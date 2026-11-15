"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ENVIRONMENT_LAYERS } from "./mapLayers";
import type { EnvironmentMapLayerVisibility } from "./useMarsMap";

type EnvironmentMapLayersControlProps = {
  visibility: EnvironmentMapLayerVisibility;
  onVisibilityChange: (id: string, visible: boolean) => void;
};

export default function EnvironmentMapLayersControl({
  visibility,
  onVisibilityChange,
}: EnvironmentMapLayersControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="w-full shrink-0 border border-orange-500/40 bg-black/90 p-2 text-xs text-orange-200 shadow-lg shadow-black/40 sm:p-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-md text-orange-500 focus-visible:outline-2 focus-visible:outline-orange-400"
        aria-expanded={isExpanded}
        aria-controls="environment-map-layers"
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span>Environmental map layers</span>
        <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="environment-map-layers"
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="space-y-3 pt-3">
              {ENVIRONMENT_LAYERS.map((layer) => (
                <div
                  key={layer.id}
                  className="border-t border-orange-500/20 pt-2 first:border-0 first:pt-0"
                >
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={visibility[layer.id] ?? layer.visibleByDefault}
                      onChange={(event) =>
                        onVisibilityChange(layer.id, event.target.checked)
                      }
                    />
                    <span>{layer.name}</span>
                  </label>
                  <AnimatePresence initial={false}>
                    {(visibility[layer.id] ?? layer.visibleByDefault) && (
                      <motion.div
                        className="overflow-hidden pl-6 pt-2 leading-relaxed text-orange-100/70"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <span
                          className="block h-3 w-full rounded-sm border border-white/20"
                          role="img"
                          aria-label={`Color scale: ${layer.colorScale.join(", ")}`}
                          style={{
                            backgroundImage: `linear-gradient(to right, ${layer.colorScale.join(", ")})`,
                          }}
                        />
                        <div className="mt-1 flex justify-between gap-2 text-[0.65rem] text-orange-100/60">
                          <span>{layer.scaleLabels[0]}</span>
                          <span className="text-right">{layer.scaleLabels[1]}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
