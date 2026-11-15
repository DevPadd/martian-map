"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LocateFixed, MapPinned, ShieldAlert } from "lucide-react";
import type OLMap from "ol/Map.js";

import { JEZERO_STUDY_AREA_CENTER } from "./jezeroStudyArea";

type JezeroLifeSearchMissionProps = {
  map: OLMap | null;
  studyAreaVisible: boolean;
  onStudyAreaVisibilityChange: (visible: boolean) => void;
};

const BRIEFING_SECTIONS = [
  {
    title: "Mission objective",
    icon: MapPinned,
    items: [
      "Survey selected Jezero delta-margin and crater-floor exposures for geological evidence that can help assess past habitability and preserve possible biosignatures.",
      "Document rock context and surface relationships; any life-related interpretation requires independent evidence and laboratory-quality analysis.",
    ],
  },
  {
    title: "Safety procedure (conceptual)",
    icon: ShieldAlert,
    items: [
      "Treat the perimeter and map layers as an educational visualization, not a certified route, landing boundary, or real-time hazard product.",
      "A real mission would use approved procedures, crew/system health monitoring, communications plans, and mission-control review before changing activities.",
      "Preserve sample context and prevent cross-contamination under mission-approved planetary-protection protocols.",
    ],
  },
  {
    title: "Potential obstructions and hazards",
    icon: LocateFixed,
    items: [
      "Rough or loose terrain, rocks, small craters, steep or undercut delta scarps, and limited line of sight may obstruct movement or observations.",
      "Dust, changing illumination, and image resolution can obscure features; orbital imagery may be incomplete or out of date.",
      "Communication delay and equipment limitations can constrain coordination. This prototype does not assess route safety or current conditions.",
    ],
  },
] as const;

export default function JezeroLifeSearchMission({
  map,
  studyAreaVisible,
  onStudyAreaVisibilityChange,
}: JezeroLifeSearchMissionProps) {
  const [isOpen, setIsOpen] = useState(false);

  function focusStudyArea(): void {
    if (!map) return;
    const view = map.getView();
    const maxZoom = view.getMaxZoom();
    view.animate({
      center: JEZERO_STUDY_AREA_CENTER,
      zoom: Math.min(9, maxZoom ?? 9),
      duration: 650,
    });
  }

  function toggleStudyArea(): void {
    const nextVisible = !studyAreaVisible;
    onStudyAreaVisibilityChange(nextVisible);
    if (nextVisible) focusStudyArea();
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close mission briefing"
            className="fixed inset-0 z-[35] bg-black/65 backdrop-blur-[1px] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <aside className="fixed bottom-20 left-2 z-40 w-[min(22rem,calc(100vw-1rem))] text-xs text-orange-100 sm:bottom-4 sm:left-4">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="mission-briefing"
              className="max-h-[55dvh] overflow-y-auto border border-orange-500/70 bg-black/95 p-3 shadow-xl shadow-black/60 sm:max-h-[65dvh] sm:p-4"
              role="dialog"
              aria-labelledby="jezero-mission-briefing-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <header className="flex items-start justify-between gap-3 border-b border-orange-500/30 pb-3">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-orange-500">
                    B.C.I. · Concept mission
                  </p>
                  <h2
                    id="jezero-mission-briefing-title"
                    className="mt-1 text-sm font-bold text-orange-200 sm:text-base"
                  >
                    Jezero Life-Search Expedition
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close mission briefing"
                  className="px-2 text-xl leading-5 text-orange-300 hover:bg-orange-500/15 focus-visible:outline-2 focus-visible:outline-orange-400"
                >
                  ×
                </button>
              </header>

              <p className="mt-3 leading-relaxed text-orange-100/75">
                A fictional planning concept inspired by Perseverance&apos;s
                exploration of Jezero. The study boundary is approximate and is
                not an operational mission plan.
              </p>

              <label className="mt-3 flex cursor-pointer items-start gap-2 border border-emerald-400/40 bg-emerald-950/20 p-2 text-emerald-100">
                <input
                  type="checkbox"
                  checked={studyAreaVisible}
                  onChange={toggleStudyArea}
                />
                <span>Show Jezero study-area perimeter</span>
              </label>

              {studyAreaVisible && (
                <button
                  type="button"
                  onClick={focusStudyArea}
                  className="mt-2 text-[0.65rem] text-emerald-300 underline underline-offset-2 hover:text-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  Focus map on study area
                </button>
              )}

              <div className="mt-3 space-y-4">
                {BRIEFING_SECTIONS.map(({ title, icon: Icon, items }) => (
                  <section key={title}>
                    <h3 className="flex items-center gap-2 font-semibold text-orange-300">
                      <Icon
                        className="h-3.5 w-3.5 text-orange-400"
                        aria-hidden
                      />
                      {title}
                    </h3>
                    <ul className="mt-1.5 list-disc space-y-1.5 pl-5 leading-relaxed text-orange-100/70 marker:text-orange-500">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="mission-briefing-trigger"
              type="button"
              onClick={() => setIsOpen(true)}
              aria-expanded={false}
              className="border border-orange-500/70 bg-black/95 px-3 py-2 font-semibold text-orange-300 shadow-lg shadow-black/50 hover:bg-orange-950/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.16 }}
            >
              Mission briefing
            </motion.button>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
}
