import { INDEXNOW_KEY, SITE_URL } from "./seo";

// Fire-and-forget submission to IndexNow (Bing, Yandex, and increasingly Google
// honor it). Used so a brand-new listing gets crawled within minutes instead of
// waiting days. Never throws into the caller's path.
export async function submitToIndexNow(urls: string[]): Promise<void> {
  const host = new URL(SITE_URL).host;
  const urlList = urls.filter((u) => u.startsWith(SITE_URL));
  if (!urlList.length) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch {
    // Search-engine pinging is best-effort; failure must not affect the user.
  }
}
