import { ReactNode } from "react";

export default function CookiePolicyPage() {
  return (
    <main className="prose mx-auto py-12 px-4">
      <h1>Cookie Policy</h1>
      <p>This site uses cookies to provide essential functionality and to improve your experience.</p>
      <h2>Types of cookies</h2>
      <ul>
        <li><strong>Functional:</strong> Required for site functionality (always enabled).</li>
        <li><strong>Analytics:</strong> Help us understand usage. Loaded only with consent.</li>
        <li><strong>Marketing:</strong> Third‑party ads and chat widgets. Loaded only with consent.</li>
      </ul>
      <h2>Managing your choices</h2>
      <p>You can change or withdraw your consent at any time using the cookie settings available on the site.</p>
    </main>
  );
}
