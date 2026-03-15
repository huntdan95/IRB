"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export default function DateRangePicker({ value, onChange, disabled }: DateRangePickerProps) {
  const [month, setMonth] = useState<Date>(value?.from ?? new Date());

  return (
    <div className="booking-calendar w-full min-w-0 overflow-hidden rounded-lg bg-sand/80 border border-driftwood/20 p-3">
      <DayPicker
        mode="range"
        selected={value}
        onSelect={onChange}
        month={month}
        onMonthChange={setMonth}
        numberOfMonths={1}
        disabled={disabled}
        captionLayout="buttons"
        fromDate={new Date()}
        className="mx-0 text-deep-ocean"
        classNames={{
          root: "rdp-booking w-full",
          months: "flex justify-center",
          month: "w-full max-w-full",
          caption: "relative flex items-center justify-between px-1 mb-2",
          caption_label: "text-sm font-semibold text-deep-ocean",
          nav: "flex items-center gap-0",
          nav_button: "h-8 w-8 rounded-full flex items-center justify-center text-driftwood hover:bg-driftwood/15 hover:text-deep-ocean transition-warm",
          nav_button_previous: "absolute left-0",
          nav_button_next: "absolute right-0",
          table: "w-full max-w-full border-collapse",
          head_row: "border-0",
          head_cell: "text-xs font-semibold text-driftwood uppercase py-2 w-9",
          tbody: "border-0",
          row: "border-0",
          cell: "p-0 text-center w-9",
          day: "h-9 w-9 rounded-full flex items-center justify-center w-full text-sm font-medium transition-warm",
          day_outside: "text-driftwood/50 opacity-60",
          day_today: "font-semibold text-deep-ocean",
        }}
        modifiersClassNames={{
          selected: "!bg-sea-glass !text-white",
          disabled: "!bg-coral/20 !text-coral/80 opacity-70 cursor-not-allowed",
          range_start: "!bg-sea-glass !text-white rounded-l-full",
          range_end: "!bg-sea-glass !text-white rounded-r-full",
          range_middle: "!bg-sea-glass/30 !text-deep-ocean rounded-none",
        }}
      />
    </div>
  );
}
