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
      className="fixed inset-y-0 left-0 z-[60] w-full max-w-md overflow-y-auto border-r border-red-500/40 bg-black/95 text-red-100 shadow-2xl"
      aria-labelledby="landmark-sidebar-title"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-red-500/30 bg-black/95 p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-400">
            {landmark.category}
          </p>
          <h2
            id="landmark-sidebar-title"
            className="mt-1 text-xl font-semibold text-red-300"
          >
            {landmark.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-3 py-1 text-2xl leading-7 text-red-300 hover:bg-red-500/20"
          aria-label="Close landmark information"
        >
          ×
        </button>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm leading-6 text-red-100/90">{landmark.details}</p>

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-400">
            Location
          </h3>
          <p className="font-mono text-xs text-red-200">
            Latitude {landmark.coordinates[1].toFixed(4)}°
            <br />
            Longitude {landmark.coordinates[0].toFixed(4)}°
          </p>
        </section>

        {landmark.images.length > 0 && (
          <section aria-label={`${landmark.name} images`}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-400">
              Images
            </h3>
            <div className="space-y-4">
              {landmark.images.map((image) => (
                <figure
                  key={image.src}
                  className="overflow-hidden border border-red-500/30 bg-black"
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
                    <p className="text-red-300/70">
                      Image: {image.attribution}
                    </p>
                    <a
                      className="inline-block text-red-400 underline underline-offset-2 hover:text-red-200"
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
      </div>
    </aside>
  );
}
