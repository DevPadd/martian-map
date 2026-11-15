"use client";

import { useEffect, useRef, useState } from "react";

import { Pentagon, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import Draw from "ol/interaction/Draw.js";
import Polygon from "ol/geom/Polygon.js";
import Map from "ol/Map.js";
import { unByKey } from "ol/Observable.js";
import type { EventsKey } from "ol/events.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import Text from "ol/style/Text.js";
import { calculateMarsPolygonArea } from "./marsProjection";

type ResearchPerimeterControlProps = {
  map: Map | null;
  isDrawing: boolean;
  drawingDisabled: boolean;
  onDrawingChange: (isDrawing: boolean) => void;
};

export default function ResearchPerimeterControl({
  map,
  isDrawing,
  drawingDisabled,
  onDrawingChange,
}: ResearchPerimeterControlProps) {
  const source = useRef<VectorSource | null>(null);
  const drawInteraction = useRef<Draw | null>(null);
  const drawEndKey = useRef<EventsKey | undefined>(undefined);

  const [hasPerimeter, setHasPerimeter] = useState(false);
  const [drawingError, setDrawingError] = useState<string | null>(null);
  const [areaSquareMeters, setAreaSquareMeters] = useState<number | null>(null);

  useEffect(() => {
    if (!map) return;

    const perimeterSource = new VectorSource();
    const perimeterLayer = new VectorLayer({
      source: perimeterSource,
      style: (feature) =>
        new Style({
          fill: new Fill({ color: "rgba(16, 185, 129, 0.12)" }),
          stroke: new Stroke({
            color: "#34d399",
            width: 3,
            lineDash: [10, 7],
          }),
          text: new Text({
            text: String(feature.get("label") ?? "Research perimeter"),
            font: "bold 13px jetbrains-mono, monospace",
            fill: new Fill({ color: "#a7f3d0" }),
            stroke: new Stroke({ color: "#052e2b", width: 4 }),
          }),
        }),
      properties: { title: "Research perimeter annotation" },
    });

    map.addLayer(perimeterLayer);
    source.current = perimeterSource;

    return () => {
      if (drawEndKey.current) {
        unByKey(drawEndKey.current);
        drawEndKey.current = undefined;
      }
      if (drawInteraction.current) {
        map.removeInteraction(drawInteraction.current);
        drawInteraction.current = null;
      }
      map.removeLayer(perimeterLayer);
      source.current = null;
    };
  }, [map]);

  useEffect(() => {
    const perimeterSource = source.current;
    if (!map || !isDrawing || !perimeterSource) return;

    const mapTarget = map.getTargetElement();
    if (mapTarget) mapTarget.style.cursor = "crosshair";

    const draw = new Draw({
      source: perimeterSource,
      type: "Polygon",
      freehand: true,
      style: new Style({
        fill: new Fill({ color: "rgba(16, 185, 129, 0.12)" }),
        stroke: new Stroke({
          color: "#34d399",
          width: 3,
          lineDash: [10, 7],
        }),
      }),
    });

    drawEndKey.current = draw.on("drawend", ({ feature }) => {
      const geometry = feature.getGeometry();
      if (!(geometry instanceof Polygon)) {
        perimeterSource.removeFeature(feature);
        setDrawingError("Draw a larger closed outline to save the perimeter.");
        onDrawingChange(false);
        return;
      }

      const coordinates = geometry.getCoordinates()[0];
      if (!coordinates || coordinates.length < 4) {
        perimeterSource.removeFeature(feature);
        setDrawingError("Draw a larger closed outline to save the perimeter.");
        onDrawingChange(false);
        return;
      }

      let calculatedArea: number;
      try {
        calculatedArea = calculateMarsPolygonArea(coordinates);
      } catch (error) {
        console.error("Mars research perimeter area calculation failed:", error);
        perimeterSource.removeFeature(feature);
        setDrawingError(
          error instanceof Error
            ? error.message
            : "Could not calculate the perimeter area.",
        );
        onDrawingChange(false);
        return;
      }
      if (!Number.isFinite(calculatedArea) || calculatedArea <= 0) {
        perimeterSource.removeFeature(feature);
        setDrawingError("Draw a larger closed outline to save the perimeter.");
        onDrawingChange(false);
        return;
      }

      feature.set("label", "Research perimeter");
      setHasPerimeter(true);
      setAreaSquareMeters(calculatedArea);
      setDrawingError(null);
      onDrawingChange(false);
    });

    drawInteraction.current = draw;
    map.addInteraction(draw);

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        onDrawingChange(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (mapTarget) mapTarget.style.cursor = "";
      if (drawEndKey.current) {
        unByKey(drawEndKey.current);
        drawEndKey.current = undefined;
      }
      map.removeInteraction(draw);
      drawInteraction.current = null;
    };
  }, [isDrawing, map, onDrawingChange]);

  function toggleDrawing(): void {
    if (isDrawing) {
      onDrawingChange(false);
      return;
    }

    source.current?.clear();
    setHasPerimeter(false);
    setAreaSquareMeters(null);
    setDrawingError(null);
    onDrawingChange(true);
  }

  function clearPerimeter(): void {
    source.current?.clear();
    setHasPerimeter(false);
    setAreaSquareMeters(null);
    setDrawingError(null);
  }

  function formatArea(area: number): string {
    const squareKilometers = area / 1_000_000;
    if (squareKilometers >= 1) {
      return `${squareKilometers.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} km²`;
    }

    return `${area.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })} m²`;
  }

  const showPanel = isDrawing || hasPerimeter || drawingError !== null;

  return (
    <div className="relative z-50 flex justify-end">
      <button
        type="button"
        className="flex min-h-10 cursor-pointer items-center gap-1 border border-emerald-400/60 bg-black/90 p-2 text-sm font-semibold text-emerald-300 shadow-lg shadow-black/40 transition hover:bg-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!map || (drawingDisabled && !isDrawing)}
        onClick={toggleDrawing}
        aria-label={
          isDrawing ? "Cancel perimeter drawing" : "Draw research perimeter"
        }
        aria-pressed={isDrawing}
        title={
          drawingDisabled
            ? "Finish or cancel the other map drawing first"
            : "Draw a freehand research perimeter"
        }
      >
        {isDrawing ? <X aria-hidden /> : <Pentagon aria-hidden />}
        <span className="sr-only">
          {isDrawing ? "Cancel perimeter drawing" : "Draw perimeter"}
        </span>
      </button>
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 w-[min(18rem,calc(100vw-1rem))] border border-emerald-400/60 bg-black/95 p-3 text-xs text-emerald-100 shadow-xl shadow-black/50"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <p className="font-semibold text-emerald-300">
              {isDrawing
                ? "Drawing research perimeter"
                : drawingError
                  ? "Perimeter not saved"
                  : "Research perimeter saved"}
            </p>
            <p className="mt-1 leading-relaxed text-emerald-100/75">
              {isDrawing
                ? "Click and drag on the map to sketch the boundary. Release to finish; press Esc to cancel."
                : (drawingError ?? "The dashed outline is visible on the map.")}
            </p>
            {hasPerimeter && areaSquareMeters !== null && (
              <p className="mt-2 border-t border-emerald-400/25 pt-2 font-mono text-sm font-semibold text-emerald-200">
                Approx. area: {formatArea(areaSquareMeters)}
                <span className="mt-1 block font-sans text-[0.65rem] font-normal text-emerald-100/60">
                  Estimated using Mars&apos;s ellipsoid model.
                </span>
              </p>
            )}
            {hasPerimeter && !isDrawing && (
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 text-emerald-300 underline underline-offset-2 hover:text-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
                onClick={clearPerimeter}
              >
                <Trash2 className="h-3 w-3" aria-hidden />
                Clear perimeter
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
