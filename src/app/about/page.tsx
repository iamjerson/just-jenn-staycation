export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about Just Jenn Staycation and what makes us special
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-blue-800 rounded-2xl h-80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold">JJ</span>
              </div>
              <p className="text-blue-200 text-lg">Just Jenn Staycation</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Just Jenn Staycation was born from a passion for hospitality and creating
              memorable experiences. We believe that a perfect getaway doesn&apos;t have to
              be far from home &mdash; sometimes the best relaxation is right around the corner.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our cozy condo unit is thoughtfully designed to provide all the comforts of
              home while giving you that vacation feeling. Whether you&apos;re celebrating a
              special occasion, need a work-from-condo change of scenery, or simply want
              to unwind with your loved ones, we&apos;ve got you covered.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We take pride in maintaining a clean, well-equipped, and welcoming space
              for every guest. Your comfort and satisfaction are our top priorities.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "\u{1F6CF}\u{FE0F}", label: "Comfortable Bed" },
              { icon: "\u{1F4FA}", label: "Smart TV" },
              { icon: "\u{1F3CB}\u{FE0F}", label: "Air Conditioning" },
              { icon: "\u{1F4F1}", label: "Free WiFi" },
              { icon: "\u{1F373}", label: "Kitchen" },
              { icon: "\u{1F9FB}", label: "Refrigerator" },
              { icon: "\u{1F9FC}", label: "Washing Machine" },
              { icon: "\u{1F6AA}", label: "Secure Access" },
              { icon: "\u{1F697}", label: "Parking" },
              { icon: "\u{1F3B6}", label: "Sound System" },
              { icon: "\u{2615}", label: "Coffee Maker" },
              { icon: "\u{1F381}", label: "Welcome Kit" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-900 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">House Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">Check-in</h3>
              <p className="text-blue-200">2:00 PM onwards</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">Check-out</h3>
              <p className="text-blue-200">12:00 noon</p>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">Max Guests</h3>
              <p className="text-blue-200">Up to 8 guests</p>
            </div>
          </div>
          <div className="mt-8 text-blue-200 text-sm space-y-1">
            <p>No smoking inside the unit</p>
            <p>No parties or events</p>
            <p>Quiet hours: 10:00 PM - 8:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
