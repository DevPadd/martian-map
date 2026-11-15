"use client";

import { GLOBAL_MAP_LAYERS } from "./mapLayers";
import type { CursorCoordinates } from "./useMarsMap";
import { Galaxy } from "lucide-react";
import Link from "next/link";

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
    <div className="absolute left-0 right-0 top-0 z-60 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border border-orange-500/40 bg-black/90 px-2 py-2 text-xs text-orange-500 sm:flex sm:gap-4 sm:px-4">
      <Link href="https://github.com/DevPadd/martian-map">
        <h1 className="whitespace-nowrap border border-orange-500 px-1 py-1 text-base sm:text-lg">
          <Galaxy className="inline-block h-6 w-6" /> B.C.I.
        </h1>
      </Link>

      <label className="flex min-w-0 items-center justify-self-end gap-2 sm:justify-self-auto">
        <select
          aria-label="Select Mars imagery layer"
          className="min-w-0 max-w-[55vw] border border-orange-500/40 bg-black px-2 py-1 text-orange-500 sm:max-w-none"
          value={selectedLayerIndex}
          onChange={(event) => onLayerChange(Number(event.target.value))}
        >
          {GLOBAL_MAP_LAYERS.map((layer, index) => (
            <option key={layer.id} value={index}>
              {layer.name}
            </option>
          ))}
        </select>
      </label>
      <div className="col-span-2 flex justify-center gap-3 border-t border-orange-500/20 pt-2 sm:ml-auto sm:gap-4 sm:border-0 sm:pt-0">
        <p>LAT: {cursorCoordinates?.latitude.toFixed(4) ?? "--"}°</p>
        <p>LON: {cursorCoordinates?.longitude.toFixed(4) ?? "--"}°</p>
      </div>
    </div>
  );
}
