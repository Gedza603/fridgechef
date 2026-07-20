interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({ label, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-zinc-500 dark:text-zinc-400">
      <span
        className={`${SIZES[size]} animate-spin rounded-full border-emerald-500 border-t-transparent`}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
