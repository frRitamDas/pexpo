"use client";

import Next from "@/components/cards/next";
import { Skeleton } from "@/components/ui/skeleton";
import { useNextMusicProvider } from "@/hooks/use-context";
import { getSongsSuggestions } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import { useEffect, useState } from "react";

export default function Recomandation({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const next = useNextMusicProvider();

  useEffect(() => {
    let cancelled = false;
    getSongsSuggestions(id).then((res) => res.json()).then((json) => {
      const songs = json?.data || [];
      if (cancelled) return;
      setData(songs);
      const pick = songs[Math.floor(Math.random() * songs.length)];
      if (pick) next.setNextData({ id: pick.id, name: pick.name, artist: pick.artists?.primary?.[0]?.name || "unknown", album: pick.album?.name || "", image: pick.image?.[1]?.url || pick.image?.[0]?.url });
    }).catch(() => { if (!cancelled) setData(false); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-5"><h2 className="text-lg font-semibold tracking-tight">Recommended</h2><p className="mt-0.5 text-xs text-muted-foreground">More music you may enjoy.</p></div>
      {loading && <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />)}</div>}
      {!loading && data && <div className="grid gap-3 sm:grid-cols-2">{data.map((song) => <Next next={false} key={song.id} image={song.image?.[2]?.url || song.image?.[1]?.url} name={cleanMusicText(song.name)} artist={cleanMusicText(song.artists?.primary?.[0]?.name || "unknown")} id={song.id} />)}</div>}
      {!loading && !data && <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">No recommendations available for this song.</div>}
    </section>
  );
}
