"use client";

import AlbumCard from "@/components/cards/album";
import ArtistCard from "@/components/cards/artist";
import SongCard from "@/components/cards/song";
import { Skeleton } from "@/components/ui/skeleton";
import { getSongsById, getSongsByQuery, searchAlbumByQuery } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import {
  ArrowUpRight,
  Compass,
  Headphones,
  Library,
  ListMusic,
  Play,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

const QUICK_SEARCHES = ["Arijit Singh", "Bollywood", "Romantic", "Lo-fi", "Punjabi", "Tamil", "Hindi classics", "Indie"];
const TABS = ["play", "library", "explore", "account"];

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="pexpo-section-title">
      <div>
        {eyebrow && <span className="pexpo-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function SongSkeletons({ count = 5 }) {
  return <div className="pexpo-song-grid">{Array.from({ length: count }).map((_, i) => <div className="pexpo-skeleton-card" key={i}><Skeleton className="aspect-square w-full rounded-[20px]" /><Skeleton className="mt-3 h-4 w-4/5" /><Skeleton className="mt-2 h-3 w-2/5" /></div>)}</div>;
}

function EventButton({ tab, children, className = "" }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent("pexpo-tab-change", { detail: { tab } }))}>{children}</button>;
}

export default function Page() {
  const [tab, setTab] = useState("play");
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const onTab = (event) => {
      const next = event.detail?.tab;
      if (TABS.includes(next)) startTransition(() => setTab(next));
    };
    window.addEventListener("pexpo-tab-change", onTab);
    return () => window.removeEventListener("pexpo-tab-change", onTab);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSongsByQuery("latest"), getSongsByQuery("trending"), searchAlbumByQuery("latest")])
      .then(async ([songs, trending, album]) => Promise.all([songs.json(), trending.json(), album.json()]))
      .then(([songs, trending, album]) => {
        if (cancelled) return;
        setLatest(songs?.data?.results || []);
        setPopular(trending?.data?.results || []);
        setAlbums(album?.data?.results || []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("last-played");
    if (!id) return;
    getSongsById(id).then((res) => res.json()).then((json) => setLastPlayed(json?.data?.[0] || null)).catch(() => {});
  }, []);

  const artists = useMemo(() => {
    const map = new Map();
    [...latest, ...popular].forEach((song) => {
      const artist = song?.artists?.primary?.[0];
      if (artist?.id && !map.has(artist.id)) map.set(artist.id, artist);
    });
    return [...map.values()].slice(0, 10);
  }, [latest, popular]);

  return (
    <main className="pexpo-app-shell">
      <div className="pexpo-page-frame" data-tab={tab}>
        {tab === "play" && (
          <div className="pexpo-view pexpo-view-enter">
            <section className="pexpo-hero-grid">
              <div className="pexpo-hero-main">
                <div className="pexpo-hero-kicker"><span className="pexpo-live-dot" /> PEXPO / NOW DISCOVERING</div>
                <h1>Music that feels<br /><span>made for you.</span></h1>
                <p>Go beyond playlists. Discover sounds, artists and moments with a music experience designed around the next listen.</p>
                <div className="pexpo-hero-actions">
                  <EventButton tab="explore" className="pexpo-primary-button"><Compass className="h-4 w-4" /> Discover</EventButton>
                  <Link href={lastPlayed ? `/${lastPlayed.id}` : "#new-releases"} className="pexpo-secondary-button">
                    <Play className="h-4 w-4" /> {lastPlayed ? "Resume listening" : "Start listening"}
                  </Link>
                </div>
              </div>
              <div className="pexpo-hero-side">
                <div className="pexpo-orbit-mark"><span>P</span></div>
                <div><span className="pexpo-eyebrow">THE NEXT LISTEN</span><p>Fresh music. Familiar taste. Unexpected discoveries.</p></div>
                <div className="pexpo-mini-stats"><span><strong>{latest.length || "—"}</strong> new</span><span><strong>{popular.length || "—"}</strong> trending</span></div>
              </div>
            </section>

            <section id="new-releases" className="pexpo-section">
              <SectionTitle eyebrow="CURATED FOR YOU" title="New releases" subtitle="Fresh drops worth hearing first." />
              {loading ? <SongSkeletons /> : <div className="pexpo-song-grid">{latest.slice(0, 10).map((song, index) => <div key={song.id} className={index === 0 ? "pexpo-feature-card" : ""}><SongCard image={song.image?.[2]?.url} title={cleanMusicText(song.name)} artist={cleanMusicText(song.artists?.primary?.[0]?.name || "Unknown artist")} id={song.id} /></div>)}</div>}
            </section>

            <section className="pexpo-discovery-band">
              <div><span className="pexpo-eyebrow">DISCOVERY SIGNAL</span><h2>Let your next song surprise you.</h2><p>Explore by mood, culture, artist or sound.</p></div>
              <EventButton tab="explore" className="pexpo-round-arrow" aria-label="Open Explore"><ArrowUpRight className="h-5 w-5" /></EventButton>
            </section>

            <section className="pexpo-section">
              <SectionTitle eyebrow="ALBUMS" title="New worlds to enter" subtitle="Albums and soundtracks, presented without clutter." />
              {loading ? <SongSkeletons /> : <div className="pexpo-album-grid">{albums.slice(0, 8).map((album) => <AlbumCard key={album.id} lang={album.language} image={album.image?.[2]?.url} album={album.album} title={cleanMusicText(album.name)} artist={cleanMusicText(album.artists?.primary?.[0]?.name || "Unknown artist")} id={`album/${album.id}`} />)}</div>}
            </section>

            <section className="pexpo-section">
              <SectionTitle eyebrow="ARTISTS" title="Voices to follow" subtitle="People shaping what you hear next." />
              {loading ? <div className="flex gap-5"><Skeleton className="h-24 w-24 rounded-full" /><Skeleton className="h-24 w-24 rounded-full" /><Skeleton className="h-24 w-24 rounded-full" /></div> : <div className="pexpo-artist-row">{artists.map((artist) => <ArtistCard key={artist.id} id={artist.id} image={artist.image?.[2]?.url} name={cleanMusicText(artist.name)} />)}</div>}
            </section>

            <section className="pexpo-section pexpo-trending-section">
              <SectionTitle eyebrow="RIGHT NOW" title="Trending" subtitle="The sounds getting attention this week." />
              {loading ? <SongSkeletons /> : <div className="pexpo-trending-grid">{popular.slice(0, 8).map((song, index) => <Link key={song.id} href={`/${song.id}`} className="pexpo-trending-item"><span className="pexpo-rank">{String(index + 1).padStart(2, "0")}</span><img src={song.image?.[2]?.url} alt="" /><div className="min-w-0"><strong>{cleanMusicText(song.name)}</strong><span>{cleanMusicText(song.artists?.primary?.[0]?.name || "Unknown artist")}</span></div><ArrowUpRight className="ml-auto h-4 w-4" /></Link>)}</div>}
            </section>
          </div>
        )}

        {tab === "library" && (
          <div className="pexpo-view pexpo-view-enter">
            <section className="pexpo-page-intro"><span className="pexpo-icon-tile"><Library className="h-5 w-5" /></span><div><span className="pexpo-eyebrow">YOUR MUSIC</span><h1>Library</h1><p>A private space for what you return to.</p></div></section>
            <section className="pexpo-library-layout">
              <div className="pexpo-library-feature">
                {lastPlayed ? <><img src={lastPlayed.image?.[2]?.url} alt="" /><div><span className="pexpo-eyebrow">CONTINUE LISTENING</span><h2>{cleanMusicText(lastPlayed.name)}</h2><p>{cleanMusicText(lastPlayed.artists?.primary?.[0]?.name || "Unknown artist")}</p><Link href={`/${lastPlayed.id}`} className="pexpo-primary-button"><Play className="h-4 w-4" /> Play again</Link></div></> : <div className="pexpo-empty-state"><Headphones className="h-7 w-7" /><h2>Your library is waiting.</h2><p>Start a song and PEXPO will remember where your listening journey began.</p><EventButton tab="play" className="pexpo-secondary-button">Browse new music</EventButton></div>}
              </div>
              <div className="pexpo-library-list"><div className="pexpo-list-header"><span>Recently played</span><span>On this device</span></div>{lastPlayed && <Link href={`/${lastPlayed.id}`} className="pexpo-list-row"><img src={lastPlayed.image?.[2]?.url} alt="" /><span className="min-w-0"><strong>{cleanMusicText(lastPlayed.name)}</strong><small>{cleanMusicText(lastPlayed.artists?.primary?.[0]?.name || "Unknown artist")}</small></span><ArrowUpRight className="ml-auto h-4 w-4" /></Link>}</div>
            </section>
          </div>
        )}

        {tab === "explore" && (
          <div className="pexpo-view pexpo-view-enter">
            <section className="pexpo-page-intro"><span className="pexpo-icon-tile"><Compass className="h-5 w-5" /></span><div><span className="pexpo-eyebrow">DISCOVER SOMETHING NEW</span><h1>Explore</h1><p>Start with a feeling. Leave with a song.</p></div></section>
            <section className="pexpo-explore-grid">{QUICK_SEARCHES.map((item, index) => <Link key={item} href={`/search/${encodeURIComponent(item)}`} className={`pexpo-explore-card ${index === 0 ? "is-featured" : ""}`}><Search className="h-4 w-4" /><span>{item}</span><ArrowUpRight className="ml-auto h-4 w-4" /></Link>)}</section>
            <section className="pexpo-section"><SectionTitle eyebrow="TRENDING SIGNAL" title="People are listening" subtitle="A quick route into what's moving right now." /><div className="pexpo-trending-grid">{popular.slice(0, 10).map((song, index) => <Link key={song.id} href={`/${song.id}`} className="pexpo-trending-item"><span className="pexpo-rank">{String(index + 1).padStart(2, "0")}</span><img src={song.image?.[2]?.url} alt="" /><div className="min-w-0"><strong>{cleanMusicText(song.name)}</strong><span>{cleanMusicText(song.artists?.primary?.[0]?.name || "Unknown artist")}</span></div><ArrowUpRight className="ml-auto h-4 w-4" /></Link>)}</div></section>
          </div>
        )}

        {tab === "account" && (
          <div className="pexpo-view pexpo-view-enter">
            <section className="pexpo-account-hero"><div className="pexpo-account-avatar"><UserRound className="h-7 w-7" /></div><div><span className="pexpo-eyebrow">PEXPO PROFILE</span><h1>Guest</h1><p>Your listening environment lives on this device.</p></div></section>
            <section className="pexpo-account-grid"><div className="pexpo-account-card"><ListMusic className="h-5 w-5" /><span className="pexpo-eyebrow">PLAY</span><h2>Keep discovering.</h2><p>Return to the main feed whenever you're ready for the next listen.</p><EventButton tab="play" className="pexpo-secondary-button">Open Play</EventButton></div><div className="pexpo-account-card"><Library className="h-5 w-5" /><span className="pexpo-eyebrow">LIBRARY</span><h2>Your listening history.</h2><p>{lastPlayed ? "Your latest song is ready to continue." : "Play a song to start building your local history."}</p><EventButton tab="library" className="pexpo-secondary-button">Open Library</EventButton></div><div className="pexpo-account-card"><Sparkles className="h-5 w-5" /><span className="pexpo-eyebrow">PERSONALIZE</span><h2>Make PEXPO yours.</h2><p>Use the settings control in the navigation to adjust your experience.</p></div></section>
          </div>
        )}
      </div>
    </main>
  );
}
