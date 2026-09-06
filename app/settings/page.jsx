"use client";

import { ArrowLeft, BarChart3, Check, Download, Expand, Globe2, Headphones, Music2, Palette, Puzzle, Sparkles, UserRound, Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const KEY = "pexpo-reference-settings";
const defaults = { atmos: true, animated: true, cellular: true, fullCover: true, glass: false, mesh: false, synced: true, blurLyrics: true, wifi: true };

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(defaults);
  useEffect(() => { try { setSettings({ ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }); } catch {} }, []);
  const toggle = (key) => setSettings((s) => { const next = { ...s, [key]: !s[key] }; localStorage.setItem(KEY, JSON.stringify(next)); return next; });
  const Row = ({ icon: Icon, title, desc, value, onClick }) => <button type="button" className="pexpo-settings-row" onClick={onClick}><span className="pexpo-settings-icon"><Icon /></span><span className="pexpo-settings-copy"><strong>{title}</strong>{desc && <small>{desc}</small>}</span>{typeof value === "boolean" ? <span className={`pexpo-switch ${value ? "is-on" : ""}`}><i /></span> : <span className="pexpo-settings-chevron">›</span>}</button>;
  return <main className="pexpo-settings-screen">
    <header className="pexpo-settings-head"><button type="button" onClick={() => router.back()} aria-label="Back"><ArrowLeft /></button><strong>Settings</strong><span /></header>
    <h1>Settings</h1>
    <Row icon={UserRound} title="Account & integrations" desc="@ardcinogaming" />
    <section><label>AUDIO QUALITY</label><div className="pexpo-settings-group"><Row icon={Puzzle} title="Sources" desc="Where audio comes from and the order used" /><Row icon={Wifi} title="On Wi-Fi" value="High" /><Row icon={BarChart3} title="On mobile data" value="High" /><Row icon={Music2} title="Dolby Atmos" desc="Play the more immersive, surround version of a song when there is one." value={settings.atmos} onClick={() => toggle("atmos")} /></div></section>
    <section><label>DOWNLOADS</label><div className="pexpo-settings-group"><Row icon={Download} title="Download quality" desc="~35 MB per track, whatever the connection" value="Lossless" /><Row icon={WifiOff} title="Download over Wi-Fi only" value={settings.wifi} onClick={() => toggle("wifi")} /></div></section>
    <section><label>PLAYBACK & APPEARANCE</label><div className="pexpo-settings-group"><Row icon={Sparkles} title="Liquid Glass" desc="Use the premium translucent floating surfaces." value={settings.glass} onClick={() => toggle("glass")} /><Row icon={Expand} title="Full-screen cover art" desc="Runs the cover to the edges of the player instead of a square sleeve" value={settings.fullCover} onClick={() => toggle("fullCover")} /><Row icon={Palette} title="Legacy mesh gradient" desc="Brings back the drifting colour blobs behind the player." value={settings.mesh} onClick={() => toggle("mesh")} /><Row icon={Music2} title="Animated cover art" desc="Plays looping motion where releases support it." value={settings.animated} onClick={() => toggle("animated")} /><Row icon={Music2} title="Play animated cover over cellular" value={settings.cellular} onClick={() => toggle("cellular")} /><Row icon={Headphones} title="Synced lyrics" desc="Lights up the words on the player as they're sung" value={settings.synced} onClick={() => toggle("synced")} /><Row icon={Sparkles} title="Blur unfocused lyrics" desc="Keeps the spotlight on the current line" value={settings.blurLyrics} onClick={() => toggle("blurLyrics")} /><Row icon={Globe2} title="Lyrics sources" desc="LyricsPlus, PaxSenix, BetterLyrics, SimpMusic, KuGou, LRCLIB, Musixmatch, Genius" /></div></section>
  </main>;
}
