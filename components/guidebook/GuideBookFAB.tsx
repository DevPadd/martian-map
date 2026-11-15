"use client";

import { useEffect, useRef, useState } from "react";
import { Galaxy, Info } from "lucide-react";
import {
  GUIDEBOOK_INTRO,
  GUIDEBOOK_SECTIONS,
  GUIDEBOOK_TITLE,
} from "./GuideBookContent";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export default function GuideBookFAB() {
  const [isOpen, setIsOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  function closeGuide(): void {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGuide();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements =
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fixed cursor-pointer bottom-20 right-2 z-90 flex  items-center gap-1 border border-orange-400/60 bg-black/90 p-[0.3rem] text-sm font-semibold text-orange-500 shadow-lg shadow-black/40 transition hover:bg-orange-950  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        onClick={() => setIsOpen(true)}
        aria-label="Open mission field guide"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Info />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGuide();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guidebook-title"
            aria-describedby="guidebook-intro"
            tabIndex={-1}
            className="relative max-h-[min(88dvh,52rem)] w-full max-w-3xl overflow-y-auto border border-orange-500/50 bg-[#090909] text-orange-100 shadow-2xl shadow-black"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-orange-500/30 bg-[#090909]/95 px-6 py-5 backdrop-blur">
              <div className="flex items-center gap-3 text-orange-500">
                <Galaxy className="h-10 w-10" />
                <h1
                  id="guidebook-title"
                  className="text-2xl font-bold tracking-wide sm:text-3xl"
                >
                  {GUIDEBOOK_TITLE}
                </h1>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeGuide}
                className="shrink-0 border border-orange-500/40 px-3 py-1 text-xl text-orange-300 transition hover:bg-orange-500/15 focus-visible:outline-2 focus-visible:outline-orange-400"
                aria-label="Close mission field guide"
              >
                ×
              </button>
            </div>

            <div className="space-y-7 px-6 py-6 sm:px-8">
              <p
                id="guidebook-intro"
                className="border-l-2 border-orange-500 pl-4 text-base leading-7 text-orange-100/90"
              >
                {GUIDEBOOK_INTRO}
              </p>

              {GUIDEBOOK_SECTIONS.map((section, index) => (
                <section key={section.heading} className="space-y-2">
                  <h2 className="flex items-center gap-3 text-lg font-semibold text-orange-300">
                    <span className="font-mono text-xs text-orange-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h2>
                  <p className="text-sm leading-6 text-orange-100/75">
                    {section.body}
                  </p>
                  {section.steps && (
                    <ul className="list-inside list-disc space-y-1 pl-2 text-sm leading-6 text-orange-100/75 marker:text-orange-500">
                      {section.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <div className="border-t border-orange-500/25 pt-4 text-xs text-orange-300/60">
                M.A.R.S. · Mission Atlas & Reconnaissance System
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
