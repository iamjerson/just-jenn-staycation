"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isBefore, startOfDay } from "date-fns";

interface BookingEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: string;
  fullName: string;
}

interface BlockedDateEntry {
  id: number;
  date: string;
}

interface BookingEntry {
  id: number;
  fullName: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<BookingEvent[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, blockedRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/blocked-dates"),
      ]);

      const bookings: BookingEntry[] = await bookingsRes.json();
      const blocked: BlockedDateEntry[] = await blockedRes.json();

      const bookingEvents: BookingEvent[] = bookings
        .filter((b: BookingEntry) => b.status !== "cancelled")
        .map((b: BookingEntry) => ({
          id: b.id,
          title: b.status === "confirmed" ? `Booked - ${b.fullName}` : `Pending - ${b.fullName}`,
          start: new Date(b.checkIn),
          end: new Date(b.checkOut),
          status: b.status,
          fullName: b.fullName,
        }));

      setEvents(bookingEvents);
      setBlockedDates(blocked.map((d: BlockedDateEntry) => new Date(d.date)));
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = startOfDay(new Date());

  const isBlocked = (date: Date) => {
    return blockedDates.some((bd) => isSameDay(bd, date));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = startOfDay(new Date(event.start));
      const eventEnd = startOfDay(new Date(event.end));
      const checkDate = startOfDay(date);
      return checkDate >= eventStart && checkDate < eventEnd;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvents(getEventsForDate(date));
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
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
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
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const blocked = isBlocked(day);
          const hasConfirmed = dayEvents.some((e) => e.status === "confirmed");
          const hasPending = dayEvents.some((e) => e.status === "pending");
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all relative
                hover:bg-gray-50 cursor-pointer
                ${blocked ? "bg-red-50" : ""}
                ${hasConfirmed && !blocked ? "bg-green-50" : ""}
                ${hasPending && !hasConfirmed && !blocked ? "bg-yellow-50" : ""}
                ${isSelected ? "ring-2 ring-blue-500" : ""}
                ${isSameDay(day, today) ? "font-bold text-blue-800" : ""}
              `}
            >
              <span className={blocked ? "line-through text-gray-400" : ""}>
                {format(day, "d")}
              </span>
              <div className="flex gap-0.5 mt-0.5">
                {blocked && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                )}
                {hasConfirmed && (
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                )}
                {hasPending && (
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h4>
          {selectedEvents.length === 0 && !isBlocked(selectedDate) && (
            <p className="text-green-600 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Available for booking
            </p>
          )}
          {isBlocked(selectedDate) && (
            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Blocked / Unavailable
            </p>
          )}
          {selectedEvents.map((event) => (
            <div
              key={event.id}
              className={`mt-2 p-3 rounded-lg text-sm ${
                event.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <p className="font-medium">
                {event.status === "confirmed" ? "Confirmed Booking" : "Pending Booking"}
              </p>
              <p className="text-xs mt-1">{event.fullName}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-6 text-xs text-gray-500 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-400"></div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-200 border border-green-400"></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}
