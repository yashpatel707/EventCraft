import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Admin() {
  const [page, setPage] = useState("events");

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    place: "",
    price: "",
    image: null,
  });

  // FETCH DATA

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const fetchBookings = async () => {
    const res = await API.get("/bookings");
    setBookings(res.data);
  };

  const fetchEmployees = async () => {
    try {
      console.log("🔍 Fetching employees...");
      const res = await API.get("/auth/users?role=employee");
      console.log("✅ Employees response:", res.data);
      setEmployees(res.data);
    } catch (error) {
      console.error(
        "❌ fetchEmployees ERROR:",
        error.response?.data || error.message,
      );
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
    fetchEmployees();
  }, []);

  // ADD EVENT

  const addEvent = async () => {
    const data = new FormData();

    data.append("title", form.title);
    data.append("place", form.place);
    data.append("price", form.price);
    data.append("image", form.image);

    await API.post("/events", data);

    alert("Event Added");

    fetchEvents();
  };

  // UPDATE EVENT

  const updateEvent = async () => {
    await API.put("/events/" + editingId, form);

    alert("Event Updated");

    setEditingId(null);

    fetchEvents();
  };

  // DELETE EVENT

  const deleteEvent = async (id) => {
    await API.delete("/events/" + id);

    fetchEvents();
  };

  // EDIT BUTTON

  const editEvent = (event) => {
    setForm({
      title: event.title,
      place: event.place,
      price: event.price,
    });

    setEditingId(event._id);

    setPage("events");
  };

  // APPROVE / REJECT

  const updateStatus = async (id, status) => {
    await API.put("/bookings/" + id + "/status", { status });

    fetchBookings();
  };

  // ASSIGN EMPLOYEE

  const assignEmployee = async (id) => {
    if (!selectedEmployee) return alert("Select employee");

    await API.put("/bookings/" + id + "/assign", {
      employeeId: selectedEmployee,
    });

    fetchBookings();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}

      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>

        <ul className="space-y-4">
          <li
            onClick={() => setPage("events")}
            className="cursor-pointer hover:text-gray-300"
          >
            Admin Event Manager
          </li>

          <li
            onClick={() => setPage("cards")}
            className="cursor-pointer hover:text-gray-300"
          >
            Dynamic Event Cards
          </li>

          <li
            onClick={() => setPage("bookings")}
            className="cursor-pointer hover:text-gray-300"
          >
            Customer Bookings
          </li>

          <li
            onClick={() => setPage("payments")}
            className="cursor-pointer hover:text-gray-300"
          >
            Payments
          </li>
        </ul>
      </div>

      {/* MAIN */}

      <div className="flex-1 p-10">
        {/* ADD / EDIT EVENT */}

        {page === "events" && (
          <div className="flex justify-center">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
              <h1 className="text-3xl font-bold text-center mb-6">
                {editingId ? "Update Event" : "Create New Event"}
              </h1>

              <div className="space-y-4">
                <input
                  placeholder="Event Title"
                  className="w-full border p-3 rounded-lg"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Place"
                  className="w-full border p-3 rounded-lg"
                  value={form.place}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      place: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Price"
                  type="number"
                  className="w-full border p-3 rounded-lg"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="w-full border p-2 rounded-lg"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.files[0],
                    })
                  }
                />

                {editingId ? (
                  <button
                    onClick={updateEvent}
                    className="w-full bg-green-500 text-white py-3 rounded-lg"
                  >
                    Update Event
                  </button>
                ) : (
                  <button
                    onClick={addEvent}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg"
                  >
                    Add Event
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EVENT CARDS */}

        {page === "cards" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dynamic Event Cards</h1>

            <div className="grid grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition"
                >
                  <img
                    src={"http://localhost:5000" + event.image}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-4">
                    <h2 className="text-xl font-bold">{event.title}</h2>

                    <p className="text-gray-600">{event.place}</p>

                    <p className="text-green-600 font-bold">₹{event.price}</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => editEvent(event)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteEvent(event._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS */}

        {page === "bookings" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Customer Bookings</h1>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Name</th>

                  <th className="p-2">Event</th>

                  <th className="p-2">Date</th>

                  <th className="p-2">Price</th>

                  <th className="p-2">Status</th>

                  <th className="p-2">Assign</th>

                  <th className="p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((item) => (
                  <tr key={item._id} className="border-t text-center">
                    <td className="p-2">{item.name}</td>

                    <td className="p-2">{item.eventType}</td>

                    <td className="p-2">{item.date}</td>

                    <td className="p-2">₹{item.price || item.budget || 0}</td>

                    <td className="p-2">{item.status}</td>

                    <td className="p-2">
                      {item.assignedTo ? (
                        <span className="text-green-600 font-bold">
                          {item.assignedTo.name}
                        </span>
                      ) : (
                        item.status === "approved" && (
                          <select
                            onChange={(e) =>
                              setSelectedEmployee(e.target.value)
                            }
                            className="border p-1"
                          >
                            <option>Select Employee</option>

                            {employees.map((emp) => (
                              <option key={emp._id} value={emp._id}>
                                {emp.name}
                              </option>
                            ))}
                          </select>
                        )
                      )}
                    </td>

                    <td className="p-2">
                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(item._id, "approved")}
                            className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => updateStatus(item._id, "rejected")}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {item.status === "approved" && !item.assignedTo && (
                        <button
                          onClick={() => assignEmployee(item._id)}
                          className="bg-purple-500 text-white px-2 py-1 ml-2 rounded"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAYMENTS */}

        {page === "payments" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Payments</h1>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Customer</th>

                  <th className="p-2">Event</th>

                  <th className="p-2">Budget</th>

                  <th className="p-2">Advance</th>

                  <th className="p-2">Remaining</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((item) => (
                  <tr key={item._id} className="border-t text-center">
                    <td className="p-2">{item.name}</td>

                    <td className="p-2">{item.eventType}</td>

                    <td className="p-2">₹{item.price || item.budget || 0}</td>

                    <td className="p-2">
                      {item.advancePayment === "paid" ? "Paid" : "Pending"}
                    </td>

                    <td className="p-2">
                      {item.remainingPayment === "paid" ? "Paid" : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
