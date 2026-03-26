import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-bold text-lg">JJ</span>
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  Just Jenn Staycation
                </h2>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Your perfect getaway awaits. Experience comfort, relaxation, and
              memorable moments at our cozy condo staycation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-blue-200 hover:text-white text-sm">
                Home
              </Link>
              <Link href="/about" className="text-blue-200 hover:text-white text-sm">
                About Us
              </Link>
              <Link href="/gallery" className="text-blue-200 hover:text-white text-sm">
                Gallery
              </Link>
              <Link
                href="/calendar"
                className="text-blue-200 hover:text-white text-sm"
              >
                Check Availability
              </Link>
              <Link
                href="/book"
                className="text-blue-200 hover:text-white text-sm"
              >
                Book Your Stay
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-2 text-blue-200 text-sm">
              <p>Phone: +63 912 345 6789</p>
              <p>Email: justjenn.staycation@gmail.com</p>
              <p>Facebook: Just Jenn Staycation</p>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Just Jenn Staycation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
