// Capture App Store phone screenshots (6.7" iPhone = 1290x2796) from local mock.
//   node scripts/shots-ios.cjs <outDir>
const { chromium } = require("playwright");

(async () => {
  const out = process.argv[2] || ".";
  const base = "http://localhost:3100";
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }, // iPhone 15 Pro Max points
    deviceScaleFactor: 3, // → 1290 x 2796 px (App Store 6.7")
    isMobile: true,
    hasTouch: true,
    timezoneId: "Africa/Accra",
    locale: "en-GH",
  });
  const page = await context.newPage();

  const shots = [
    ["ios-01-home", `${base}/`],
    ["ios-02-search", `${base}/search?category=dj`],
    ["ios-03-profile", `${base}/provider/dj-kojo`],
    ["ios-04-available", `${base}/available`],
  ];

  for (const [name, url] of shots) {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log("shot", name);
  }

  await browser.close();
})();
