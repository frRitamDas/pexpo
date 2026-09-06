import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="relative z-10 flex shrink-0 items-center gap-2 rounded-full px-3 py-2 transition-transform hover:-translate-y-0.5">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-black shadow-sm">A</span>
      <span className="text-[15px] font-bold tracking-tight sm:text-base">
        Aspect<span className="text-muted-foreground"> Music</span>
      </span>
    </Link>
  );
}
