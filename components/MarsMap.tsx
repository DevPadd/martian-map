"use client";

import { useRef } from "react";

import MapStatus from "./map/MapStatus";
import MapToolbar from "./map/MapToolbar";
import { useMarsMap } from "./map/useMarsMap";

export default function MarsMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const { cursorCoordinates, onLayerChange, selectedLayerIndex, status } =
    useMarsMap(mapElement);

  return (
    <div className="relative h-screen w-full bg-white">
      <div ref={mapElement} className="h-full w-full" />
      <MapToolbar
        cursorCoordinates={cursorCoordinates}
        onLayerChange={onLayerChange}
        selectedLayerIndex={selectedLayerIndex}
      />
      <MapStatus status={status} />
    </div>
  );
}
