"use client";

import { useState } from "react";
import AdminTable from "@/components/AdminTable";
import BlockedDatesManager from "@/components/BlockedDatesManager";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"bookings" | "dates">("bookings");

  const handleLogin = () => {
    if (password === "justjenn2026") {
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="py-16 md:py-24">
        <div className="max-w-sm mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-500">Enter password to continue</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Admin password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-medium hover:bg-blue-900 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("bookings")}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              tab === "bookings"
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setTab("dates")}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              tab === "dates"
                ? "bg-blue-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Blocked Dates
          </button>
        </div>

        {tab === "bookings" && <AdminTable />}
        {tab === "dates" && <BlockedDatesManager />}
      </div>
    </div>
  );
}
