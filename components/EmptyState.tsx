import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon = "🍽️", message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-14 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
      <span className="text-4xl" aria-hidden>
        {icon}
      </span>
      <p className="max-w-sm text-balance text-sm font-medium text-zinc-500 dark:text-zinc-400">{message}</p>
      {action}
    </div>
  );
}
