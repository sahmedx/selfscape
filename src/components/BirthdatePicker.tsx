"use client";

import { useState, useMemo } from "react";
import ScrollWheel from "./ScrollWheel";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

interface BirthdatePickerProps {
  onSubmit: (month: number, day: number, year: number) => void;
}

export default function BirthdatePicker({ onSubmit }: BirthdatePickerProps) {
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [year, setYear] = useState(1995);

  const monthItems = useMemo(
    () => MONTH_NAMES.map((name, i) => ({ value: i + 1, label: name })),
    []
  );

  const yearItems = useMemo(
    () =>
      Array.from({ length: 2026 - 1920 + 1 }, (_, i) => {
        const y = 1920 + i;
        return { value: y, label: String(y) };
      }),
    []
  );

  const maxDay = getDaysInMonth(month, year);
  const clampedDay = Math.min(day, maxDay);

  const dayItems = useMemo(
    () =>
      Array.from({ length: maxDay }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
    [maxDay]
  );

  function handleMonthChange(m: number) {
    setMonth(m);
    const newMax = getDaysInMonth(m, year);
    if (day > newMax) setDay(newMax);
  }

  function handleYearChange(y: number) {
    setYear(y);
    const newMax = getDaysInMonth(month, y);
    if (day > newMax) setDay(newMax);
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl font-light tracking-wide text-foreground sm:text-4xl">
        When were you born?
      </h1>

      <div className="flex gap-2 sm:gap-6">
        <div className="w-32 sm:w-36">
          <ScrollWheel items={monthItems} selectedValue={month} onChange={handleMonthChange} />
        </div>
        <div className="w-16 sm:w-20">
          <ScrollWheel items={dayItems} selectedValue={clampedDay} onChange={setDay} />
        </div>
        <div className="w-20 sm:w-24">
          <ScrollWheel items={yearItems} selectedValue={year} onChange={handleYearChange} />
        </div>
      </div>

      <button
        onClick={() => onSubmit(month, clampedDay, year)}
        className="cursor-pointer rounded-full border border-gold/40 bg-gold/10 px-8 py-3 text-lg font-medium tracking-wide text-gold transition-all hover:bg-gold/20 active:scale-95"
      >
        Discover Your World
      </button>
    </div>
  );
}
