"use client";

import Image from "next/image";

import type { MarsLandmark } from "./landmarkTypes";

type LandmarkSidebarProps = {
  landmark: MarsLandmark | null;
  onClose: () => void;
};

export default function LandmarkSidebar({
  landmark,
  onClose,
}: LandmarkSidebarProps) {
  if (!landmark) return null;

  return (
    <aside
      className="fixed inset-y-0 left-0 z-999 w-full max-w-md overflow-y-auto border-r border-orange-500/40 bg-black/95 text-orange-100 shadow-2xl"
      aria-labelledby="landmark-sidebar-title"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-orange-500/30 bg-black/95 p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-400">
            {landmark.category}
          </p>
          <h2
            id="landmark-sidebar-title"
            className="mt-1 text-xl font-semibold text-orange-300"
          >
            {landmark.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-3 py-1 text-2xl leading-7 text-orange-300 hover:bg-orange-500/20"
          aria-label="Close landmark information"
        >
          ×
        </button>
      </div>
      {landmark.images.length > 0 && (
        <section aria-label={`${landmark.name} images`}>
          <div className="space-y-4">
            {landmark.images.map((image) => (
              <figure
                key={image.src}
                className="overflow-hidden border border-orange-500/30 bg-black"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full"
                  sizes="(max-width: 448px) 100vw, 448px"
                />
                <figcaption className="space-y-1 p-3 text-xs">
                  <p>{image.caption}</p>
                  <p className="text-orange-300/70">Image: {image.attribution}</p>
                  <a
                    className="inline-block text-orange-400 underline underline-offset-2 hover:text-orange-200"
                    href={image.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View NASA source
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-5 p-5">
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-orange-400">
            Location
          </h3>
          <p className="font-mono text-xs text-orange-200">
            LAT: {landmark.coordinates[1].toFixed(4)}°
            <br />
            LON: {landmark.coordinates[0].toFixed(4)}°
          </p>
        </section>
        <p className="text-sm leading-6 text-orange-100/90">{landmark.details}</p>
      </div>
    </aside>
  );
}
