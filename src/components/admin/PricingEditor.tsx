"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import type { Pricing, SeasonalRate } from "@/types";

interface PricingEditorProps {
  value: Pricing;
  onChange: (pricing: Pricing) => void;
}

function toDateInput(t: Timestamp | undefined): string {
  if (!t) return "";
  const d = t.toDate?.() ?? t;
  return typeof d === "object" && d instanceof Date
    ? d.toISOString().slice(0, 10)
    : "";
}

export default function PricingEditor({ value, onChange }: PricingEditorProps) {
  const [showAddSeasonal, setShowAddSeasonal] = useState(false);
  const [seasonName, setSeasonName] = useState("");
  const [seasonStart, setSeasonStart] = useState("");
  const [seasonEnd, setSeasonEnd] = useState("");
  const [seasonRate, setSeasonRate] = useState("");

  function handleFieldChange<K extends keyof Pricing>(key: K, next: Pricing[K]) {
    onChange({ ...value, [key]: next });
  }

  function addSeasonalRate() {
    if (!seasonName.trim() || !seasonStart || !seasonEnd || !seasonRate) return;
    const start = new Date(seasonStart);
    const end = new Date(seasonEnd);
    const rate = Number(seasonRate) || 0;
    const newRate: SeasonalRate = {
      name: seasonName.trim(),
      startDate: Timestamp.fromDate(start),
      endDate: Timestamp.fromDate(end),
      rate,
    };
    onChange({
      ...value,
      seasonalRates: [...(value.seasonalRates || []), newRate],
    });
    setSeasonName("");
    setSeasonStart("");
    setSeasonEnd("");
    setSeasonRate("");
    setShowAddSeasonal(false);
  }

  function removeSeasonalRate(index: number) {
    const next = [...(value.seasonalRates || [])];
    next.splice(index, 1);
    onChange({ ...value, seasonalRates: next });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-deep-ocean">Pricing</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Base nightly rate ($)
          </label>
          <input
            type="number"
            min={0}
            value={value.baseRate}
            onChange={(e) => handleFieldChange("baseRate", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Cleaning fee ($)
          </label>
          <input
            type="number"
            min={0}
            value={value.cleaningFee}
            onChange={(e) => handleFieldChange("cleaningFee", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Tax rate (%)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={value.taxRate}
            onChange={(e) => handleFieldChange("taxRate", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Minimum nights
          </label>
          <input
            type="number"
            min={1}
            value={value.minNights}
            onChange={(e) => handleFieldChange("minNights", Number(e.target.value || 1))}
            className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-deep-ocean">Seasonal rate overrides</span>
          <button
            type="button"
            onClick={() => setShowAddSeasonal((v) => !v)}
            className="text-sm text-sea-glass hover:underline"
          >
            {showAddSeasonal ? "Cancel" : "Add Seasonal Rate"}
          </button>
        </div>
        {(value.seasonalRates?.length ?? 0) > 0 && (
          <div className="overflow-x-auto border border-driftwood/20 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-shell/60 text-left text-xs text-driftwood">
                <tr>
                  <th className="px-3 py-2">Season Name</th>
                  <th className="px-3 py-2">Start Date</th>
                  <th className="px-3 py-2">End Date</th>
                  <th className="px-3 py-2">Nightly Rate</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-driftwood/10">
                {value.seasonalRates?.map((sr, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{sr.name}</td>
                    <td className="px-3 py-2">{toDateInput(sr.startDate)}</td>
                    <td className="px-3 py-2">{toDateInput(sr.endDate)}</td>
                    <td className="px-3 py-2">${sr.rate}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeSeasonalRate(i)}
                        className="text-coral hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showAddSeasonal && (
          <div className="mt-3 p-3 border border-driftwood/20 rounded-lg space-y-2 bg-sand/30">
            <input
              type="text"
              placeholder="Season name (e.g. Summer Peak)"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                placeholder="Start"
                value={seasonStart}
                onChange={(e) => setSeasonStart(e.target.value)}
                className="px-3 py-2 border border-driftwood/30 rounded-lg text-sm"
              />
              <input
                type="date"
                placeholder="End"
                value={seasonEnd}
                onChange={(e) => setSeasonEnd(e.target.value)}
                className="px-3 py-2 border border-driftwood/30 rounded-lg text-sm"
              />
            </div>
            <input
              type="number"
              min={0}
              placeholder="Nightly rate ($)"
              value={seasonRate}
              onChange={(e) => setSeasonRate(e.target.value)}
              className="w-full px-3 py-2 border border-driftwood/30 rounded-lg text-sm"
            />
            <p className="text-xs text-driftwood">
              Examples: Summer Peak Jun 1–Aug 31, Holiday Dec 15–Jan 5, Spring Break Mar 1–Apr 15
            </p>
            <button
              type="button"
              onClick={addSeasonalRate}
              className="px-3 py-1.5 rounded-lg bg-sea-glass text-white text-sm font-semibold"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

