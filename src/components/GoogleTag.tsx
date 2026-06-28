import Script from "next/script";

// Google tag (gtag.js) — Google Ads conversion tracking + remarketing.
// Loaded site-wide via the root layout. afterInteractive = load early, after hydration.
const GTAG_ID = "AW-18281882709";

export function GoogleTag() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GTAG_ID}');`}
      </Script>
    </>
  );
}
