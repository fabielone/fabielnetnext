"use client";

import { useEffect, useRef } from "react";
import { useCookieConsent } from "src/app/components/providers/CookieConsentProvider";

type Props = {
  id?: string;
  src?: string;
  inline?: string; // inline script content
  category: "analytics" | "marketing" | "necessary";
  attrs?: Record<string, string>;
};

export default function ScriptLoader({ id, src, inline, category, attrs }: Props) {
  const { record } = useCookieConsent();
  const loadedRef = useRef(false);

  useEffect(() => {
    const consent = record?.consent;
    if (loadedRef.current) return;
    if (category === "necessary") {
      // always load
    } else if (!consent) {
      return;
    } else if (category === "analytics" && !consent.analytics) return;
    else if (category === "marketing" && !consent.marketing) return;

    // inject script
    const script = document.createElement("script");
    if (id) script.id = id;
    if (src) script.src = src;
    if (inline) script.text = inline;
    script.async = true;
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
    }
    document.head.appendChild(script);
    loadedRef.current = true;

    return () => {
      try {
        if (script.parentNode) script.parentNode.removeChild(script);
      } catch (e) {}
    };
  }, [record, id, src, inline, category, attrs]);

  return null;
}
