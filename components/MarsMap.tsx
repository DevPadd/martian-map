"use client";

import { useRef, useState } from "react";
import { MotionConfig } from "motion/react";

import SurvivalModuleFAB from "./survival-module/SurvivalModuleFAB";
import MapToolbar from "./map/MapToolbar";
import GeoJSONLayersControl from "./map/GeoJSONLayersControl";
import RegionalMapLayersControl from "./map/RegionalMapLayersControl";
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
    onMissionDataLayerVisibilityChange,
    onRegionalMapLayerVisibilityChange,
    missionDataLayerVisibility,
    regionalMapLayerVisibility,
    selectedLayerIndex,
  } = useMarsMap(mapElement);
  const { closePopup, selectedLandmark } = useLandmarkPopup(
    map,
    landmarkLayer,
    popupElement,
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-dvh w-full overflow-hidden bg-white">
      <div ref={mapElement} className="h-full w-full" />
      <MapToolbar
        cursorCoordinates={cursorCoordinates}
        onLayerChange={onLayerChange}
        selectedLayerIndex={selectedLayerIndex}
      />
      <div className="fixed left-2 right-2 top-24 z-30 flex max-h-[calc(100dvh-7rem)] flex-col gap-2 overflow-y-auto sm:left-auto sm:right-4 sm:top-20 sm:w-64">
        <GeoJSONLayersControl
          visibility={missionDataLayerVisibility}
          onVisibilityChange={onMissionDataLayerVisibilityChange}
        />
        <RegionalMapLayersControl
          visibility={regionalMapLayerVisibility}
          onVisibilityChange={onRegionalMapLayerVisibilityChange}
        />
      </div>

      <SurvivalModuleFAB
        map={map}
        onLayerChange={onLayerChange}
        onRegionalLayerVisibilityChange={onRegionalMapLayerVisibilityChange}
      />
      <GuideBookFAB />
      <div className="absolute bottom-20 right-12 z-50">
        <MapZoomControl map={map} />
      </div>
      <div className="fixed bottom-50 right-2 z-50">
        <MapDistanceControl map={map} />
      </div>
      <div className="fixed bottom-4  left-1/2 z-40 -translate-x-1/2">
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
    </MotionConfig>
  );
}
