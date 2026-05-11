import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 py-24 gap-12">
        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-light leading-tight">
            Manage your{" "}
            <span className="text-teal-400 font-semibold">events</span> smarter
            & faster
          </h1>

          <p className="text-gray-400 mt-6 text-lg">
            EventCraft helps you handle bookings, track progress and manage
            payments seamlessly — all in one powerful platform.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <Link
              to="/register"
              className="bg-teal-400 text-black px-6 py-3 font-semibold rounded-md hover:opacity-90 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-gray-600 px-6 py-3 rounded-md hover:border-teal-400 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT CARDS */}
        <div className="grid grid-cols-2 gap-5 w-full max-w-md">
          <div className="border border-gray-800 p-5 rounded-xl hover:border-teal-400 transition">
            <p className="text-gray-500 text-sm">TOTAL BOOKINGS</p>
            <h2 className="text-2xl font-bold text-teal-400 mt-2">120+</h2>
          </div>

          <div className="border border-gray-800 p-5 rounded-xl hover:border-teal-400 transition">
            <p className="text-gray-500 text-sm">HAPPY CLIENTS</p>
            <h2 className="text-2xl font-bold text-teal-400 mt-2">95+</h2>
          </div>

          <div className="border border-gray-800 p-5 rounded-xl col-span-2 hover:border-teal-400 transition">
            <p className="text-gray-500 text-sm mb-2">SMART MANAGEMENT</p>
            <p className="text-sm text-gray-300">
              Track bookings, assign employees and monitor event progress in
              real-time.
            </p>
          </div>

          <div className="col-span-2 rounded-xl overflow-hidden border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
              className="w-full h-44 object-cover"
              alt="event"
            />
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="px-10 py-20 border-t border-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why EventCraft?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-800 rounded-xl hover:border-teal-400 transition">
            <h3 className="text-xl font-semibold mb-2 text-teal-400">
              Easy Booking
            </h3>
            <p className="text-gray-400 text-sm">
              Book events quickly with a simple and smooth process.
            </p>
          </div>

          <div className="p-6 border border-gray-800 rounded-xl hover:border-teal-400 transition">
            <h3 className="text-xl font-semibold mb-2 text-teal-400">
              Live Tracking
            </h3>
            <p className="text-gray-400 text-sm">
              Track event progress and employee updates in real-time.
            </p>
          </div>

          <div className="p-6 border border-gray-800 rounded-xl hover:border-teal-400 transition">
            <h3 className="text-xl font-semibold mb-2 text-teal-400">
              Secure Payments
            </h3>
            <p className="text-gray-400 text-sm">
              Safe and reliable payment system with Razorpay.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-20 border-t border-gray-900">
        <h2 className="text-3xl font-bold mb-4">
          Start your event journey today 🚀
        </h2>

        <Link
          to="/register"
          className="bg-teal-400 text-black px-8 py-3 font-semibold rounded-md hover:opacity-90 transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
