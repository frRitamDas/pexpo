"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inpRef = useRef();

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inpRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = query.trim();
    if (!value) {
      router.push("/");
      return;
    }
    router.push("/search/" + encodeURIComponent(value));
    inpRef.current?.blur();
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center relative w-full group">
      <SearchIcon className="absolute left-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
      <Input
        ref={inpRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        type="search"
        className="h-10 rounded-full border-transparent bg-secondary/55 pl-10 pr-16 shadow-none transition-all focus-visible:border-border focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
        name="query"
        placeholder="Search music..."
        aria-label="Search music"
      />
      <kbd className="pointer-events-none absolute right-3 hidden rounded-md border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:block">Ctrl K</kbd>
      <Button variant="ghost" type="submit" size="icon" aria-label="Submit search" className="absolute right-1 h-8 w-8 rounded-full md:hidden">
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
