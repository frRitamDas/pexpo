import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="pexpo-logo" aria-label="PEXPO home">
      <svg className="pexpo-logo-svg" viewBox="0 0 64 48" aria-hidden="true">
        <path d="M8 10 C18 18 38 18 56 10" />
        <path d="M6 22 C18 30 40 30 58 22" />
        <path d="M4 34 C18 42 42 42 60 34" />
      </svg>
    </Link>
  );
}
