interface BookingWidgetShellProps {
  baseRate: number;
  propertyName: string;
}

export default function BookingWidgetShell({ baseRate, propertyName }: BookingWidgetShellProps) {
  return (
    <aside className="bg-white rounded-xl shadow-warm-lg p-6 sticky top-24">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-semibold text-coral">${baseRate}</span>
          <span className="text-sm text-driftwood"> / night</span>
        </div>
        <span className="text-xs uppercase tracking-wide text-driftwood">
          Availability & booking coming soon
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="h-12 rounded-lg bg-sand flex items-center justify-center text-driftwood/80">
          Date range picker (Phase 3)
        </div>
        <div className="h-12 rounded-lg bg-sand flex items-center justify-center text-driftwood/80">
          Guest selector (Phase 3)
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full px-4 py-3 bg-sea-glass text-white rounded-lg hover:bg-sea-glass/90 transition-warm shadow-warm disabled:opacity-70 disabled:cursor-not-allowed"
        disabled
      >
        Booking coming soon
      </button>

      <p className="mt-3 text-xs text-driftwood">
        You&apos;ll soon be able to book {propertyName} directly on this page. For now, please reach
        out via the contact details in the footer.
      </p>
    </aside>
  );
}

