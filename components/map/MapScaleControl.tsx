"use client";

import { useEffect, useRef } from "react";

import ScaleLine from "ol/control/ScaleLine.js";
import type Map from "ol/Map.js";

type MapScaleControlProps = {
  map: Map | null;
};

export default function MapScaleControl({ map }: MapScaleControlProps) {
  const targetElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetElement.current;
    if (!map || !target) return;

    const control = new ScaleLine({
      target,
      className: "mars-scale-line",
      units: "metric",
      bar: true,
      steps: 4,
      minWidth: 160,
      maxWidth: 220,
    });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return <div ref={targetElement} className="mars-scale-control" />;
}
