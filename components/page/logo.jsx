import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="pexpo-logo" aria-label="PEXPO home">
      <span className="pexpo-logo-mark" aria-hidden="true">P</span>
      <span className="pexpo-logo-type">PEXPO</span>
    </Link>
  );
}
