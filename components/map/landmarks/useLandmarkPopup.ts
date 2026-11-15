"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import Map from "ol/Map.js";
import type MapBrowserEvent from "ol/MapBrowserEvent.js";
import Overlay from "ol/Overlay.js";
import Point from "ol/geom/Point.js";
import { unByKey } from "ol/Observable.js";
import type { EventsKey } from "ol/events.js";
import type VectorLayer from "ol/layer/Vector.js";
import type VectorSource from "ol/source/Vector.js";

import { LANDMARK_CATALOG } from "./landmarkCatalog";
import type { MarsLandmark } from "./landmarkTypes";

export function useLandmarkPopup(
  map: Map | null,
  landmarkLayer: VectorLayer<VectorSource> | null,
  popupElement: RefObject<HTMLDivElement | null>,
) {
  const overlay = useRef<Overlay | null>(null);
  const hoverKey = useRef<EventsKey | undefined>(undefined);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hidePositionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedLandmark, setSelectedLandmark] =
    useState<MarsLandmark | null>(null);
  const selectedLandmarkRef = useRef<MarsLandmark | null>(null);

  const closePopup = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    if (hidePositionTimeout.current) {
      clearTimeout(hidePositionTimeout.current);
    }
    selectedLandmarkRef.current = null;
    setSelectedLandmark(null);
    hidePositionTimeout.current = setTimeout(() => {
      overlay.current?.setPosition(undefined);
      hidePositionTimeout.current = null;
    }, 180);
  }, []);

  useEffect(() => {
    const element = popupElement.current;
    if (!map || !landmarkLayer || !element) return;
    const activeMap = map;
    const activeLayer = landmarkLayer;
    const popup = element;
    const mapTarget = activeMap.getTargetElement();
    if (!mapTarget) return;

    const landmarkOverlay = new Overlay({
      element: popup,
      positioning: "bottom-center",
      offset: [0, -12],
      autoPan: {
        animation: { duration: 200 },
        margin: 24,
      },
    });
    function cancelHide(): void {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
      if (hidePositionTimeout.current) {
        clearTimeout(hidePositionTimeout.current);
        hidePositionTimeout.current = null;
      }
    }

    function scheduleHide(): void {
      if (hideTimeout.current || hidePositionTimeout.current) return;

      hideTimeout.current = setTimeout(() => {
        hideTimeout.current = null;
        selectedLandmarkRef.current = null;
        setSelectedLandmark(null);
        hidePositionTimeout.current = setTimeout(() => {
          landmarkOverlay.setPosition(undefined);
          hidePositionTimeout.current = null;
        }, 180);
      }, 120);
    }

    function onPointerMove(event: MapBrowserEvent): void {
      const feature = activeMap.forEachFeatureAtPixel(
        event.pixel,
        (candidate) => candidate,
        {
          hitTolerance: 8,
          layerFilter: (layer) => layer === activeLayer,
        },
      );
      const featureId = feature?.getId();
      const landmark =
        featureId === undefined
          ? undefined
          : LANDMARK_CATALOG.find(({ id }) => id === String(featureId));
      const geometry = feature?.getGeometry();
      const coordinate =
        geometry instanceof Point ? geometry.getCoordinates() : undefined;

      if (landmark && coordinate) {
        cancelHide();
        landmarkOverlay.setPosition(coordinate);
        if (selectedLandmarkRef.current?.id !== landmark.id) {
          selectedLandmarkRef.current = landmark;
          setSelectedLandmark(landmark);
        }
        if (mapTarget) mapTarget.style.cursor = "pointer";
        return;
      }

      const eventTarget = event.originalEvent.target;
      if (eventTarget instanceof Node && popup.contains(eventTarget)) {
        cancelHide();
        return;
      }

      if (mapTarget) mapTarget.style.cursor = "";
      scheduleHide();
    }

    function onPopupPointerEnter(): void {
      cancelHide();
    }

    function onPopupPointerLeave(): void {
      scheduleHide();
    }

    overlay.current = landmarkOverlay;
    hoverKey.current = activeMap.on("pointermove", (event) =>
      onPointerMove(event),
    );
    popup.addEventListener("pointerenter", onPopupPointerEnter);
    popup.addEventListener("pointerleave", onPopupPointerLeave);
    activeMap.addOverlay(landmarkOverlay);

    return () => {
      cancelHide();
      if (hoverKey.current) {
        unByKey(hoverKey.current);
      }
      popup.removeEventListener("pointerenter", onPopupPointerEnter);
      popup.removeEventListener("pointerleave", onPopupPointerLeave);
      if (mapTarget) mapTarget.style.cursor = "";
      activeMap.removeOverlay(landmarkOverlay);
      overlay.current = null;
      hoverKey.current = undefined;
    };
  }, [landmarkLayer, map, popupElement]);

  return { closePopup, selectedLandmark };
}
