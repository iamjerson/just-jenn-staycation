import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Available for Booking
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Welcome to
            <span className="block text-yellow-300">Just Jenn Staycation</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
            Escape the everyday hustle and unwind in our beautifully furnished
            condo. Perfect for couples, families, and anyone looking for a
            relaxing getaway.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/book"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all hover:shadow-lg hover:shadow-yellow-400/25 text-center"
            >
              Book Your Stay
            </Link>
            <Link
              href="/calendar"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-white/10 transition-all text-center"
            >
              View Availability
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
