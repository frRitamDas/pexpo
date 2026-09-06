"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ExternalLink, Play, Repeat, Repeat1, X } from "lucide-react";
import { Slider } from "../ui/slider";
import { getSongsById } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import Link from "next/link";
import { useMusicProvider } from "@/hooks/use-context";
import { Skeleton } from "../ui/skeleton";
import { IoPause } from "react-icons/io5";

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
    const title = cleanMusicText(data.name);
    const artist = cleanMusicText(data.artists?.primary?.[0]?.name || "");
    navigator.mediaSession.metadata = new MediaMetadata({ title, artist, album: cleanMusicText(data.album?.name || "PEXPO") });
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

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 px-3 sm:px-5">
      <audio ref={audioRef} src={audioURL || undefined} autoPlay preload="metadata" playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <div className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[24px] border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl">
        <div className="h-1 bg-secondary"><div className="h-full bg-primary transition-[width]" style={{ width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }} /></div>
        <div className="flex items-center gap-3 p-2.5 sm:p-3">
          {data?.image?.[1]?.url ? <img src={data.image[1].url} alt="" className="h-12 w-12 rounded-[14px] object-cover sm:h-14 sm:w-14" /> : <Skeleton className="h-12 w-12 rounded-[14px]" />}
          <div className="min-w-0 flex-1"><Link href={`/${music}`} className="flex max-w-full items-center gap-1 truncate text-sm font-semibold hover:underline"><span className="truncate">{title}</span><ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /></Link><p className="mt-0.5 truncate text-xs text-muted-foreground">{artist}</p></div>
          <div className="hidden min-w-[180px] flex-1 items-center gap-2 md:flex"><Slider value={[currentTime]} max={Math.max(duration, 1)} step={0.1} onValueChange={seek} /><span className="text-[10px] tabular-nums text-muted-foreground">{formatTime(duration)}</span></div>
          <div className="flex items-center gap-0.5"><Button size="icon" variant={isLooping ? "secondary" : "ghost"} onClick={() => { if (audioRef.current) audioRef.current.loop = !isLooping; setIsLooping(!isLooping); }} aria-label="Repeat">{isLooping ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}</Button><Button size="icon" onClick={togglePlayPause} aria-label={playing ? "Pause" : "Play"}>{playing ? <IoPause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button><Button size="icon" variant="ghost" onClick={close} aria-label="Close player"><X className="h-4 w-4" /></Button></div>
        </div>
        <div className="px-3 pb-2 md:hidden"><div className="mb-1 flex justify-between text-[10px] tabular-nums text-muted-foreground"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div><Slider value={[currentTime]} max={Math.max(duration, 1)} step={0.1} onValueChange={seek} /></div>
      </div>
    </div>
  );
}
