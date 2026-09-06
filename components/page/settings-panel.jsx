"use client";

import { useEffect, useState } from "react";
import { Check, Palette, Settings2, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const accents = [
  { name: "Mono", value: "240 5.9% 10%" },
  { name: "Ocean", value: "199 89% 48%" },
  { name: "Violet", value: "262 83% 58%" },
  { name: "Rose", value: "346 77% 50%" },
  { name: "Emerald", value: "160 84% 39%" },
];
const STORAGE = "aspect-music-ui-settings";

export default function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState("Mono");
  const [compact, setCompact] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [glass, setGlass] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "{}");
      if (saved.accent) setAccent(saved.accent);
      if (typeof saved.compact === "boolean") setCompact(saved.compact);
      if (typeof saved.animations === "boolean") setAnimations(saved.animations);
      if (typeof saved.glass === "boolean") setGlass(saved.glass);
    } catch {}
  }, []);

  useEffect(() => {
    const selected = accents.find((item) => item.name === accent) || accents[0];
    document.documentElement.style.setProperty("--primary", selected.value);
    document.documentElement.style.setProperty("--ring", selected.value);
    document.documentElement.classList.toggle("ui-compact", compact);
    document.documentElement.classList.toggle("ui-no-motion", !animations);
    document.documentElement.classList.toggle("ui-flat", !glass);
    localStorage.setItem(STORAGE, JSON.stringify({ accent, compact, animations, glass }));
  }, [accent, compact, animations, glass]);

  const reset = () => {
    setAccent("Mono");
    setCompact(false);
    setAnimations(true);
    setGlass(true);
    setTheme("system");
  };

  const Toggle = ({ value, onChange, label, description }) => (
    <button type="button" onClick={() => onChange(!value)} className="settings-row">
      <span className="settings-icon"><Sparkles className="h-4 w-4" /></span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">{description}</span>
      </span>
      <span className={`settings-switch ${value ? "is-on" : ""}`} aria-hidden="true"><span /></span>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="liquid-icon" aria-label="Open settings">
          <Settings2 className="h-[18px] w-[18px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="settings-dialog">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="settings-title-icon"><Sparkles className="h-5 w-5" /></div>
            <div>
              <DialogTitle className="text-xl">Appearance</DialogTitle>
              <DialogDescription>Personalize your Aspect Music experience.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <section className="settings-section">
          <div className="settings-label"><Palette className="h-4 w-4" /> Accent</div>
          <div className="grid grid-cols-5 gap-2">
            {accents.map((item) => (
              <button key={item.name} type="button" onClick={() => setAccent(item.name)} className={`accent-choice ${accent === item.name ? "selected" : ""}`} title={item.name}>
                <span className="accent-dot" style={{ background: `hsl(${item.value})` }} />
                {accent === item.name && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-label">Theme</div>
          <div className="theme-grid">
            {["system", "light", "dark"].map((item) => (
              <button key={item} type="button" onClick={() => setTheme(item)} className={`theme-choice ${theme === item ? "selected" : ""}`}>
                {item[0].toUpperCase() + item.slice(1)}
                {theme === item && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section space-y-1">
          <Toggle value={glass} onChange={setGlass} label="Liquid glass" description="Use translucent, blurred surfaces." />
          <Toggle value={animations} onChange={setAnimations} label="Motion effects" description="Keep subtle transitions and micro-interactions." />
          <Toggle value={compact} onChange={setCompact} label="Compact layout" description="Fit more content into the viewport." />
        </section>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Button variant="ghost" className="rounded-full" onClick={reset}>Reset</Button>
          <Button className="rounded-full px-5" onClick={() => setOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
