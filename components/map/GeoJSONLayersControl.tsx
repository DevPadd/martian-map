"use client";

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
  return (
    <aside className="fixed right-4 top-20 z-30 w-64 border border-red-500/40 bg-black/90 p-3 text-xs text-red-200 shadow-lg shadow-black/40">
      <h2 className="mb-3 text-md text-red-500">GeoJSON overlays</h2>
      <div className="space-y-3">
        {MISSION_DATA_LAYER_CONFIG.map(({ id, label, description }) => (
          <label key={id} className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={visibility[id] ?? false}
              onChange={(event) => onVisibilityChange(id, event.target.checked)}
            />
            <span>
              <span className="block">{label}</span>
              {description && (
                <span className="mt-1 block text-[0.65rem] text-red-200/60">
                  {description}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}
