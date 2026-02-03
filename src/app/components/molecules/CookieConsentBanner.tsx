"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "src/app/components/providers/CookieConsentProvider";
import { buildDefaultConsent } from "src/lib/cookieConsent";

// Accessible sticky bottom bar with settings dialog
export default function CookieConsentBanner() {
  const { record, setConsent, openSettings, closeSettings, settingsOpen } = useCookieConsent();
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!record) setVisible(true);
    else setVisible(false);
  }, [record]);

  useEffect(() => {
    // trap focus when settings open
    if (settingsOpen && dialogRef.current) {
      const nodes = dialogRef.current.querySelectorAll<HTMLElement>("button,input,a,select,textarea");
      if (nodes.length) nodes[0].focus();
    }
  }, [settingsOpen]);

  if (!visible && !settingsOpen) return (
    <CookieSettingsIcon onOpen={() => openSettings()} />
  );

  const defaultConsent = buildDefaultConsent();

  const acceptAll = () => setConsent({ ...defaultConsent, analytics: true, marketing: true }, "accept_all");
  const necessaryOnly = () => setConsent(defaultConsent, "necessary_only");

  return (
    <div className="fixed inset-x-4 md:inset-x-8 bottom-6 z-50">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between" role="region" aria-label="Cookie consent">
            <div className="text-sm text-gray-800 mb-3 md:mb-0 md:mr-4">
            We use cookies to make the dashboard work and to improve it. <a className="underline" href={typeof window !== 'undefined' ? '/' + window.location.pathname.split('/')[1] + '/cookie-policy' : '/cookie-policy'}>Cookie Policy</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={necessaryOnly} className="px-3 py-2 rounded border focus:outline-none focus:ring" aria-label="Reject non-essential cookies">Reject Non-Essential</button>
            <button onClick={acceptAll} className="px-3 py-2 rounded bg-blue-600 text-white focus:outline-none focus:ring" aria-label="Accept all cookies">Accept All</button>
            <button onClick={openSettings} className="px-3 py-2 rounded border focus:outline-none focus:ring" aria-haspopup="dialog" aria-expanded={settingsOpen}>Manage Settings</button>
          </div>
        </div>

        {settingsOpen && (
          <div ref={dialogRef} className="mt-3 bg-white rounded shadow p-4" role="dialog" aria-modal="true" aria-label="Cookie settings">
            <h3 className="text-lg font-semibold">Cookie Settings</h3>
            <p className="text-sm text-gray-600">Choose which cookies you allow. You can change this anytime.</p>
            <SettingsForm current={record?.consent || defaultConsent} onSave={(c) => { setConsent(c, "save_preferences"); closeSettings(); }} onCancel={closeSettings} />
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsForm({ current, onSave, onCancel }: { current: any; onSave: (c: any) => void; onCancel: () => void }) {
  const [analytics, setAnalytics] = useState(!!current.analytics);
  const [marketing, setMarketing] = useState(!!current.marketing);

  return (
    <form className="mt-4" onSubmit={(e) => { e.preventDefault(); onSave({ necessary: true, analytics, marketing }); }}>
      <fieldset>
        <legend className="sr-only">Cookie categories</legend>
        <div className="flex items-start justify-between py-2">
          <div>
            <div className="font-medium">Necessary</div>
            <div className="text-sm text-gray-600">Required for the dashboard to work.</div>
          </div>
          <div className="text-sm text-gray-600">Always on</div>
        </div>

        <div className="flex items-start justify-between py-2">
          <div>
            <div className="font-medium">Analytics</div>
            <div className="text-sm text-gray-600">Helps us improve dashboard speed and features.</div>
          </div>
          <label className="inline-flex items-center">
            <input aria-label="Enable analytics cookies" type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
          </label>
        </div>

        <div className="flex items-start justify-between py-2">
          <div>
            <div className="font-medium">Marketing</div>
            <div className="text-sm text-gray-600">Personalized help and offers.</div>
          </div>
          <label className="inline-flex items-center">
            <input aria-label="Enable marketing cookies" type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          </label>
        </div>
      </fieldset>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded border">Cancel</button>
        <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">Save Preferences</button>
      </div>
    </form>
  );
}

function CookieSettingsIcon({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} aria-label="Cookie settings" title="Cookie settings" className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-white border shadow flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 12h.01M12 8h.01M16 14h.01" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
