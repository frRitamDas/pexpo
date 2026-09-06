import Link from "next/link";
import { cleanMusicText } from "@/lib/text";

export default function ArtistCard({ image, name }) {
  const safeName = cleanMusicText(name || "Unknown artist");
  return (
    <Link href={`/search/${encodeURIComponent(safeName)}`} className="group w-[100px] shrink-0 text-center">
      <div className="mx-auto h-[100px] w-[100px] overflow-hidden rounded-full border border-border/60 bg-secondary/50 p-0.5">
        <img src={image} alt={safeName} loading="lazy" className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-[1.035]" />
      </div>
      <h2 className="mt-2 truncate text-[12px] font-medium" title={safeName}>{safeName}</h2>
    </Link>
  );
}
