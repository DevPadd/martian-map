"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookText,
  ExternalLink,
  Layers,
  MapPin,
  Search,
  ShieldAlert,
} from "lucide-react";
import type OLMap from "ol/Map.js";

import { LANDMARK_CATALOG } from "../map/landmarks/landmarkCatalog";
import type { MarsLandmark } from "../map/landmarks/landmarkTypes";
import { MAP_LAYERS } from "../map/mapLayers";
import {
  GUIDE_ARTICLES,
  GUIDE_CATEGORIES,
  HAZARD_CARDS,
  MARS_MISSIONS,
  SURVIVAL_MODULE_INTRO,
  SURVIVAL_MODULE_TITLE,
} from "./SurvivalModuleContent";
import type { GuideArticle } from "./SurvivalModuleContent";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])';

type ModuleView = "browse" | "hazards" | "article";

type SurvivalModuleFABProps = {
  map?: OLMap | null;
  onLayerChange?: (index: number) => void;
};

function BulletSection({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
        {heading}
      </h3>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-orange-100/80 marker:text-orange-500">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function getArticleSearchText(article: GuideArticle): string {
  const category = GUIDE_CATEGORIES.find(
    ({ id }) => id === article.categoryId,
  )?.title;

  return [
    article.title,
    category,
    article.introduction,
    article.overview,
    article.whyItMatters,
    ...article.keywords,
    ...article.keyInformation,
    ...(article.potentialRisks ?? []),
    ...(article.whatToMonitor ?? []),
    ...(article.safetyConsiderations ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

export default function SurvivalModuleFAB({
  map = null,
  onLayerChange,
}: SurvivalModuleFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModuleView>("browse");
  const [returnView, setReturnView] =
    useState<Exclude<ModuleView, "article">>("browse");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLElement>(null);

  const selectedArticle = GUIDE_ARTICLES.find(
    ({ id }) => id === selectedArticleId,
  );
  const selectedCategory = GUIDE_CATEGORIES.find(
    ({ id }) => id === selectedArticle?.categoryId,
  );
  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return GUIDE_ARTICLES.filter((article) => {
      const matchesCategory =
        categoryFilter === "all" || article.categoryId === categoryFilter;
      return (
        matchesCategory &&
        (!query || getArticleSearchText(article).includes(query))
      );
    });
  }, [categoryFilter, searchQuery]);

  const closeModule = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openArticle = useCallback(
    (articleId: string, from: Exclude<ModuleView, "article">) => {
      setSelectedArticleId(articleId);
      setReturnView(from);
      setView("article");
    },
    [],
  );

  const navigateToLandmark = useCallback(
    (landmark: MarsLandmark) => {
      if (!map) return;
      const mapView = map.getView();
      const maxZoom = mapView.getMaxZoom();
      const zoom = Math.min(
        Math.max(mapView.getZoom() ?? 5, 6),
        Number.isFinite(maxZoom) ? maxZoom : 8,
      );

      mapView.animate({
        center: landmark.coordinates,
        zoom,
        duration: 650,
      });
    },
    [map],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModule();
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
  }, [closeModule, isOpen]);

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0 });
  }, [selectedArticleId, view]);

  const handleLayerClick = useCallback(
    (layerId: string) => {
      const index = MAP_LAYERS.findIndex(({ id }) => id === layerId);
      if (index >= 0) onLayerChange?.(index);
    },
    [onLayerChange],
  );

  const articleLandmarks = selectedArticle?.relatedLandmarks
    ?.map((id) => LANDMARK_CATALOG.find((landmark) => landmark.id === id))
    .filter((landmark): landmark is MarsLandmark => landmark !== undefined);
  const articleImages = [
    ...new Map(
      (articleLandmarks ?? [])
        .flatMap(({ images }) => images)
        .map((image) => [image.src, image] as const),
    ).values(),
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="fixed bottom-30 right-2 z-90 flex cursor-pointer items-center gap-1 border border-orange-400/60 bg-black/90 p-[0.3rem] text-sm font-semibold text-orange-500 shadow-lg shadow-black/40 transition hover:bg-orange-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        onClick={() => setIsOpen(true)}
        aria-label="Open survival module"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <BookText aria-hidden="true" />
        <span className="sr-only">Survival module</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-2 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModule();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="survival-module-title"
            aria-describedby="survival-module-intro"
            tabIndex={-1}
            className="relative flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden border border-orange-500/50 bg-[#090909] text-orange-100 shadow-2xl shadow-black sm:max-h-[92dvh]"
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-orange-500/30 bg-[#090909] px-4 py-4 sm:px-6">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-orange-500">
                  M.A.R.S. · Mission Atlas & Reconnaissance System
                </p>
                <h1
                  id="survival-module-title"
                  className="mt-1 flex items-center gap-2 text-xl font-bold tracking-wide text-orange-200 sm:text-2xl"
                >
                  <BookText
                    className="h-6 w-6 text-orange-500"
                    aria-hidden="true"
                  />
                  {SURVIVAL_MODULE_TITLE}
                </h1>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeModule}
                className="shrink-0 border border-orange-500/40 px-3 py-1 text-2xl leading-7 text-orange-300 transition hover:bg-orange-500/15 focus-visible:outline-2 focus-visible:outline-orange-400"
                aria-label="Close survival module"
              >
                ×
              </button>
            </header>

            {view !== "article" && (
              <nav
                className="flex shrink-0 gap-2 overflow-x-auto border-b border-orange-500/20 px-4 py-3 sm:px-6"
                aria-label="Survival module sections"
              >
                {(
                  [
                    ["browse", "Field guide"],
                    ["hazards", "Hazard cards"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-current={view === id ? "page" : undefined}
                    className={`shrink-0 border px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-orange-400 ${
                      view === id
                        ? "border-orange-400 bg-orange-950/60 text-orange-100"
                        : "border-orange-500/20 text-orange-300/70 hover:border-orange-400/50 hover:text-orange-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            )}

            <main
              ref={contentScrollRef}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              {view === "browse" && (
                <div className="space-y-5 p-4 sm:p-6">
                  <div className="max-w-3xl space-y-2">
                    <h2 className="text-lg font-semibold text-orange-200">
                      Mission field guide
                    </h2>
                    <p className="text-sm leading-6 text-orange-100/70">
                      Browse nine learning areas, or search for a topic, hazard,
                      landmark, or mission.
                    </p>
                  </div>

                  <label className="flex max-w-2xl items-center gap-3 border border-orange-500/30 bg-black/50 px-3 py-2 focus-within:border-orange-400">
                    <Search
                      className="h-4 w-4 shrink-0 text-orange-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search title, topic, or category"
                      className="min-w-0 flex-1 bg-transparent text-sm text-orange-100 outline-none placeholder:text-orange-100/40"
                      aria-label="Search survival guide articles"
                    />
                  </label>

                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setCategoryFilter("all")}
                      aria-pressed={categoryFilter === "all"}
                      className={`shrink-0 border px-3 py-1.5 text-xs ${
                        categoryFilter === "all"
                          ? "border-orange-400 text-orange-100"
                          : "border-orange-500/20 text-orange-200/60"
                      }`}
                    >
                      All topics
                    </button>
                    {GUIDE_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setCategoryFilter(category.id)}
                        aria-pressed={categoryFilter === category.id}
                        className={`shrink-0 border px-3 py-1.5 text-xs ${
                          categoryFilter === category.id
                            ? "border-orange-400 text-orange-100"
                            : "border-orange-500/20 text-orange-200/60"
                        }`}
                      >
                        {category.shortTitle}
                      </button>
                    ))}
                  </div>

                  {filteredArticles.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {filteredArticles.map((article) => {
                        const category = GUIDE_CATEGORIES.find(
                          ({ id }) => id === article.categoryId,
                        );
                        return (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => openArticle(article.id, "browse")}
                            className="group flex h-full flex-col items-start border border-orange-500/25 bg-black/35 p-4 text-left transition hover:border-orange-400/70 hover:bg-orange-950/20 focus-visible:outline-2 focus-visible:outline-orange-400"
                          >
                            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-orange-500">
                              {category?.title}
                            </span>
                            <span className="mt-2 text-base font-semibold text-orange-200 group-hover:text-white">
                              {article.title}
                            </span>
                            <span className="mt-2 text-sm leading-6 text-orange-100/65">
                              {article.introduction}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="border border-orange-500/20 p-5 text-sm text-orange-100/60">
                      No articles match that search. Try another term or choose
                      a different category.
                    </p>
                  )}
                </div>
              )}

              {view === "hazards" && (
                <div className="space-y-5 p-4 sm:p-6">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-200">
                      <ShieldAlert
                        className="h-5 w-5 text-orange-400"
                        aria-hidden="true"
                      />
                      Hazard cards
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-orange-100/70">
                      Educational summaries only. No numerical danger ratings
                      are assigned because this prototype has no validated
                      hazard-scoring method or real-time measurements.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {HAZARD_CARDS.map((hazard) => (
                      <article
                        key={hazard.name}
                        className="flex flex-col border border-orange-500/25 bg-black/35 p-4"
                      >
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-orange-500">
                          {hazard.category}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-orange-200">
                          {hazard.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-orange-100/75">
                          {hazard.explanation}
                        </p>
                        <p className="mt-3 border-l border-orange-500/50 pl-3 text-xs leading-5 text-orange-100/60">
                          {hazard.whyItMatters}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            openArticle(hazard.articleId, "hazards")
                          }
                          className="mt-4 self-start text-xs font-semibold text-orange-300 underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400"
                        >
                          Read related article
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {view === "article" && selectedArticle && (
                <article className="space-y-7 p-4 sm:p-6 lg:p-8">
                  <button
                    type="button"
                    onClick={() => setView(returnView)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-white focus-visible:outline-2 focus-visible:outline-orange-400"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to{" "}
                    {returnView === "hazards" ? "hazard cards" : "field guide"}
                  </button>

                  <header className="max-w-4xl border-b border-orange-500/25 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                      {selectedCategory?.title}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-orange-100 sm:text-3xl">
                      {selectedArticle.title}
                    </h2>
                    <p className="mt-3 text-base leading-7 text-orange-100/75">
                      {selectedArticle.introduction}
                    </p>
                  </header>

                  <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem]">
                    <div className="space-y-7">
                      <section className="space-y-2">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
                          Overview
                        </h3>
                        <p className="text-sm leading-6 text-orange-100/80">
                          {selectedArticle.overview}
                        </p>
                      </section>
                      <section className="space-y-2 border-l-2 border-orange-500/70 pl-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
                          Why it matters
                        </h3>
                        <p className="text-sm leading-6 text-orange-100/80">
                          {selectedArticle.whyItMatters}
                        </p>
                      </section>
                      <BulletSection
                        heading="Key information"
                        items={selectedArticle.keyInformation}
                      />
                      {selectedArticle.potentialRisks && (
                        <BulletSection
                          heading="Potential risks"
                          items={selectedArticle.potentialRisks}
                        />
                      )}
                      {selectedArticle.whatToMonitor && (
                        <BulletSection
                          heading="What to monitor"
                          items={selectedArticle.whatToMonitor}
                        />
                      )}
                      {selectedArticle.safetyConsiderations && (
                        <BulletSection
                          heading="Safety considerations"
                          items={selectedArticle.safetyConsiderations}
                        />
                      )}

                      {selectedArticle.id === "past-missions" && (
                        <section className="space-y-3">
                          <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
                              Mission records
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-orange-100/55">
                              Observed mission results are distinguished from
                              possible future applications in each record.
                            </p>
                          </div>
                          <div className="space-y-3">
                            {MARS_MISSIONS.map((mission) => (
                              <details
                                key={mission.name}
                                className="group border border-orange-500/25 bg-black/30"
                              >
                                <summary className="cursor-pointer list-none p-4 focus-visible:outline-2 focus-visible:outline-orange-400 [&::-webkit-details-marker]:hidden">
                                  <span className="block text-xs uppercase tracking-wider text-orange-500">
                                    {mission.missionType}
                                  </span>
                                  <span className="mt-1 block font-semibold text-orange-200">
                                    {mission.name}
                                  </span>
                                  <span className="mt-1 block text-xs text-orange-100/55">
                                    {mission.dates}
                                  </span>
                                </summary>
                                <div className="space-y-3 border-t border-orange-500/15 p-4 text-sm leading-6 text-orange-100/75">
                                  <p>
                                    <strong className="text-orange-200">
                                      Objectives:
                                    </strong>{" "}
                                    {mission.objectives}
                                  </p>
                                  <p>
                                    <strong className="text-orange-200">
                                      Achievements:
                                    </strong>{" "}
                                    {mission.achievements}
                                  </p>
                                  <p>
                                    <strong className="text-orange-200">
                                      Technology:
                                    </strong>{" "}
                                    {mission.technology}
                                  </p>
                                  <p>
                                    <strong className="text-orange-200">
                                      Limitations:
                                    </strong>{" "}
                                    {mission.limitations}
                                  </p>
                                  <p>
                                    <strong className="text-orange-200">
                                      Exploration lesson:
                                    </strong>{" "}
                                    {mission.explorationLesson}
                                  </p>
                                </div>
                              </details>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    <aside className="space-y-6">
                      {selectedArticle.relatedLayers &&
                        selectedArticle.relatedLayers.length > 0 && (
                          <section className="space-y-3 border border-orange-500/20 bg-black/30 p-4">
                            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-300">
                              <Layers className="h-4 w-4" aria-hidden="true" />
                              Related ARES map layers
                            </h3>
                            <ul className="space-y-3">
                              {selectedArticle.relatedLayers.map((layer) => {
                                const layerId = layer.mapLayerId;
                                const isAvailable =
                                  layer.availability === "available" &&
                                  layerId !== undefined;
                                return (
                                  <li key={layer.label}>
                                    {isAvailable ? (
                                      <button
                                        type="button"
                                        disabled={!map || !onLayerChange}
                                        onClick={() =>
                                          layerId && handleLayerClick(layerId)
                                        }
                                        className="text-left text-sm text-orange-200 underline decoration-orange-500/50 underline-offset-4 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {layer.label}
                                      </button>
                                    ) : (
                                      <p className="text-sm text-orange-100/45">
                                        {layer.label}{" "}
                                        <span className="text-[0.65rem] uppercase tracking-wider">
                                          not available in this map
                                        </span>
                                      </p>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </section>
                        )}

                      {articleLandmarks && articleLandmarks.length > 0 && (
                        <section className="space-y-3 border border-orange-500/20 bg-black/30 p-4">
                          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-300">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            Related landmarks
                          </h3>
                          <ul className="space-y-2">
                            {articleLandmarks.map((landmark) => (
                              <li key={landmark.id}>
                                <button
                                  type="button"
                                  disabled={!map}
                                  onClick={() => navigateToLandmark(landmark)}
                                  className="w-full text-left text-sm text-orange-200 underline decoration-orange-500/50 underline-offset-4 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {landmark.name}
                                  <span className="mt-1 block font-mono text-[0.65rem] text-orange-100/45">
                                    {landmark.coordinates[1].toFixed(2)}° lat,{" "}
                                    {landmark.coordinates[0].toFixed(2)}° lon
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </aside>
                  </div>

                  {articleImages.length > 0 && (
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
                        Related images
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {articleImages.map((image) => (
                          <figure
                            key={image.src}
                            className="overflow-hidden border border-orange-500/25 bg-black/40"
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              width={image.width}
                              height={image.height}
                              className="h-auto max-h-64 w-full object-contain"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                            <figcaption className="space-y-1 p-3 text-xs leading-5 text-orange-100/65">
                              <p>{image.caption}</p>
                              <p>Image: {image.attribution}</p>
                              <a
                                href={image.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-orange-300 underline underline-offset-2 hover:text-white"
                              >
                                View image source
                                <ExternalLink
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                              </a>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="space-y-3 border-t border-orange-500/20 pt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-300">
                      References and further reading
                    </h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {selectedArticle.references.map((reference) => (
                        <li key={reference.url}>
                          <a
                            href={reference.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-start gap-2 border border-orange-500/15 p-3 text-sm text-orange-200 hover:border-orange-400/50 hover:text-white"
                          >
                            <ExternalLink
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400"
                              aria-hidden="true"
                            />
                            <span>
                              {reference.title}
                              <span className="mt-1 block text-xs text-orange-100/45">
                                {reference.publisher}
                              </span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                </article>
              )}

              {view === "article" && !selectedArticle && (
                <div className="p-6">
                  <p className="text-sm text-orange-100/70">
                    This guide article is unavailable.
                  </p>
                  <button
                    type="button"
                    onClick={() => setView("browse")}
                    className="mt-3 text-sm text-orange-300 underline"
                  >
                    Return to field guide
                  </button>
                </div>
              )}
            </main>

            <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-orange-500/20 px-4 py-2 text-[0.65rem] text-orange-100/45 sm:px-6">
              <span>Educational prototype · not operational guidance</span>
              {view === "article" && (
                <button
                  type="button"
                  onClick={() => setView(returnView)}
                  className="inline-flex items-center gap-1 text-orange-300 hover:text-white"
                >
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                  Back
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
