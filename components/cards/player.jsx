"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Pause, Play, Repeat, Repeat1, X } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import Link from "next/link";
import { useMusicProvider } from "@/hooks/use-context";

const formatTime = (time = 0) => `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

export default function Player() {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef(null);
  const { music, setMusic, current, setCurrent } = useMusicProvider();

  useEffect(() => {
    if (!music) return;
    let cancelled = false;
    getSongsById(music).then((res) => res.json()).then((json) => {
      const song = json?.data?.[0];
      if (cancelled || !song) return;
      setData(song);
      setAudioURL(song.downloadUrl?.[2]?.url || song.downloadUrl?.[1]?.url || song.downloadUrl?.[0]?.url || "");
    }).catch(() => { if (!cancelled) setData(null); });
    return () => { cancelled = true; };
  }, [music]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !music) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrent(audio.currentTime || 0);
    };
    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      if (current && Number(current) > 0) audio.currentTime = Number(current);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("loadedmetadata", onLoaded); };
  }, [music, current, setCurrent]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !data) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: cleanMusicText(data.name),
      artist: cleanMusicText(data.artists?.primary?.[0]?.name || ""),
      album: cleanMusicText(data.album?.name || "PEXPO"),
    });
  }, [data]);

  const togglePlayPause = async () => {
    if (!audioRef.current || !audioURL) return;
    try {
      if (audioRef.current.paused) await audioRef.current.play();
      else audioRef.current.pause();
    } catch {}
  };

  const seek = ([value]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const close = () => {
    audioRef.current?.pause();
    setMusic(null);
    setCurrent(0);
    setData(null);
    setAudioURL("");
  };

  if (!music) return null;
  const title = cleanMusicText(data?.name || "Loading...");
  const artist = cleanMusicText(data?.artists?.primary?.[0]?.name || "");
  const image = data?.image?.[2]?.url || data?.image?.[1]?.url;
  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  return <section className="pexpo-player" aria-label="Now playing">
    <audio ref={audioRef} src={audioURL || undefined} autoPlay preload="metadata" playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <div className="pexpo-player-progress"><span style={{ width: `${progress}%` }} /></div>
    <div className="pexpo-player-main">
      <Link href={`/${music}`} className="pexpo-player-art" aria-label={`Open ${title}`}>
        {image ? <img src={image} alt="" /> : <span />}
      </Link>
      <div className="pexpo-player-meta">
        <Link href={`/${music}`} className="pexpo-player-title"><span>{title}</span><ExternalLink /></Link>
        <span className="pexpo-player-artist">{artist}</span>
      </div>
      <div className="pexpo-player-seek">
        <Slider value={[currentTime]} max={Math.max(duration, 1)} step={0.1} onValueChange={seek} aria-label="Seek" />
        <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>
      <div className="pexpo-player-actions">
        <button type="button" onClick={() => { if (audioRef.current) audioRef.current.loop = !isLooping; setIsLooping(!isLooping); }} aria-label={isLooping ? "Disable repeat" : "Repeat track"}>{isLooping ? <Repeat1 /> : <Repeat />}</button>
        <button type="button" className="pexpo-player-play" onClick={togglePlayPause} aria-label={playing ? "Pause" : "Play">{playing ? <Pause /> : <Play />}</button>
        <button type="button" onClick={close} aria-label="Close player"><X /></button>
      </div>
    </div>
  </section>;
}
