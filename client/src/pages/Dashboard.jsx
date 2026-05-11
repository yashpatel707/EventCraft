import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    eventType: "",
    name: "",
    date: "",
    price: "",
  });

  const [bookings, setBookings] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const userId = localStorage.getItem("userId");

  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // FETCH EVENTS
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");

      const userData = res.data.filter((b) => b.userId?._id === userId);

      setBookings(userData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
  }, []);

  // SUBMIT BOOKING
  const submitBooking = async () => {
    if (!form.eventType) return alert("Select event");
    if (!form.name) return alert("Enter name");
    if (!form.date) return alert("Select date");

    try {
      await API.post("/bookings", {
        eventType: form.eventType,
        name: form.name,
        date: form.date,
        price: Number(form.price),
        userId,
      });

      alert("Booking Request Sent");

      setForm({
        eventType: "",
        name: "",
        date: "",
        price: "",
      });

      setSelectedEvent(null);

      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  // PAYMENT
  const payNow = async (item, type) => {
    let amount = 0;

    if (type === "advance") {
      amount = item.price * 0.3;
    } else {
      amount = item.price * 0.7;
    }

    try {
      const res = await API.post("/payment/create-order", { amount });

      const options = {
        key: RAZORPAY_KEY,
        amount: res.data.amount,
        currency: "INR",
        name: "EventCraft",
        description: type + " Payment",
        order_id: res.data.id,

        handler: async function () {
          if (type === "advance") {
            await API.put(`/bookings/${item._id}/advance-paid`);
          } else {
            await API.put(`/bookings/${item._id}/remaining-paid`);
          }

          alert("Payment Successful");
          fetchBookings();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Book Your Event</h1>

      {/* EVENT CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => {
              setSelectedEvent(event._id);

              setForm({
                ...form,
                eventType: event.title,
                price: Number(event.price),
              });
            }}
            className={`bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer transition hover:shadow-2xl hover:-translate-y-1
            ${selectedEvent === event._id ? "ring-2 ring-blue-500" : ""}`}
          >
            <img
              src={"http://localhost:5000" + event.image}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p className="text-gray-600">{event.place}</p>
              <p className="text-green-600 font-bold">₹{event.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING FORM */}
      <div className="bg-white shadow p-6 rounded-xl mb-10">
        <h2 className="text-xl font-bold mb-4">Event Booking</h2>

        <input
          type="text"
          placeholder="Enter Your Name"
          className="border p-2 w-full mb-3"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="border p-2 w-full mb-3"
          value={form.date}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="border p-2 w-full mb-3 bg-gray-100"
          value={form.price}
          readOnly
        />

        <button
          onClick={submitBooking}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Booking
        </button>
      </div>

      {/* BOOKINGS */}
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>

      <div className="space-y-4">
        {bookings.map((item) => (
          <div key={item._id} className="bg-white shadow-lg p-6 rounded-xl">
            <p>
              <b>Event:</b> {item.eventType}
            </p>
            <p>
              <b>Date:</b> {item.date}
            </p>
            <p>
              <b>Price:</b> ₹{item.price}
            </p>
            <p>
              <b>Status:</b> {item.status}
            </p>

            {item.assignedTo && (
              <p>
                <b>Employee:</b> {item.assignedTo.name}
              </p>
            )}

            {/* ADVANCE BUTTON */}
            {item.status === "approved" && item.advancePayment !== "paid" && (
              <button
                onClick={() => payNow(item, "advance")}
                className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
              >
                Pay 30% Advance
              </button>
            )}

            {/* 🔔 NEW: NOTIFICATION MESSAGE */}
            {item.advancePayment === "paid" &&
              item.employeeStatus === "completed" &&
              item.remainingPayment !== "paid" && (
                <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                  <p className="text-yellow-700 font-semibold">
                    ✅ Your event is completed. Please pay remaining 70%.
                  </p>

                  <button
                    onClick={() => payNow(item, "remaining")}
                    className="bg-purple-500 text-white px-3 py-1 mt-2 rounded"
                  >
                    Pay Remaining 70%
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
