import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-24 md:py-36">
      <p className="text-small font-[600] text-ink-2">404</p>
      <h1 className="mt-3 text-h2 text-stretch-display">That page isn’t here.</h1>
      <p className="mt-5 max-w-[34rem] text-lead text-ink-2">The link may be old, or mistyped. Try one of these:</p>
      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <li><Link className="tlink chev" href="/">The use-case library</Link></li>
        <li><Link className="tlink chev" href="/packs/solopreneur">Free starter pack</Link></li>
        <li><Link className="tlink chev" href="/companies">For companies</Link></li>
        <li><Link className="tlink chev" href="/library">Use-case library</Link></li>
      </ul>
    </section>
  );
}
