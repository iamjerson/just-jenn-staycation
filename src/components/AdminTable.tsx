"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

interface Booking {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  purposeOfStay: string;
  specialRequests: string | null;
  status: string;
  createdAt: string;
}

export default function AdminTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch {
    }
  };

  const filtered = bookings.filter(
    (b) => filter === "all" || b.status === filter
  );

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({statusCounts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() =>
                  setExpandedId(expandedId === booking.id ? null : booking.id)
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-500"
                          : booking.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {booking.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(booking.checkIn), "MMM d")} -{" "}
                        {format(new Date(booking.checkOut), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedId === booking.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedId === booking.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium">{booking.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-sm font-medium">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Guests</p>
                      <p className="text-sm font-medium">{booking.guestCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Purpose</p>
                      <p className="text-sm font-medium capitalize">
                        {booking.purposeOfStay}
                      </p>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">
                        Special Requests
                      </p>
                      <p className="text-sm bg-white p-3 rounded-lg border border-gray-100">
                        {booking.specialRequests}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mb-4">
                    Submitted on{" "}
                    {format(new Date(booking.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>

                  <div className="flex gap-2">
                    {booking.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(booking.id, "pending")}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
                      >
                        Set Pending
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
