import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          <span className="text-2xl" aria-hidden>
            🧊
          </span>
          FridgeChef
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/scan"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500 active:bg-emerald-700"
          >
            Scan Fridge
          </Link>
        </nav>
      </div>
    </header>
  );
}
