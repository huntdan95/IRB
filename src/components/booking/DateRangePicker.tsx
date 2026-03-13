"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export default function DateRangePicker({ value, onChange, disabled }: DateRangePickerProps) {
  const [month, setMonth] = useState<Date>(value?.from ?? new Date());

  return (
    <DayPicker
      mode="range"
      selected={value}
      onSelect={onChange}
      month={month}
      onMonthChange={setMonth}
      numberOfMonths={2}
      disabled={disabled}
      captionLayout="dropdown-buttons"
      fromDate={new Date()}
      className="bg-white rounded-xl shadow-warm p-4 text-deep-ocean"
    />
  );
}

