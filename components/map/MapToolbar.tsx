"use client";

import { MAP_LAYERS } from "./mapLayers";
import type { CursorCoordinates } from "./useMarsMap";
import { Galaxy } from "lucide-react";

type MapToolbarProps = {
  cursorCoordinates: CursorCoordinates | null;
  onLayerChange: (index: number) => void;
  selectedLayerIndex: number;
  roverPathVisible: boolean;
  samplingLocationsVisible: boolean;
  onRoverPathVisibilityChange: (visible: boolean) => void;
  onSamplingLocationsVisibilityChange: (visible: boolean) => void;
};

export default function MapToolbar({
  cursorCoordinates,
  onLayerChange,
  selectedLayerIndex,
  roverPathVisible,
  samplingLocationsVisible,
  onRoverPathVisibilityChange,
  onSamplingLocationsVisibilityChange,
}: MapToolbarProps) {
  return (
    <div className="absolute left-0 right-0 top-0 z-10 flex flex-column items-center justify-between border border-red-500/40 bg-black/80 px-4 py-2 text-xs text-red-500">
      <h1 className="text-lg">
        <Galaxy className="inline-block h-6 w-6" /> M.A.R.S.
      </h1>
      <label className="flex items-center gap-2">
        Layer
        <select
          aria-label="Select Mars imagery layer"
          className="border border-red-500/40 bg-black px-2 py-1 text-red-500"
          value={selectedLayerIndex}
          onChange={(event) => onLayerChange(Number(event.target.value))}
        >
          {MAP_LAYERS.map((layer, index) => (
            <option key={layer.id} value={index}>
              {layer.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={roverPathVisible}
            onChange={(event) =>
              onRoverPathVisibilityChange(event.target.checked)
            }
          />
          Perseverance traverse
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={samplingLocationsVisible}
            onChange={(event) =>
              onSamplingLocationsVisibilityChange(event.target.checked)
            }
          />
          Sampling locations
        </label>
      </div>
      <div className="flex flex-column gap-4 align-items">
        <p>LAT: {cursorCoordinates?.latitude.toFixed(4) ?? "--"}</p>
        <p>LON: {cursorCoordinates?.longitude.toFixed(4) ?? "--"}</p>
      </div>
    </div>
  );
}
