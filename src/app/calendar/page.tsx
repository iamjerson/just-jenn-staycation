import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Availability
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check our calendar for available dates and plan your stay
          </p>
        </div>

        <CalendarView />
      </div>
    </div>
  );
}
