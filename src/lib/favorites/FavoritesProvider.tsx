"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface FavoritesContextValue {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const STORAGE_KEY = "fm.favorites";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  }, []);

  const toggle = useCallback(
    (id: string) => {
      persist(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]);
    },
    [ids, persist],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      has: (id: string) => ids.includes(id),
      toggle,
      count: ids.length,
    }),
    [ids, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const v = useContext(FavoritesContext);
  if (!v) throw new Error("useFavorites must be used within <FavoritesProvider>");
  return v;
}
