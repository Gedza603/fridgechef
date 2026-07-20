import Link from "next/link";
import type { Scan } from "@/types/scan";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ScanCard({ scan }: { scan: Scan }) {
  return (
    <Link
      href={`/scans/${scan.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element -- user-provided base64 data URL */}
        <img
          src={scan.image}
          alt={scan.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">{scan.name}</h3>
        <p className="text-xs text-zinc-400">{formatDate(scan.createdAt)}</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {scan.ingredients.length} ingredient{scan.ingredients.length === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
