// Capture Play-Store phone screenshots from the local mock-data server.
//   node scripts/shots.cjs <outDir>
const { chromium } = require("playwright");

(async () => {
  const out = process.argv[2] || ".";
  const base = "http://localhost:3100";
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 412, height: 780 }, // ~1.89:1 → under Play's 2:1 cap at dSF 3
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    timezoneId: "Africa/Accra",
    locale: "en-GH",
  });
  const page = await context.newPage();

  const shots = [
    ["01-home", `${base}/`],
    ["02-search", `${base}/search?category=dj`],
    ["03-profile", `${base}/provider/dj-kojo`],
    ["04-available", `${base}/available`],
  ];

  for (const [name, url] of shots) {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800); // let client-side fetch + animations settle
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log("shot", name);
  }

  await browser.close();
})();
