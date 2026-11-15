"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";

import SurvivalModuleFAB from "./survival-module/SurvivalModuleFAB";
import MapToolbar from "./map/MapToolbar";
import GeoJSONLayersControl from "./map/GeoJSONLayersControl";
import EnvironmentMapLayersControl from "./map/EnvironmentMapLayersControl";
import RegionalMapLayersControl from "./map/RegionalMapLayersControl";
import JezeroLifeSearchMission from "./map/mission/JezeroLifeSearchMission";
import MissionTimeline from "./map/mission/MissionTimeline";
import MapScaleControl from "./map/MapScaleControl";
import MapZoomControl from "./map/MapZoomControl";
import MapDistanceControl from "./map/MapDistanceControl";
import ResearchPerimeterControl from "./map/ResearchPerimeterControl";
import AddLandmarkControl from "./map/landmarks/AddLandmarkControl";
import { useMarsMap } from "./map/useMarsMap";
import GuideBookFAB from "./guidebook/GuideBookFAB";
import LandmarkPopup from "./map/landmarks/LandmarkPopup";
import LandmarkSidebar from "./map/landmarks/LandmarkSidebar";
import type { MarsLandmark } from "./map/landmarks/landmarkTypes";
import { useLandmarkPopup } from "./map/landmarks/useLandmarkPopup";
import {
  loadCustomLandmarks,
  saveCustomLandmarks,
} from "./map/landmarks/customLandmarkStorage";
import { updateCustomLandmarks } from "./map/landmarks/createLandmarkLayer";

export default function MarsMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);
  const [activeDrawingTool, setActiveDrawingTool] = useState<
    "distance" | "perimeter" | "landmark" | null
  >(null);
  const [missionTimelineVisible, setMissionTimelineVisible] = useState(true);
  const [customLandmarks, setCustomLandmarks] = useState<MarsLandmark[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [sidebarLandmark, setSidebarLandmark] = useState<MarsLandmark | null>(
    null,
  );
  const setDistanceDrawing = useCallback((isDrawing: boolean) => {
    setActiveDrawingTool(isDrawing ? "distance" : null);
  }, []);
  const setPerimeterDrawing = useCallback((isDrawing: boolean) => {
    setActiveDrawingTool(isDrawing ? "perimeter" : null);
  }, []);
  const setLandmarkDrawing = useCallback((isAdding: boolean) => {
    setActiveDrawingTool(isAdding ? "landmark" : null);
  }, []);
  const onCustomLandmarksChange = useCallback((landmarks: MarsLandmark[]) => {
    setCustomLandmarks(landmarks);
    try {
      saveCustomLandmarks(landmarks);
      setStorageError(null);
    } catch (error) {
      console.error("Could not save custom Mars landmarks:", error);
      setStorageError("Could not save points to this browser.");
    }
  }, []);
  const {
    cursorCoordinates,
    environmentMapLayerVisibility,
    landmarkLayer,
    map,
    missionAreaVisible,
    onEnvironmentMapLayerVisibilityChange,
    onLayerChange,
    onMissionAreaVisibilityChange,
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
    customLandmarks,
    activeDrawingTool === "landmark",
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setCustomLandmarks(loadCustomLandmarks());
      } catch (error) {
        console.error("Could not load custom Mars landmarks:", error);
        setStorageError("Could not load saved points from this browser.");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!landmarkLayer) return;
    updateCustomLandmarks(landmarkLayer, customLandmarks);
  }, [customLandmarks, landmarkLayer]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-dvh w-full overflow-hidden bg-white">
        <div ref={mapElement} className="h-full w-full" />
        <MapToolbar
          cursorCoordinates={cursorCoordinates}
          onLayerChange={onLayerChange}
          selectedLayerIndex={selectedLayerIndex}
        />
        <MissionTimeline
          isVisible={missionTimelineVisible}
          onVisibilityChange={setMissionTimelineVisible}
        />
        <div
          className={`fixed left-2 right-2 z-30 flex flex-col gap-2 overflow-y-auto sm:left-auto sm:right-4 sm:top-20 sm:max-h-[calc(100dvh-6rem)] sm:w-64 ${
            missionTimelineVisible
              ? "top-72 max-h-[calc(100dvh-20rem)]"
              : "top-24 max-h-[calc(100dvh-8rem)]"
          }`}
        >
          <GeoJSONLayersControl
            visibility={missionDataLayerVisibility}
            onVisibilityChange={onMissionDataLayerVisibilityChange}
          />
          <RegionalMapLayersControl
            visibility={regionalMapLayerVisibility}
            onVisibilityChange={onRegionalMapLayerVisibilityChange}
          />
          <EnvironmentMapLayersControl
            visibility={environmentMapLayerVisibility}
            onVisibilityChange={onEnvironmentMapLayerVisibilityChange}
          />
        </div>

        <SurvivalModuleFAB
          map={map}
          onLayerChange={onLayerChange}
          onRegionalLayerVisibilityChange={onRegionalMapLayerVisibilityChange}
          onEnvironmentLayerVisibilityChange={
            onEnvironmentMapLayerVisibilityChange
          }
        />
        <JezeroLifeSearchMission
          map={map}
          studyAreaVisible={missionAreaVisible}
          onStudyAreaVisibilityChange={onMissionAreaVisibilityChange}
        />
        <GuideBookFAB />
        <div className="absolute bottom-20 right-12 z-50">
          <MapZoomControl map={map} />
        </div>
        <div className="fixed bottom-50 right-2 z-50 flex flex-col items-end gap-2">
          <div className="flex items-end gap-2">
            <ResearchPerimeterControl
              map={map}
              isDrawing={activeDrawingTool === "perimeter"}
              drawingDisabled={
                activeDrawingTool !== null && activeDrawingTool !== "perimeter"
              }
              onDrawingChange={setPerimeterDrawing}
            />
            <MapDistanceControl
              map={map}
              isDrawing={activeDrawingTool === "distance"}
              drawingDisabled={
                activeDrawingTool !== null && activeDrawingTool !== "distance"
              }
              onDrawingChange={setDistanceDrawing}
            />
            <AddLandmarkControl
              map={map}
              landmarks={customLandmarks}
              isAdding={activeDrawingTool === "landmark"}
              drawingDisabled={
                activeDrawingTool !== null && activeDrawingTool !== "landmark"
              }
              storageError={storageError}
              onLandmarksChange={onCustomLandmarksChange}
              onDrawingChange={setLandmarkDrawing}
            />
          </div>
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
