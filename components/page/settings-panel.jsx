"use client";

import { Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPanel() {
  const router = useRouter();
  return (
    <button type="button" className="pexpo-settings-button" onClick={() => router.push("/settings")} aria-label="Open settings">
      <Settings2 />
    </button>
  );
}
