"use client";

import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSongsByQuery } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import { MusicContext } from "@/hooks/use-context";
import { useContext } from "react";

export default function ReplayPage() {
  const router = useRouter();
  const music = useContext(MusicContext);
  const [songs, setSongs] = useState([]);
  useEffect(() => { getSongsByQuery("trending").then(r => r.json()).then(j => setSongs(j?.data?.results?.slice(0, 8) || [])).catch(() => {}); }, []);
  return <main className="pexpo-replay-screen">
    <header><button onClick={() => router.back()} aria-label="Back"><ArrowLeft /></button><strong>Replay</strong><span /></header>
    <h1>Replay</h1><p className="pexpo-replay-year">2026</p>
    <div className="pexpo-replay-tabs"><button>This month</button><button className="is-active">This year</button><button>All time</button></div>
    <div className="pexpo-replay-cards"><article><span>YOUR LISTENING EXPERIENCE</span><b>48</b><small>MINUTES LISTENED</small><strong>ARCDINO GAMING</strong><em>21 plays · 2026</em></article><article><span>YOUR LISTENING</span><b>Codet</b><small>TOP ARTIST</small><strong>ARCDINO GAMING</strong><em>15 min · 7 plays</em></article></div>
    <button className="pexpo-play-replay" onClick={() => songs[0]?.id && music?.setMusic(songs[0].id)}><Play /> Play your Replay <ArrowRight /></button>
    <section className="pexpo-replay-list"><h2>Top songs</h2>{songs.slice(0,5).map((song, i) => <button key={song.id} onClick={() => music?.setMusic(song.id)}><b>{i+1}</b><img src={song.image?.[2]?.url} alt="" /><span><strong>{cleanMusicText(song.name)}</strong><small>{cleanMusicText(song.artists?.primary?.[0]?.name || "Unknown artist")} · {15-i*3} min</small></span><em>{7-i}</em></button>)}</section>
  </main>;
}
