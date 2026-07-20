"use client";

import { useCallback, useRef, useState } from "react";

interface ImageUploaderProps {
  image: string | null;
  onImageSelected: (dataUrl: string) => void;
  onClear: () => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ image, onImageSelected, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return;
      const dataUrl = await readFileAsDataUrl(file);
      onImageSelected(dataUrl);
    },
    [onImageSelected]
  );

  if (image) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element -- user-provided base64 data URL */}
          <img src={image} alt="Selected fridge or cupboard" className="max-h-96 w-full object-cover" />
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Choose a different photo
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragging
          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
          : "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50"
      }`}
    >
      <span className="text-4xl" aria-hidden>
        📷
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Drag and drop a photo here, or choose an option below
        </p>
        <p className="text-xs text-zinc-400">PNG or JPG, up to ~10MB</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
        >
          Upload a photo
        </button>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Take a photo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
