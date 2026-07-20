"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useScans } from "@/hooks/useScans";
import { detectIngredients } from "@/lib/ai";
import { ImageUploader } from "@/components/ImageUploader";
import { IngredientEditor } from "@/components/IngredientEditor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { Scan } from "@/types/scan";

type Status = "idle" | "detecting" | "error" | "done";

function defaultScanName(): string {
  return `Fridge scan – ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function ScanPage() {
  const router = useRouter();
  const { addScan } = useScans();

  const [image, setImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [scanName, setScanName] = useState(defaultScanName());
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function runDetection(dataUrl: string) {
    setStatus("detecting");
    setError(null);
    try {
      const detected = await detectIngredients(dataUrl);
      setIngredients(detected);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function handleImageSelected(dataUrl: string) {
    setImage(dataUrl);
    setIngredients([]);
    runDetection(dataUrl);
  }

  function handleClearImage() {
    setImage(null);
    setIngredients([]);
    setStatus("idle");
    setError(null);
  }

  function handleSave() {
    if (!image) return;
    setIsSaving(true);
    const scan: Scan = {
      id: crypto.randomUUID(),
      name: scanName.trim() || defaultScanName(),
      image,
      ingredients,
      createdAt: new Date().toISOString(),
    };
    addScan(scan);
    router.push(`/scans/${scan.id}`);
  }

  const showEditor = image && (status === "done" || status === "error");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">New Scan</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Upload or take a photo of your fridge or cupboard and let AI spot the ingredients.
        </p>
      </div>

      <ImageUploader image={image} onImageSelected={handleImageSelected} onClear={handleClearImage} />

      {status === "detecting" && <LoadingSpinner label="Identifying ingredients…" size="lg" />}

      {status === "error" && (
        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <p>{error ?? "We couldn't analyze that photo."}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => image && runDetection(image)}
              className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => setStatus("done")}
              className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
            >
              Add ingredients manually instead
            </button>
          </div>
        </div>
      )}

      {showEditor && (
        <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="scan-name">
              Scan name
            </label>
            <input
              id="scan-name"
              value={scanName}
              onChange={(e) => setScanName(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-emerald-900/40"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Detected ingredients
            </p>
            <IngredientEditor ingredients={ingredients} onChange={setIngredients} />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save Scan
          </button>
        </div>
      )}
    </div>
  );
}
