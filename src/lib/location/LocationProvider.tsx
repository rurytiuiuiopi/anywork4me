"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { GeoPoint, UserContext } from "../types";
import {
  cityFromTimezone,
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountry,
  TIMEZONE_COUNTRY,
  type CountryInfo,
} from "./countries";

export interface ResolvedLocation {
  ready: boolean;
  source: "auto" | "manual" | "gps";
  point: GeoPoint;
  city: string;
  country: string; // ISO2
  countryName: string;
  flag: string;
  currency: string;
  locale: string;
  label: string; // "Accra, Ghana"
}

interface LocationContextValue {
  location: ResolvedLocation;
  countries: CountryInfo[];
  /** Manually switch country (persisted). */
  setCountry: (code: string) => void;
  /** Ask the browser for precise coordinates (optional, never auto-prompted). */
  usePreciseLocation: () => void;
  /** The shape sent to the API for localization + ranking. */
  ctx: UserContext;
}

const STORAGE_KEY = "fm.location";
const LocationContext = createContext<LocationContextValue | null>(null);

function build(
  country: CountryInfo,
  source: ResolvedLocation["source"],
  overrides?: Partial<ResolvedLocation>,
): ResolvedLocation {
  return {
    ready: true,
    source,
    point: country.point,
    city: country.capital,
    country: country.code,
    countryName: country.name,
    flag: country.flag,
    currency: country.currency,
    locale: country.locale,
    label: `${country.capital}, ${country.name}`,
    ...overrides,
  };
}

/** Infer place fully offline from the browser's timezone + language. */
function detect(): ResolvedLocation {
  if (typeof Intl === "undefined") return build(DEFAULT_COUNTRY, "auto");

  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    /* noop */
  }

  const code =
    TIMEZONE_COUNTRY[tz] ??
    (typeof navigator !== "undefined"
      ? navigator.language?.split("-")[1]?.toUpperCase()
      : undefined);

  const country = getCountry(code) ?? DEFAULT_COUNTRY;
  const city = tz ? cityFromTimezone(tz) : country.capital;
  const locale =
    (typeof navigator !== "undefined" && navigator.language) || country.locale;

  return build(country, "auto", {
    city,
    locale,
    label: `${city}, ${country.name}`,
  });
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  // Stable first render (SSR-safe): default, then refine on mount.
  const [location, setLocation] = useState<ResolvedLocation>(() =>
    build(DEFAULT_COUNTRY, "auto"),
  );

  useEffect(() => {
    const saved =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;
    if (saved) {
      const c = getCountry(saved);
      if (c) {
        setLocation(build(c, "manual"));
        return;
      }
    }
    setLocation(detect());
  }, []);

  const setCountry = useCallback((code: string) => {
    const c = getCountry(code);
    if (!c) return;
    try {
      localStorage.setItem(STORAGE_KEY, c.code);
    } catch {
      /* noop */
    }
    setLocation(build(c, "manual"));
  }, []);

  const usePreciseLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation((prev) => ({
          ...prev,
          source: "gps",
          point: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }));
      },
      () => {
        /* user declined — silently keep inferred location */
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  }, []);

  const ctx: UserContext = useMemo(
    () => ({
      point: location.point,
      city: location.city,
      country: location.country,
      currency: location.currency,
      locale: location.locale,
    }),
    [location],
  );

  const value = useMemo<LocationContextValue>(
    () => ({ location, countries: COUNTRIES, setCountry, usePreciseLocation, ctx }),
    [location, setCountry, usePreciseLocation, ctx],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const v = useContext(LocationContext);
  if (!v) throw new Error("useLocation must be used within <LocationProvider>");
  return v;
}
