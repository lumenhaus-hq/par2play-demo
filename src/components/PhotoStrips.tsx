import { VideoSlot } from "./VideoSlot";
import { EVENT_GALLERY, type GalleryPhoto } from "../data/gallery";
import { EVENTS_HERO_FILM } from "../data/films";

function Photo({ photo, eager = false, sizes }: { photo: GalleryPhoto; eager?: boolean; sizes: string }) {
  return (
    <img
      src={photo.src800}
      srcSet={`${photo.src800} 800w, ${photo.src1600} 1600w`}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

export function EventGallery() {
  return (
    <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 @3xl:mx-0 @3xl:grid @3xl:grid-cols-3 @3xl:overflow-visible @3xl:px-0">
      {EVENT_GALLERY.map((photo) => (
        <li key={photo.id} className="aspect-video w-[78%] shrink-0 snap-start overflow-hidden @3xl:w-auto">
          <Photo photo={photo} sizes="(min-width: 48rem) 30vw, 78vw" />
        </li>
      ))}
    </ul>
  );
}

export function EventHero() {
  return (
    <header className="bg-void text-white">
      <div className="relative aspect-video w-full overflow-hidden">
        <VideoSlot
          src={EVENTS_HERO_FILM.src}
          srcMobile={EVENTS_HERO_FILM.srcMobile}
          poster={EVENTS_HERO_FILM.poster}
          className="absolute inset-0 h-full"
          pausable
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-void to-transparent"
          aria-hidden="true"
        />
      </div>
      <div className="px-6 pt-2 pb-8 @3xl:px-12">
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-6xl">
          Events
        </h1>
      </div>
    </header>
  );
}

export function StillGrid({ photos, className = "" }: { photos: readonly GalleryPhoto[]; className?: string }) {
  return (
    <ul className={`mt-8 grid grid-cols-2 gap-2 @3xl:grid-cols-4 ${className}`}>
      {photos.map((photo) => (
        <li key={photo.id} className="aspect-video overflow-hidden">
          <Photo photo={photo} sizes="(min-width: 48rem) 22vw, 46vw" />
        </li>
      ))}
    </ul>
  );
}
