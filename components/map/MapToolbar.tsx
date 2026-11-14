"use client";

import { MAP_LAYERS } from "./mapLayers";
import type { CursorCoordinates } from "./useMarsMap";

type MapToolbarProps = {
  cursorCoordinates: CursorCoordinates | null;
  onLayerChange: (index: number) => void;
  selectedLayerIndex: number;
};

export default function MapToolbar({
  cursorCoordinates,
  onLayerChange,
  selectedLayerIndex,
}: MapToolbarProps) {
  return (
    <div className="absolute left-0 right-0 top-0 z-10 flex flex-column items-center justify-between border border-red-500/40 bg-black/80 px-4 py-2 text-xs text-red-500">
      <h1 className="text-lg">M.A.R.S.</h1>
      <div className="flex flex-column gap-4 align-items">
        <p>LAT: {cursorCoordinates?.latitude.toFixed(4) ?? "--"}</p>
        <p>LON: {cursorCoordinates?.longitude.toFixed(4) ?? "--"}</p>
      </div>
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
    </div>
  );
}
