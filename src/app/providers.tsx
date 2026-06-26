"use client";

import { LocationProvider } from "@/lib/location/LocationProvider";
import { FavoritesProvider } from "@/lib/favorites/FavoritesProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </LocationProvider>
  );
}
