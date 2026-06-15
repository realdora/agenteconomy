"use client";

import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const cookieDomain = ".agenteconomy.to";

export function GoogleAnalytics() {
  if (!gaId) {
    return null;
  }

  const encodedGaId = encodeURIComponent(gaId);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodedGaId}`} strategy="afterInteractive" />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)}, { cookie_domain: ${JSON.stringify(cookieDomain)} });
`,
        }}
      />
    </>
  );
}
