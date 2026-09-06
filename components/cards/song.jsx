"use client";

import { useContext } from "react";
import { Skeleton } from "../ui/skeleton";
import { MusicContext } from "@/hooks/use-context";
import { IoPlay } from "react-icons/io5";
import { cleanMusicText } from "@/lib/text";

export default function SongCard({ title, image, artist, id, desc }) {
  const ids = useContext(MusicContext);
  const safeTitle = title ? cleanMusicText(title) : "";
  const safeArtist = artist ? cleanMusicText(artist) : "";
  const safeDesc = desc ? cleanMusicText(desc) : "";

  const play = () => {
    if (!id || !ids?.setMusic) return;
    ids.setMusic(id);
    localStorage.setItem("last-played", id);
  };

  return (
    <article className="song-card h-fit w-[188px] shrink-0 sm:w-[200px]">
      <button type="button" onClick={play} className="group relative block w-full overflow-hidden rounded-2xl text-left" aria-label={safeTitle ? `Play ${safeTitle}` : "Play song"}>
        {image ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/60">
            <img src={image} alt={safeTitle || "Song artwork"} className="blurz h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.035]" loading="lazy" />
            <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-background/90 shadow-lg backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
              <IoPlay className="h-4 w-4 -mr-0.5" />
            </span>
          </div>
        ) : <Skeleton className="aspect-square w-full rounded-2xl" />}
      </button>
      <button type="button" onClick={play} className="mt-3 block w-full text-left">
        {safeTitle ? <h2 className="truncate text-[14px] font-semibold leading-5" title={safeTitle}>{safeTitle}</h2> : <Skeleton className="mt-1 h-4 w-3/4" />}
        {safeArtist ? <p className="mt-0.5 truncate text-[12px] leading-5 text-muted-foreground">{safeArtist}</p> : <Skeleton className="mt-1 h-3 w-1/2" />}
        {safeDesc && <p className="mt-0.5 truncate text-[11px] text-muted-foreground/75">{safeDesc}</p>}
      </button>
    </article>
  );
}
