'use client'
import Script from 'next/script';

const ChatwootScript = () => {
  return (
    <Script
      id="chatwoot-sdk"
      strategy="lazyOnload" // Load the script after the page becomes interactive
      src="https://app.chatwoot.com/packs/js/sdk.js"
      onLoad={() => {
        window.chatwootSDK.run({
          websiteToken: 'wVPtYLy3b9Bn3f3AAvAPrVB5',
          baseUrl: 'https://app.chatwoot.com',
        });
      }}
    />
  );
};

export default ChatwootScript;