"use client";

import { Button } from "@/components/ui/button";
import { getSongsById } from "@/lib/fetch";
import { cleanMusicText } from "@/lib/text";
import { Download, Play, Repeat, Repeat1, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import Link from "next/link";
import { useMusicProvider, useNextMusicProvider } from "@/hooks/use-context";
import Next from "@/components/cards/next";
import { IoPause } from "react-icons/io5";

const imageAt = (song) => song?.image?.[2]?.url || song?.image?.[1]?.url || song?.image?.[0]?.url || "";
const audioAt = (song) => song?.downloadUrl?.[2]?.url || song?.downloadUrl?.[1]?.url || song?.downloadUrl?.[0]?.url || "";
const formatTime = (time = 0) => `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

export default function Player({ id }) {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const audioRef = useRef(null);
  const next = useNextMusicProvider();
  const { current, setCurrent, setDownloadProgress, downloadProgress } = useMusicProvider();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await getSongsById(id);
        const json = await response.json();
        const song = json?.data?.[0] || null;
        if (cancelled) return;
        setData(song);
        setAudioURL(audioAt(song));
        setCurrentTime(0);
        setDuration(0);
        setPlaying(false);
        localStorage.setItem("last-played", id);
        localStorage.removeItem("p");
      } catch {
        if (!cancelled) toast.error("Unable to load this song");
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrent(audio.currentTime || 0);
    };
    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      if (current && Number(current) > 0) audio.currentTime = Number(current);
    };
    const onEnded = () => {
      if (!audio.loop && next?.nextData?.id) window.location.href = `/${next.nextData.id}`;
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [current, next?.nextData?.id, setCurrent]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !audioURL) return;
    try {
      if (audio.paused) { await audio.play(); localStorage.setItem("p", "true"); }
      else { audio.pause(); localStorage.setItem("p", "false"); }
    } catch { toast.error("Playback could not start"); }
  };

  const handleSeek = ([value]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const loopSong = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = !audioRef.current.loop;
    setIsLooping(audioRef.current.loop);
  };

  const handleShare = async () => {
    if (!data?.id) return;
    const url = `${window.location.origin}/${data.id}`;
    try {
      if (navigator.share) await navigator.share({ title: cleanMusicText(data.name), url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    } catch (error) {
      if (error?.name !== "AbortError") toast.error("Unable to share");
    }
  };

  const downloadSong = async () => {
    if (!audioURL || isDownloading) return;
    try {
      setIsDownloading(true); setDownloadProgress(0);
      const response = await fetch(audioURL);
      if (!response.ok || !response.body) throw new Error("Download failed");
      const total = Number(response.headers.get("Content-Length") || 0);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) { chunks.push(value); loaded += value.length; if (total) setDownloadProgress(Math.round((loaded / total) * 100)); }
      }
      const blobUrl = URL.createObjectURL(new Blob(chunks));
      const link = document.createElement("a");
      link.href = blobUrl; link.download = `${cleanMusicText(data?.name || "pexpo-song")}.mp3`; link.click();
      URL.revokeObjectURL(blobUrl);
      toast.success("Download started");
    } catch { toast.error("Download failed"); }
    finally { setIsDownloading(false); setDownloadProgress(0); }
  };

  const title = cleanMusicText(data?.name || "");
  const artist = cleanMusicText(data?.artists?.primary?.[0]?.name || "Unknown artist");
  const artwork = imageAt(data);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 pb-2 pt-9 sm:px-6 lg:px-10">
      <audio ref={audioRef} src={audioURL || undefined} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <div className="rounded-[30px] border border-border/70 bg-secondary/20 p-4 sm:p-6 lg:p-7">
        <div className="grid gap-7 md:grid-cols-[240px_1fr] md:items-center">
          <div className="mx-auto w-full max-w-[240px] md:mx-0">
            {artwork ? <img src={artwork} alt={title || "Song artwork"} className="aspect-square w-full rounded-[22px] object-cover shadow-xl" /> : <Skeleton className="aspect-square w-full rounded-[22px]" />}
          </div>
          <div className="min-w-0">
            {data ? <><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Now playing</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl" title={title}>{title}</h1><Link href={`/search/${encodeURIComponent(artist)}`} className="mt-2 inline-block text-sm text-muted-foreground transition hover:text-foreground">{artist}</Link></> : <><Skeleton className="h-3 w-20" /><Skeleton className="mt-3 h-9 w-3/4" /><Skeleton className="mt-2 h-4 w-32" /></>}
            <div className="mt-8">
              <Slider value={[currentTime]} max={Math.max(duration, 1)} step={0.1} onValueChange={handleSeek} disabled={!data} className="cursor-pointer" />
              <div className="mt-2 flex justify-between text-[11px] tabular-nums text-muted-foreground"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <Button onClick={togglePlayPause} disabled={!data || !audioURL} className="h-10 rounded-full px-5 gap-2">{playing ? <IoPause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? "Pause" : "Play"}</Button>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant={isLooping ? "secondary" : "ghost"} onClick={loopSong} aria-label="Repeat"><>{isLooping ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}</></Button>
                  <Button size="icon" variant={isDownloading ? "secondary" : "ghost"} onClick={downloadSong} disabled={!data || isDownloading} aria-label="Download">{isDownloading ? <span className="text-[10px] font-semibold">{downloadProgress}%</span> : <Download className="h-4 w-4" />}</Button>
                  <Button size="icon" variant="ghost" onClick={handleShare} disabled={!data} aria-label="Share"><Share2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {next?.nextData && <div className="mt-4"><Next name={cleanMusicText(next.nextData.name)} artist={cleanMusicText(next.nextData.artist)} image={next.nextData.image} id={next.nextData.id} /></div>}
    </section>
  );
}
