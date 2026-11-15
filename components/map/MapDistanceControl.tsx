"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MapPinPen, X } from "lucide-react";

import Draw from "ol/interaction/Draw.js";
import LineString from "ol/geom/LineString.js";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import { unByKey } from "ol/Observable.js";
import type { EventsKey } from "ol/events.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";

import { calculateMarsDistance } from "./marsProjection";

type MapDistanceControlProps = {
  map: Map | null;
};

function formatDistance(distanceMeters: number): string {
  if (distanceMeters >= 1000) {
    return `${(distanceMeters / 1000).toFixed(2)} km`;
  }

  return `${distanceMeters.toFixed(0)} m`;
}

export default function MapDistanceControl({ map }: MapDistanceControlProps) {
  const popupElement = useRef<HTMLDivElement>(null);
  const source = useRef<VectorSource | null>(null);
  const overlay = useRef<Overlay | null>(null);
  const drawInteraction = useRef<Draw | null>(null);
  const drawEndKey = useRef<EventsKey | undefined>(undefined);

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [measurementError, setMeasurementError] = useState<string | null>(null);

  const clearMeasurement = useCallback(() => {
    source.current?.clear();
    overlay.current?.setPosition(undefined);
    setDistanceMeters(null);
    setMeasurementError(null);
  }, []);

  const cancelMeasurement = useCallback(() => {
    setIsMeasuring(false);
    clearMeasurement();
  }, [clearMeasurement]);

  useEffect(() => {
    const popup = popupElement.current;
    if (!map || !popup) return;

    const measurementSource = new VectorSource();
    const measurementLayer = new VectorLayer({
      source: measurementSource,
      style: new Style({
        stroke: new Stroke({
          color: "#fb923c",
          width: 3,
          lineDash: [8, 6],
        }),
        image: new CircleStyle({
          radius: 4,
          fill: new Fill({ color: "#fb923c" }),
          stroke: new Stroke({ color: "#fb923c", width: 1.5 }),
        }),
      }),
      properties: { title: "Mars distance measurement" },
    });
    const measurementOverlay = new Overlay({
      element: popup,
      positioning: "bottom-center",
      offset: [0, -14],
      autoPan: {
        animation: { duration: 200 },
        margin: 24,
      },
    });

    map.addLayer(measurementLayer);
    map.addOverlay(measurementOverlay);
    source.current = measurementSource;
    overlay.current = measurementOverlay;

    return () => {
      if (drawEndKey.current) {
        unByKey(drawEndKey.current);
      }
      if (drawInteraction.current) {
        map.removeInteraction(drawInteraction.current);
      }
      map.removeOverlay(measurementOverlay);
      map.removeLayer(measurementLayer);
      source.current = null;
      overlay.current = null;
      drawInteraction.current = null;
      drawEndKey.current = undefined;
    };
  }, [map]);

  useEffect(() => {
    const measurementSource = source.current;
    if (!map || !isMeasuring || !measurementSource) return;

    const mapTarget = map.getTargetElement();
    if (mapTarget) mapTarget.style.cursor = "crosshair";

    const draw = new Draw({
      source: measurementSource,
      type: "LineString",
      freehand: true,
      style: new Style({
        stroke: new Stroke({
          color: "#fb923c",
          width: 3,
          lineDash: [8, 6],
        }),
        image: new CircleStyle({
          radius: 4,
          fill: new Fill({ color: "#fb923c" }),
          stroke: new Stroke({ color: "#fb923c", width: 1.5 }),
        }),
      }),
    });

    drawEndKey.current = draw.on("drawend", ({ feature }) => {
      const geometry = feature.getGeometry();
      if (!(geometry instanceof LineString)) {
        setMeasurementError("Could not read the drawn measurement.");
        setIsMeasuring(false);
        return;
      }

      const coordinates = geometry.getCoordinates();
      if (coordinates.length < 2) {
        measurementSource.removeFeature(feature);
        setMeasurementError("Draw a longer line to measure its distance.");
        setIsMeasuring(false);
        return;
      }

      try {
        const totalDistance = coordinates
          .slice(1)
          .reduce((total, end, index) => {
            const start = coordinates[index];
            return (
              total +
              calculateMarsDistance([start[0], start[1]], [end[0], end[1]])
            );
          }, 0);

        setDistanceMeters(totalDistance);
        setMeasurementError(null);
        overlay.current?.setPosition(coordinates[coordinates.length - 1]);
      } catch (error) {
        console.error("Mars distance calculation failed:", error);
        measurementSource.removeFeature(feature);
        setMeasurementError(
          error instanceof Error
            ? error.message
            : "Could not calculate the Mars distance.",
        );
        overlay.current?.setPosition(coordinates[coordinates.length - 1]);
      }

      setIsMeasuring(false);
    });

    drawInteraction.current = draw;
    map.addInteraction(draw);

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelMeasurement();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (mapTarget) mapTarget.style.cursor = "";
      if (drawEndKey.current) {
        unByKey(drawEndKey.current);
      }
      map.removeInteraction(draw);
      drawInteraction.current = null;
      drawEndKey.current = undefined;
    };
  }, [cancelMeasurement, isMeasuring, map]);

  function startMeasurement(): void {
    clearMeasurement();
    setIsMeasuring(true);
  }

  return (
    <div className="mars-distance-control">
      <button
        type="button"
        className="mars-distance-button cursor-pointer z-90 flex  items-center gap-1 border border-orange-400/60 bg-black/90 p-[0.3rem] text-sm font-semibold text-orange-400 shadow-lg shadow-black/40 transition hover:bg-orange-950  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        disabled={!map}
        onClick={isMeasuring ? cancelMeasurement : startMeasurement}
        aria-pressed={isMeasuring}
      >
        {isMeasuring ? <X /> : <MapPinPen className="text-orange-400" />}
      </button>
      <div
        ref={popupElement}
        className="mars-distance-popup"
        role="status"
        aria-live="polite"
      >
        {(distanceMeters !== null || measurementError) && (
          <div className="mars-distance-popup-card">
            <button
              type="button"
              className="mars-distance-popup-close"
              onClick={clearMeasurement}
              aria-label="Clear distance measurement"
            >
              ×
            </button>
            <p className="mars-distance-popup-title">Mars route distance</p>
            {measurementError ? (
              <p className="mars-distance-popup-value">{measurementError}</p>
            ) : (
              <p className="mars-distance-popup-value">
                {formatDistance(distanceMeters ?? 0)}
              </p>
            )}
            <p className="mars-distance-popup-help">
              Drag to trace a route. Press Escape to cancel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
