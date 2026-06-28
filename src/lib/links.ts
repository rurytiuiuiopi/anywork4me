// Profile links — artists, musicians, producers (and anyone) can point clients
// to their work: Spotify, YouTube, SoundCloud, Instagram, a portfolio site, etc.
//
// normalizeLink is the security boundary: it only ever yields an http(s) URL,
// so a stored/displayed link can never be javascript:, data:, etc.

const PLATFORMS: { test: RegExp; label: string; emoji: string }[] = [
  { test: /spotify\.com/, label: "Spotify", emoji: "🎧" },
  { test: /music\.apple\.com/, label: "Apple Music", emoji: "🍎" },
  { test: /(youtube\.com|youtu\.be)/, label: "YouTube", emoji: "▶️" },
  { test: /soundcloud\.com/, label: "SoundCloud", emoji: "🔊" },
  { test: /audiomack\.com/, label: "Audiomack", emoji: "🎵" },
  { test: /boomplay\.com/, label: "Boomplay", emoji: "🎶" },
  { test: /mixcloud\.com/, label: "Mixcloud", emoji: "🎚️" },
  { test: /bandcamp\.com/, label: "Bandcamp", emoji: "🎸" },
  { test: /(instagram\.com|instagr\.am)/, label: "Instagram", emoji: "📷" },
  { test: /tiktok\.com/, label: "TikTok", emoji: "🎬" },
  { test: /(twitter\.com|x\.com)/, label: "X", emoji: "✖️" },
  { test: /facebook\.com|fb\.com/, label: "Facebook", emoji: "👍" },
  { test: /vimeo\.com/, label: "Vimeo", emoji: "🎥" },
  { test: /(linktr\.ee|linktree)/, label: "Linktree", emoji: "🌳" },
  { test: /wa\.me|whatsapp\.com/, label: "WhatsApp", emoji: "💬" },
  { test: /behance\.net/, label: "Behance", emoji: "🎨" },
  { test: /dribbble\.com/, label: "Dribbble", emoji: "🏀" },
];

/** Trim, add a scheme if missing, and accept only http(s) URLs. Returns null if invalid. */
export function normalizeLink(raw: string): string | null {
  let s = (raw ?? "").trim();
  if (!s) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = `https://${s}`;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (!u.hostname.includes(".")) return null;
  return u.toString();
}

/** A friendly label + icon for a link, detected from its host. */
export function linkMeta(url: string): { label: string; emoji: string; url: string } {
  let host = "";
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* keep host empty */
  }
  for (const p of PLATFORMS) {
    if (p.test.test(host)) return { label: p.label, emoji: p.emoji, url };
  }
  return { label: host || "Link", emoji: "🔗", url };
}

/** Sanitize a raw list of links (from a form/body) into safe, capped http(s) URLs. */
export function cleanLinks(input: unknown, max = 8): string[] {
  if (!Array.isArray(input)) return [];
  const out: string[] = [];
  for (const item of input) {
    if (typeof item !== "string") continue;
    const url = normalizeLink(item);
    if (url && !out.includes(url)) out.push(url);
    if (out.length >= max) break;
  }
  return out;
}
