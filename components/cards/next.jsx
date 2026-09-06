import Link from "next/link";
import { Badge } from "../ui/badge";
import { Play } from "lucide-react";
import { Button } from "../ui/button";
import { cleanMusicText } from "@/lib/text";

export default function Next({ name, artist, image, id, next = true }) {
  const title = cleanMusicText(name || "Unknown title");
  const byline = cleanMusicText(artist || "Unknown artist");
  return (
    <Link href={`/${id}`} className="block">
      <div className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/20 p-2.5 transition-colors hover:bg-secondary/45">
        {image ? <img src={image} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <div className="h-12 w-12 rounded-xl bg-secondary" />}
        <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{title}</h2><p className="mt-0.5 truncate text-xs text-muted-foreground">by <span className="text-foreground/80">{byline}</span></p></div>
        {next ? <Badge variant="secondary" className="rounded-full px-2.5 text-[10px] font-medium">next</Badge> : <Button size="icon" className="h-8 w-8 shrink-0 rounded-full" aria-label={`Play ${title}`}><Play className="h-3.5 w-3.5" /></Button>}
      </div>
    </Link>
  );
}
