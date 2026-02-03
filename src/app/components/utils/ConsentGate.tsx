"use client";

import React from "react";
import { useCookieConsent } from "src/app/components/providers/CookieConsentProvider";

export default function ConsentGate({ category, children }: { category: "analytics" | "marketing"; children: React.ReactNode }) {
  const { record } = useCookieConsent();
  if (!record) return null;
  const consent = record.consent;
  if (category === "analytics" && consent.analytics) return <>{children}</>;
  if (category === "marketing" && consent.marketing) return <>{children}</>;
  return null;
}
