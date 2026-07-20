import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      icon="🧭"
      message="Page not found."
      action={
        <Link
          href="/"
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
        >
          Back to Home
        </Link>
      }
    />
  );
}
