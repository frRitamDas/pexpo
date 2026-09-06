"use client";

import AlbumCard from "@/components/cards/album";
import ArtistCard from "@/components/cards/artist";
import SongCard from "@/components/cards/song";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsById, getSongsByQuery, searchAlbumByQuery } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import { ArrowRight, Compass, Headphones, Library, Search, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const quickSearches = ["Arijit Singh", "Bollywood", "Romantic", "Lo-fi", "Punjabi", "Tamil", "Hindi classics"];
const tabNames = ["play", "library", "explore", "account"];

function SectionHeading({ title, subtitle, href }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-lg font-semibold tracking-tight">{title}</h2><p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p></div>{href && <Link href={href} className="hidden items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:flex">See all <ArrowRight className="h-3.5 w-3.5" /></Link>}</div>;
}

function RowSkeleton() {
  return <div className="flex gap-4 overflow-hidden">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-[188px] shrink-0"><Skeleton className="aspect-square w-full rounded-2xl" /><Skeleton className="mt-3 h-4 w-3/4" /><Skeleton className="mt-1 h-3 w-1/2" /></div>)}</div>;
}

export default function Page() {
  const [tab, setTab] = useState("play");
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const readTab = () => {
      const value = new URLSearchParams(window.location.search).get("tab");
      setTab(tabNames.includes(value) ? value : "play");
    };
    readTab();
    window.addEventListener("popstate", readTab);
    return () => window.removeEventListener("popstate", readTab);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSongsByQuery("latest"), getSongsByQuery("trending"), searchAlbumByQuery("latest")])
      .then(async ([a, b, c]) => Promise.all([a.json(), b.json(), c.json()]))
      .then(([a, b, c]) => {
        if (cancelled) return;
        setLatest(a?.data?.results || []);
        setPopular(b?.data?.results || []);
        setAlbums(c?.data?.results || []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("last-played");
    if (!id) { setLastPlayed(null); return; }
    getSongsById(id).then((res) => res.json()).then((json) => setLastPlayed(json?.data?.[0] || null)).catch(() => setLastPlayed(null));
  }, [tab]);

  const artists = useMemo(() => {
    const map = new Map();
    [...latest, ...popular].forEach((song) => {
      const artist = song?.artists?.primary?.[0];
      if (artist?.id && !map.has(artist.id)) map.set(artist.id, artist);
    });
    return [...map.values()].slice(0, 12);
  }, [latest, popular]);

  if (tab === "library") return <main className="mx-auto w-full max-w-[1280px] px-4 pb-32 pt-10 sm:px-6 lg:px-10"><div className="mb-9 rounded-[28px] border border-border/70 bg-secondary/30 p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><Library className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Your space</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Library</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Your playback history stays on this device. No account is required.</p></div></div></div><SectionHeading title="Recently played" subtitle="Pick up where you left off." />{lastPlayed ? <div className="max-w-xl"><SongCard image={lastPlayed.image?.[2]?.url} title={lastPlayed.name} artist={lastPlayed.artists?.primary?.[0]?.name} id={lastPlayed.id} /></div> : <div className="rounded-2xl border border-dashed border-border p-10 text-center"><Headphones className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Nothing played yet</p><p className="mt-1 text-xs text-muted-foreground">Start a song from Play or Explore and it will appear here.</p><Link href="/?tab=play" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Browse music</Link></div>}</main>;

  if (tab === "explore") return <main className="mx-auto w-full max-w-[1280px] px-4 pb-32 pt-10 sm:px-6 lg:px-10"><div className="mb-10"><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Discover</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Explore music</h1><p className="mt-2 text-sm text-muted-foreground">Jump into a search and let PEXPO do the rest.</p></div><div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">{quickSearches.map((item) => <Link key={item} href={`/search/${encodeURIComponent(item)}`} className="group rounded-2xl border border-border/70 bg-secondary/25 p-5 transition hover:-translate-y-0.5 hover:bg-secondary/50"><Search className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" /><p className="mt-8 text-sm font-medium">{item}</p><ArrowRight className="mt-1 h-3.5 w-3.5 text-muted-foreground" /></Link>)}</div><SectionHeading title="Trending now" subtitle="A clean starting point for your next listen." /><div className="grid gap-3 sm:grid-cols-2">{popular.slice(0, 8).map((song) => <Link key={song.id} href={`/${song.id}`} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary/20 p-2.5 transition hover:bg-secondary/45"><img src={song.image?.[2]?.url} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate text-sm font-medium">{cleanMusicText(song.name)}</p><p className="truncate text-xs text-muted-foreground">{cleanMusicText(song.artists?.primary?.[0]?.name || "Unknown artist")}</p></div><ArrowRight className="ml-auto mr-2 h-4 w-4 text-muted-foreground" /></Link>)}</div></main>;

  if (tab === "account") return <main className="mx-auto w-full max-w-[900px] px-4 pb-32 pt-10 sm:px-6"><div className="rounded-[30px] border border-border/70 bg-secondary/25 p-6 sm:p-9"><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground"><UserRound className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Local profile</p><h1 className="mt-1 text-2xl font-semibold">Guest account</h1><p className="mt-1 text-sm text-muted-foreground">Your preferences are stored locally on this device.</p></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><Link href="/?tab=library" className="rounded-2xl border border-border/70 p-5 transition hover:bg-secondary/45"><Library className="h-5 w-5" /><p className="mt-4 text-sm font-medium">Open Library</p><p className="mt-1 text-xs text-muted-foreground">See your recently played song.</p></Link><div className="rounded-2xl border border-border/70 p-5"><Sparkles className="h-5 w-5" /><p className="mt-4 text-sm font-medium">Personalize PEXPO</p><p className="mt-1 text-xs text-muted-foreground">Use Settings above for theme, accent, glass and motion controls.</p></div></div></div></main>;

  return <main className="mx-auto w-full max-w-[1280px] px-4 pb-32 pt-8 sm:px-6 lg:px-10"><section className="mb-12 grid items-end gap-7 rounded-[30px] border border-border/70 bg-secondary/20 p-6 sm:p-9 lg:grid-cols-[1fr_auto]"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground"><Sparkles className="h-3.5 w-3.5" /> PEXPO · Music, simplified</div><h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Find something worth<br className="hidden sm:block" /> listening to.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">A focused music player with clean discovery, a personal library and zero visual clutter.</p></div><Link href="/?tab=explore" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"><Compass className="h-4 w-4" /> Explore</Link></section><section className="mb-12"><SectionHeading title="New releases" subtitle="Fresh songs to start with." />{loading ? <RowSkeleton /> : <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{latest.slice(0, 12).map((song) => <SongCard key={song.id} image={song.image?.[2]?.url} title={song.name} artist={song.artists?.primary?.[0]?.name} id={song.id} />)}</div>}</section><section className="mb-12"><SectionHeading title="Latest albums" subtitle="Newly added albums and soundtracks." />{loading ? <RowSkeleton /> : <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{albums.slice(0, 12).map((album) => <AlbumCard key={album.id} lang={album.language} image={album.image?.[2]?.url} album={album.album} title={album.name} artist={album.artists?.primary?.[0]?.name} id={`album/${album.id}`} />)}</div>}</section><section className="mb-12"><SectionHeading title="Artists" subtitle="Artists appearing across today's music." />{loading ? <div className="flex gap-5"><Skeleton className="h-[100px] w-[100px] rounded-full" /><Skeleton className="h-[100px] w-[100px] rounded-full" /><Skeleton className="h-[100px] w-[100px] rounded-full" /></div> : <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{artists.map((artist) => <ArtistCard key={artist.id} id={artist.id} image={artist.image?.[2]?.url} name={cleanMusicText(artist.name)} />)}</div>}</section><section><SectionHeading title="Trending" subtitle="What people are playing this week." />{loading ? <RowSkeleton /> : <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{popular.slice(0, 12).map((song) => <SongCard key={song.id} image={song.image?.[2]?.url} title={song.name} artist={song.artists?.primary?.[0]?.name} id={song.id} />)}</div>}</section></main>;
}
