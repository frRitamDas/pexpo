"use client";

import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowRight, Compass, Library, Play, Search, UserRound } from "lucide-react";
import { MusicContext } from "@/hooks/use-context";
import { getSongsById, getSongsByQuery, searchAlbumByQuery } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import { Skeleton } from "@/components/ui/skeleton";

const TABS = ["play", "explore", "library", "account"];
const MOODS = ["Chill", "Commute", "Energize", "Feel good"];
const EXPLORE = ["Hip-hop", "Monsoon", "Workout", "Indian pop", "Commute", "Feel good"];

function EventButton({ tab, children, className = "" }) {
  return <button type="button" className={className} onClick={() => {
    if (typeof window === "undefined") return;
    window.history.pushState(null, "", `#${tab}`);
    window.dispatchEvent(new CustomEvent("pexpo-tab-change", { detail: { tab } }));
  }}>{children}</button>;
}

function ArtCard({ song, feature = false }) {
  const music = useContext(MusicContext);
  const title = cleanMusicText(song?.name || "Unknown song");
  const artist = cleanMusicText(song?.artists?.primary?.[0]?.name || "Unknown artist");
  const image = song?.image?.[2]?.url || song?.image?.[1]?.url;
  const play = () => {
    if (!song?.id || !music?.setMusic) return;
    music.setMusic(song.id);
    localStorage.setItem("last-played", song.id);
  };
  return (
    <article className={`pexpo-art-card ${feature ? "is-feature" : ""}`}>
      <button type="button" onClick={play} className="pexpo-art-button" aria-label={`Play ${title}`}>
        {image ? <img src={image} alt="" loading="lazy" /> : <Skeleton className="h-full w-full" />}
        <span className="pexpo-art-shade" />
        <span className="pexpo-art-copy"><strong>{title}</strong><small>{artist}</small></span>
      </button>
    </article>
  );
}

export default function Page() {
  const [tab, setTab] = useState("play");
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = (event) => {
      const next = event.detail?.tab;
      if (TABS.includes(next)) setTab(next);
    };
    const syncHash = () => {
      const value = window.location.hash.slice(1).toLowerCase();
      if (TABS.includes(value)) setTab(value);
    };
    syncHash();
    window.addEventListener("pexpo-tab-change", sync);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("pexpo-tab-change", sync);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
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
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("last-played");
    if (!id) return;
    getSongsById(id).then((r) => r.json()).then((j) => setLastPlayed(j?.data?.[0] || null)).catch(() => {});
  }, []);

  const recent = useMemo(() => {
    const source = lastPlayed ? [lastPlayed, ...latest] : latest;
    return source.filter((s, i, arr) => s?.id && arr.findIndex((x) => x?.id === s.id) === i).slice(0, 8);
  }, [latest, lastPlayed]);

  if (tab === "play") return (
    <main className="pexpo-app-shell"><div className="pexpo-page-frame">
      <div className="pexpo-reference-title"><h1>Listen Now</h1></div>
      <section className="pexpo-reference-section"><h2>Recents</h2>
        {loading ? <div className="pexpo-reference-scroller">{[1,2,3].map(i => <Skeleton key={i} className="pexpo-art-skeleton" />)}</div> : <div className="pexpo-reference-scroller">{recent.map((song, i) => <ArtCard key={song.id} song={song} feature={i === 0} />)}</div>}
      </section>
      <section className="pexpo-reference-section"><h2>Quick picks</h2>
        <div className="pexpo-quick-grid">{popular.slice(0, 6).map((song) => <ArtCard key={song.id} song={song} />)}</div>
      </section>
      <section className="pexpo-reference-section"><h2>Made for your mood</h2>
        <div className="pexpo-mood-row">{MOODS.map((m, i) => <Link key={m} href={`/search/${encodeURIComponent(m)}`} className={`pexpo-mood-card mood-${i}`}>{m}<ArrowRight /></Link>)}</div>
      </section>
    </div></main>
  );

  if (tab === "explore") return (
    <main className="pexpo-app-shell"><div className="pexpo-page-frame">
      <div className="pexpo-reference-title"><h1>Explore</h1></div>
      <section className="pexpo-reference-section"><h2>For you</h2><div className="pexpo-explore-reference">{EXPLORE.map((name, i) => {
        const song = popular[i] || latest[i];
        return <Link key={name} href={`/search/${encodeURIComponent(name)}`} className={`pexpo-explore-tile tile-${i}`}>
          <strong>{name}</strong>{song?.image?.[2]?.url && <img src={song.image[2].url} alt="" />}
        </Link>;
      })}</div></section>
      <section className="pexpo-reference-section"><h2>Moods & moments</h2><div className="pexpo-explore-reference">{[...MOODS, "Focus", "Night drive"].map((name, i) => <Link key={`${name}-${i}`} href={`/search/${encodeURIComponent(name)}`} className={`pexpo-explore-tile tile-${i + 2}`}><strong>{name}</strong>{popular[i]?.image?.[2]?.url && <img src={popular[i].image[2].url} alt="" />}</Link>)}</div></section>
    </div></main>
  );

  if (tab === "library") return (
    <main className="pexpo-app-shell"><div className="pexpo-page-frame">
      <div className="pexpo-reference-title"><h1>Library</h1></div>
      <Link href="/replay" className="pexpo-replay-banner"><div><strong>Your Replay</strong><span>48 minutes listened · 21 plays · 2026</span></div><ArrowRight /></Link>
      <section className="pexpo-reference-section"><h2>On Device</h2><div className="pexpo-device-grid"><Link href="#downloads" className="pexpo-device-card device-blue"><DownloadIcon /><strong>Downloads</strong><span>Downloaded songs</span></Link><Link href="#local" className="pexpo-device-card device-teal"><MusicIcon /><strong>Local Music</strong><span>Audio files on device</span></Link></div></section>
      <section className="pexpo-reference-section"><h2>Playlists</h2><div className="pexpo-playlist-grid"><button className="pexpo-new-playlist">+</button>{albums.slice(0, 4).map((a) => <Link key={a.id} href={`/album/${a.id}`} className="pexpo-playlist-card"><img src={a.image?.[2]?.url} alt="" /><strong>{cleanMusicText(a.name)}</strong></Link>)}</div></section>
    </div></main>
  );

  return <main className="pexpo-app-shell"><div className="pexpo-page-frame">
    <div className="pexpo-reference-title"><h1>Account</h1></div>
    <section className="pexpo-account-reference"><UserRound /><h2>Guest</h2><p>Your listening environment lives on this device.</p><EventButton tab="play" className="pexpo-reference-button"><Play /> Open Play</EventButton></section>
  </div></main>;
}

function DownloadIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M4 20h16" /></svg>; }
function MusicIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18.5V7.8L18 5v10.5M7 18.5a3 3 0 1 0 3 3 3 3 0 0 0-3-3Zm11-3a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z" /></svg>; }
