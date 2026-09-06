"use client";

import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import SettingsPanel from "./settings-panel";
import { ChevronLeft, Home, Search as SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 md:px-10 lg:px-16 pointer-events-none">
      <nav className="liquid-nav pointer-events-auto mx-auto flex w-full max-w-6xl items-center gap-2 p-2">
        <Logo />

        <div className="hidden sm:flex items-center gap-1 rounded-full bg-secondary/50 p-1">
          <Button asChild variant="ghost" size="sm" className="rounded-full h-9 px-3">
            <Link href="/"><Home className="mr-1.5 h-4 w-4" />Home</Link>
          </Button>
          {path !== "/" && (
            <Button asChild variant="ghost" size="sm" className="rounded-full h-9 px-3">
              <Link href="/"><ChevronLeft className="mr-1 h-4 w-4" />Back</Link>
            </Button>
          )}
        </div>

        <div className="ml-auto hidden sm:flex w-full max-w-md">
          <Search />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:ml-2">
          <div className="hidden xs:flex sm:hidden" />
          <SettingsPanel />
        </div>
      </nav>

      <div className="mx-auto mt-2 max-w-6xl sm:hidden pointer-events-auto">
        <div className="liquid-search">
          <Search />
        </div>
      </div>
    </header>
  );
}
