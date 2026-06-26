"use client";

import { useFavorites } from "@/lib/favorites/FavoritesProvider";

export function SaveButton({
  id,
  variant = "icon",
}: {
  id: string;
  variant?: "icon" | "full";
}) {
  const { has, toggle } = useFavorites();
  const saved = has(id);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(id)}
        aria-pressed={saved}
        className={`flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition active:scale-[0.98] ${
          saved
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-background hover:bg-surface"
        }`}
      >
        <Heart filled={saved} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-label={saved ? "Remove from saved" : "Save"}
      aria-pressed={saved}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition active:scale-90 hover:bg-background"
    >
      <Heart filled={saved} />
    </button>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7.5-4.6-10-9.2C.7 9 1.6 5.5 4.7 4.6 6.8 4 8.8 5 12 8c3.2-3 5.2-4 7.3-3.4 3.1.9 4 4.4 2.7 7.2C19.5 16.4 12 21 12 21z"
      />
    </svg>
  );
}
