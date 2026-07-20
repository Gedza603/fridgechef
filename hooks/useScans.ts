"use client";

import { useCallback, useEffect, useState } from "react";
import type { Scan } from "@/types/scan";
import * as storage from "@/lib/storage";

export function useScans() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setScans(storage.getScans());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Reads from localStorage (an external system) on mount to hydrate state safely.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const addScan = useCallback(
    (scan: Scan) => {
      storage.addScan(scan);
      refresh();
    },
    [refresh]
  );

  const updateScan = useCallback(
    (id: string, updates: Partial<Omit<Scan, "id">>) => {
      storage.updateScan(id, updates);
      refresh();
    },
    [refresh]
  );

  const deleteScan = useCallback(
    (id: string) => {
      storage.deleteScan(id);
      refresh();
    },
    [refresh]
  );

  return { scans, isLoaded, addScan, updateScan, deleteScan, refresh };
}
