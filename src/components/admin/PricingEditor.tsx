"use client";

import type { Pricing } from "@/types";

interface PricingEditorProps {
  value: Pricing;
  onChange: (pricing: Pricing) => void;
}

export default function PricingEditor({ value, onChange }: PricingEditorProps) {
  function handleFieldChange<K extends keyof Pricing>(key: K, next: Pricing[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-deep-ocean">Pricing</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Base nightly rate (USD)
          </label>
          <input
            type="number"
            value={value.baseRate}
            onChange={(e) => handleFieldChange("baseRate", Number(e.target.value || 0))}
            className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-driftwood mb-1">
            Cleaning fee (USD)
          </label>
          <input
            type="number"
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
            value={value.minNights}
            onChange={(e) => handleFieldChange("minNights", Number(e.target.value || 1))}
            className="w-full px-3 py-2 border border-driftwood/30 rounded-lg bg-sand/40 text-sm"
          />
        </div>
      </div>
      <p className="text-xs text-driftwood">
        Seasonal overrides can be managed later. For now, base your pricing on typical nightly rates
        and adjust as needed.
      </p>
    </div>
  );
}

