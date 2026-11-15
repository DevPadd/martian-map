"use client";

import { useEffect, useRef } from "react";

import Zoom from "ol/control/Zoom.js";
import type Map from "ol/Map.js";

type MapZoomControlProps = {
  map: Map | null;
};

export default function MapZoomControl({ map }: MapZoomControlProps) {
  const targetElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetElement.current;
    if (!map || !target) return;

    const control = new Zoom({ target });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return <div ref={targetElement} className="mars-zoom-control" />;
}
