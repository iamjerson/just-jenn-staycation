"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore, startOfDay } from "date-fns";

interface DatePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
}

export default function DatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [view, setView] = useState<"checkin" | "checkout">("checkin");

  useEffect(() => {
    fetch("/api/blocked-dates")
      .then((res) => res.json())
      .then((data) => {
        setBlockedDates(data.map((d: { date: string }) => new Date(d.date)));
      })
      .catch(() => {});
  }, []);

  const today = startOfDay(new Date());

  const isBlocked = (date: Date) => {
    return blockedDates.some((bd) => isSameDay(bd, date));
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today) || isBlocked(date)) return;

    if (view === "checkin") {
      onCheckInChange(format(date, "yyyy-MM-dd"));
      if (checkOut && isAfter(date, new Date(checkOut))) {
        onCheckOutChange("");
      }
      setView("checkout");
    } else {
      if (checkIn && isBefore(date, new Date(checkIn))) {
        onCheckInChange(format(date, "yyyy-MM-dd"));
        onCheckOutChange("");
      } else {
        onCheckOutChange(format(date, "yyyy-MM-dd"));
        setView("checkin");
      }
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {view === "checkin" ? "Select Check-in Date" : "Select Check-out Date"}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView("checkin")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              view === "checkin"
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setView("checkout")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              view === "checkout"
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Check-out
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h4>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isPast = isBefore(day, today);
          const blocked = isBlocked(day);
          const isCheckIn = checkIn && isSameDay(day, new Date(checkIn));
          const isCheckOut = checkOut && isSameDay(day, new Date(checkOut));
          const isInRange =
            checkIn &&
            checkOut &&
            isAfter(day, new Date(checkIn)) &&
            isBefore(day, new Date(checkOut));

          const disabled = isPast || blocked;

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer"}
                ${blocked ? "bg-red-50 line-through" : ""}
                ${isCheckIn ? "bg-blue-800 text-white font-bold" : ""}
                ${isCheckOut ? "bg-blue-600 text-white font-bold" : ""}
                ${isInRange ? "bg-blue-100 text-blue-800" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-800"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-50"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-100"></div>
          <span>In Range</span>
        </div>
      </div>
    </div>
  );
}
