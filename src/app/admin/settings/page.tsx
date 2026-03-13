"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const s = await getSiteSettings();
      setSettings(s);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const { id, updatedAt, ...rest } = settings;
      await updateSiteSettings(id, rest as any);
      setMessage("Settings saved.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-driftwood">Loading settings…</p>;
  }

  if (!settings) {
    return (
      <p className="text-driftwood">
        No site settings document found. Create one in Firestore under the <code>siteSettings</code> collection.
      </p>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl text-deep-ocean mb-1">Site settings</h1>
        <p className="text-sm text-driftwood">
          Control high-level branding and contact details used across the site.
        </p>
      </div>

      {message && <p className="text-xs text-sea-glass">{message}</p>}

      <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
        <h2 className="font-display text-xl text-deep-ocean">Brand</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              Brand name
            </label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              About text
            </label>
            <textarea
              value={settings.aboutText}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm min-h-[100px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
        <h2 className="font-display text-xl text-deep-ocean">Contact</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              Contact email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              Contact phone
            </label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-warm p-5 space-y-4">
        <h2 className="font-display text-xl text-deep-ocean">Social</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={settings.socialLinks.instagram ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-driftwood mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={settings.socialLinks.facebook ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded-lg bg-sea-glass text-white text-sm font-semibold shadow-warm hover:bg-sea-glass/90 disabled:opacity-70"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

