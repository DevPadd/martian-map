"use client";

import { useRef, useState } from "react";

import MapToolbar from "./map/MapToolbar";
import MapScaleControl from "./map/MapScaleControl";
import MapZoomControl from "./map/MapZoomControl";
import MapDistanceControl from "./map/MapDistanceControl";
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
    onRoverPathVisibilityChange,
    onSamplingLocationsVisibilityChange,
    roverPathVisible,
    selectedLayerIndex,
    samplingLocationsVisible,
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
        roverPathVisible={roverPathVisible}
        samplingLocationsVisible={samplingLocationsVisible}
        onRoverPathVisibilityChange={onRoverPathVisibilityChange}
        onSamplingLocationsVisibilityChange={
          onSamplingLocationsVisibilityChange
        }
      />
      <GuideBookFAB />
      <div className="absolute bottom-20 right-12 z-50">
        <MapZoomControl map={map} />
      </div>
      <div className="fixed bottom-30 right-2 z-50">
        <MapDistanceControl map={map} />
      </div>
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <MapScaleControl map={map} />
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
