import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Employee() {
  const [data, setData] = useState([]);

  const employeeId = localStorage.getItem("userId");

  const fetchData = async () => {
    try {
      const res = await API.get("/bookings/employee");

      const tasks = res.data.filter(
        (b) => b.assignedTo && b.assignedTo._id === employeeId,
      );

      setData(tasks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateProgress = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/progress`, {
        employeeStatus: status,
      });

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const total = data.length;

  const inProgress = data.filter(
    (d) => d.employeeStatus === "in-progress",
  ).length;

  const completed = data.filter((d) => d.employeeStatus === "completed").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}

      <div className="w-64 bg-indigo-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-5">EventCraft Employee</h2>

        <ul className="space-y-3">
          <li>Dashboard</li>
          <li>My Tasks</li>
        </ul>
      </div>

      {/* Main */}

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>

        {/* Stats Cards */}

        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white shadow rounded p-5">
            <p>Total Assigned</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>

          <div className="bg-blue-100 shadow rounded p-5">
            <p>In Progress</p>
            <h2 className="text-2xl font-bold">{inProgress}</h2>
          </div>

          <div className="bg-emerald-100 shadow rounded p-5">
            <p>Completed</p>
            <h2 className="text-2xl font-bold">{completed}</h2>
          </div>
        </div>

        {/* Table */}

        <div className="bg-white shadow rounded p-5">
          <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Customer Name</th>
                <th className="p-2">Event</th>
                <th className="p-2">Date</th>
                <th className="p-2">Price</th>
                <th className="p-2">Progress</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-2">{item.userId?.name || "N/A"}</td>

                  <td className="p-2">{item.eventType}</td>

                  <td className="p-2">{item.date}</td>

                  {/* FIXED PRICE */}

                  <td className="p-2 font-bold text-green-600">
                    ₹{item.price || item.budget || 0}
                  </td>

                  <td className="p-2">{item.employeeStatus}</td>

                  <td className="p-2">
                    {item.employeeStatus === "unassigned" && (
                      <button
                        onClick={() => updateProgress(item._id, "in-progress")}
                        className="bg-blue-500 text-white px-3 py-1 mr-2 rounded"
                      >
                        Start Work
                      </button>
                    )}

                    {item.employeeStatus === "in-progress" && (
                      <button
                        onClick={() => updateProgress(item._id, "completed")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
