'use client'; // Mark this component as a Client Component

import Script from 'next/script';

const ChatwootScript = () => {
  return (
    <>
      {/* Set Chatwoot settings globally */}
      <Script id="chatwoot-settings" strategy="beforeInteractive">
        {`
          window.chatwootSettings = {
            position: "right",
            type: "expanded_bubble",
            launcherTitle: "Chat with us"
          };
        `}
      </Script>

      {/* Load Chatwoot SDK */}
      <Script
        id="chatwoot-sdk"
        strategy="lazyOnload" // Load after the page becomes interactive
        src="https://app.chatwoot.com/packs/js/sdk.js"
        onLoad={() => {
          window.chatwootSDK.run({
            websiteToken: 'wVPtYLy3b9Bn3f3AAvAPrVB5',
            baseUrl: 'https://app.chatwoot.com',
          });
        }}
      />
    </>
  );
};

export default ChatwootScript;
