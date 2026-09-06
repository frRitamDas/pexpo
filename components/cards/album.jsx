import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { cleanMusicText } from "@/lib/text";

export default function AlbumCard({ title, image, artist, id, desc, lang }) {
  const safeTitle = title ? cleanMusicText(title) : "";
  const safeArtist = artist ? cleanMusicText(artist) : "";
  return (
    <article className="h-fit w-[188px] shrink-0 sm:w-[200px]">
      {image ? <Link href={`/${id}`} className="group block overflow-hidden rounded-2xl"><img src={image} alt={safeTitle || "Album artwork"} loading="lazy" className="aspect-square w-full rounded-2xl bg-secondary/60 object-cover transition-transform duration-300 group-hover:scale-[1.035]" /></Link> : <Skeleton className="aspect-square w-full rounded-2xl" />}
      {safeTitle ? <Link href={`/${id}`} className="mt-3 block truncate text-[14px] font-semibold leading-5 hover:underline" title={safeTitle}>{safeTitle}</Link> : <Skeleton className="mt-3 h-4 w-3/4" />}
      {safeArtist ? <p className="mt-0.5 truncate text-[12px] leading-5 text-muted-foreground">{safeArtist}</p> : <Skeleton className="mt-1 h-3 w-1/2" />}
      {lang && <Badge variant="outline" className="mt-1 rounded-full px-2 text-[10px] font-normal">{cleanMusicText(lang)}</Badge>}
      {desc && <p className="mt-0.5 truncate text-[11px] text-muted-foreground/75">{cleanMusicText(desc)}</p>}
    </article>
  );
}
