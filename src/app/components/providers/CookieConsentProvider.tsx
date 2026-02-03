"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getConsentFromStorage, saveConsentToStorage, Consent, buildDefaultConsent } from "src/lib/cookieConsent";
import CookieConsentBanner from "src/app/components/molecules/CookieConsentBanner";

type ContextValue = {
  record: { consent: Consent } | null;
  setConsent: (c: Consent, source?: string) => void;
  openSettings: () => void;
  closeSettings: () => void;
  settingsOpen: boolean;
};

const CookieConsentContext = createContext<ContextValue | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [record, setRecord] = useState<{ consent: Consent } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = getConsentFromStorage();
    if (stored) setRecord({ consent: stored.consent });
  }, []);

  const setConsent = (c: Consent, source = "ui") => {
    setRecord({ consent: c });
    saveConsentToStorage(c);
    // send to server for logging (include source and timestamp client-side)
    fetch(`/api/cookie-consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent: c, ts: new Date().toISOString(), source })
    }).catch(() => {});
  };

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  return (
    <CookieConsentContext.Provider value={{ record, setConsent, openSettings, closeSettings, settingsOpen }}>
      {children}
      <CookieConsentBanner />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}

export default CookieConsentProvider;
