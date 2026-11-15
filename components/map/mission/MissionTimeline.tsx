"use client";

import { CalendarDays, ChevronRight, X } from "lucide-react";

const MISSION_PHASES = [
  { name: "Mission briefing", sols: "Sol 0" },
  { name: "Launch from Starship", sols: "Sol 1–2" },
  { name: "Orbital refueling", sols: "Sol 3–5" },
  { name: "Mars transfer", sols: "Sol 6–215" },
  { name: "Mars orbital arrival", sols: "Sol 216" },
  { name: "Entry and landing", sols: "Sol 217" },
  { name: "Base camp setup", sols: "Sol 218–222" },
  { name: "Survey & sample science", sols: "Sol 223–242" },
] as const;

type MissionTimelineProps = {
  isVisible: boolean;
  onVisibilityChange: (isVisible: boolean) => void;
};

export default function MissionTimeline({
  isVisible,
  onVisibilityChange,
}: MissionTimelineProps) {
  if (!isVisible) {
    return (
      <button
        type="button"
        aria-controls="jezero-mission-timeline"
        aria-expanded={false}
        className="fixed left-2 top-24 z-20 flex items-center gap-2 border border-orange-500/60 bg-black/90 px-3 py-2 text-xs text-orange-300 shadow-lg shadow-black/40 hover:bg-orange-950/80 focus-visible:outline-2 focus-visible:outline-orange-400 sm:top-20"
        onClick={() => onVisibilityChange(true)}
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Show mission timeline
      </button>
    );
  }

  return (
    <section
      id="jezero-mission-timeline"
      aria-labelledby="jezero-mission-timeline-title"
      className="fixed left-2 right-2 top-24 z-20 border border-orange-500/80 bg-black/95 px-3 py-2 text-orange-300 shadow-lg shadow-black/50 sm:right-72 sm:top-20 sm:px-4"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2
          id="jezero-mission-timeline-title"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-orange-400 sm:text-xs"
        >
          Jezero life-search mission timeline
        </h2>
        <span className="shrink-0 text-[0.6rem] text-orange-200/60 sm:text-[0.65rem]">
          Estimated mission sols
        </span>
        <button
          type="button"
          aria-controls="jezero-mission-timeline"
          aria-expanded={true}
          aria-label="Hide mission timeline"
          title="Hide mission timeline"
          className="shrink-0 rounded p-1 text-orange-300 hover:bg-orange-500/15 focus-visible:outline-2 focus-visible:outline-orange-400"
          onClick={() => onVisibilityChange(false)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ol
        aria-label="Estimated mission phases in Mars-sol equivalents"
        className="flex snap-x snap-mandatory items-start overflow-x-auto pb-1"
      >
        {MISSION_PHASES.map((phase, index) => (
          <li
            key={phase.name}
            className="relative flex min-w-24 flex-1 snap-start flex-col pr-2 last:min-w-28 last:flex-none last:pr-0 sm:pr-3"
          >
            <div className="flex h-3 items-center">
              <span
                className={`z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 ${
                  index === 0
                    ? "border-orange-300 bg-orange-400"
                    : "border-orange-500 bg-black"
                }`}
              />
              {index < MISSION_PHASES.length - 1 && (
                <span className="h-px flex-1 bg-orange-500/80" />
              )}
              {index === MISSION_PHASES.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-orange-500" />
              )}
            </div>
            <span className="mt-1 text-[0.6rem] font-semibold leading-tight text-orange-100 sm:text-xs">
              {phase.name}
            </span>
            <span className="mt-1 text-[0.6rem] text-orange-400 sm:text-[0.65rem]">
              {phase.sols}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-1 text-[0.55rem] leading-relaxed text-orange-100/45 sm:text-[0.6rem]">
        Concept schedule only; transit is shown in Mars-sol equivalents. Actual
        timing depends on trajectory, launch window, systems, and surface
        conditions. 1 Sol ≈ 24h 39m.
      </p>
    </section>
  );
}
