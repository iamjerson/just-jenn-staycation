"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">JJ</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-blue-900 leading-tight">
                  Just Jenn
                </h1>
                <p className="text-xs text-blue-600 -mt-0.5">Staycation</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-800 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-800 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/gallery"
              className="text-gray-600 hover:text-blue-800 font-medium transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/calendar"
              className="text-gray-600 hover:text-blue-800 font-medium transition-colors"
            >
              Availability
            </Link>
            <Link
              href="/book"
              className="bg-blue-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors"
            >
              Book Now
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-3 pt-3">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-800 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-blue-800 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/gallery"
                className="text-gray-600 hover:text-blue-800 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/calendar"
                className="text-gray-600 hover:text-blue-800 font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Availability
              </Link>
              <Link
                href="/book"
                className="bg-blue-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors text-center"
                onClick={() => setIsOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
