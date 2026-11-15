"use client";

import { useRef, useState } from "react";

import MapToolbar from "./map/MapToolbar";
import MapZoomControl from "./map/MapZoomControl";
import { useMarsMap } from "./map/useMarsMap";
import GuideBookFAB from "./guidebook/GuideBookFAB";
import LandmarkPopup from "./map/landmarks/LandmarkPopup";
import LandmarkSidebar from "./map/landmarks/LandmarkSidebar";
import type { MarsLandmark } from "./map/landmarks/landmarkTypes";
import { useLandmarkPopup } from "./map/landmarks/useLandmarkPopup";

export default function MarsMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);
  const [sidebarLandmark, setSidebarLandmark] = useState<MarsLandmark | null>(
    null,
  );
  const {
    cursorCoordinates,
    landmarkLayer,
    map,
    onLayerChange,
    selectedLayerIndex,
  } = useMarsMap(mapElement);
  const { closePopup, selectedLandmark } = useLandmarkPopup(
    map,
    landmarkLayer,
    popupElement,
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-white">
      <div ref={mapElement} className="h-full w-full" />
      <MapToolbar
        cursorCoordinates={cursorCoordinates}
        onLayerChange={onLayerChange}
        selectedLayerIndex={selectedLayerIndex}
      />
      <GuideBookFAB />
      <MapStatus status={status} />
      <div className="absolute bottom-20 right-12 z-50">
        <MapZoomControl map={map} />
      </div>
      <LandmarkPopup
        elementRef={popupElement}
        landmark={selectedLandmark}
        onClose={closePopup}
        onSeeMore={setSidebarLandmark}
      />
      <LandmarkSidebar
        landmark={sidebarLandmark}
        onClose={() => setSidebarLandmark(null)}
      />
      {/* <MapStatus status={status} /> */}
    </div>
  );
}
