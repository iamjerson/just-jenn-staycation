"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, startOfDay } from "date-fns";

interface BlockedDateEntry {
  id: number;
  date: string;
}

export default function BlockedDatesManager() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDateEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlocked = useCallback(async () => {
    try {
      const res = await fetch("/api/blocked-dates");
      const data = await res.json();
      setBlockedDates(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchBlocked();
  }, [fetchBlocked]);

  const today = startOfDay(new Date());

  const toggleDate = async (date: Date) => {
    if (isBefore(date, today)) return;
    setLoading(true);

    const dateStr = format(date, "yyyy-MM-dd");
    const existing = blockedDates.find(
      (bd) => format(new Date(bd.date), "yyyy-MM-dd") === dateStr
    );

    try {
      if (existing) {
        await fetch(`/api/blocked-dates?id=${existing.id}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/blocked-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateStr }),
        });
      }
      fetchBlocked();
    } catch {} finally {
      setLoading(false);
    }
  };

  const isBlocked = (date: Date) => {
    return blockedDates.some(
      (bd) => format(new Date(bd.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Block / Unblock Dates</h3>
      <p className="text-sm text-gray-500 mb-4">Click a date to toggle blocked status</p>

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h4>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((i) => <div key={`e-${i}`} />)}
        {days.map((day) => {
          const blocked = isBlocked(day);
          const past = isBefore(day, today);
          return (
            <button
              key={day.toISOString()}
              onClick={() => toggleDate(day)}
              disabled={past || loading}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
                past ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
              } ${blocked ? "bg-red-100 text-red-700 font-semibold line-through" : "bg-green-50 text-gray-700"}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div><span>Blocked</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-50 border border-green-300"></div><span>Available</span></div>
      </div>
    </div>
  );
}
