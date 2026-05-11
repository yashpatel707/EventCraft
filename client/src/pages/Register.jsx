import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

export default function Register() {
  // ✅ FIX: proper initial state
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee", // 🔥 default employee
  });

  const register = async () => {
    try {
      // ✅ FIX: ensure role always sent
      await API.post("/auth/register", {
        ...data,
        role: data.role || "employee",
      });

      alert("Registered Successfully");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center px-4">
      {/* CARD */}
      <div className="w-full max-w-md border border-gray-800 rounded-xl p-8 bg-black shadow-lg">
        {/* TITLE */}
        <h2 className="text-3xl font-light text-center mb-8">
          <span className="text-white">Create your </span>
          <span className="text-teal-400 font-semibold">EventCraft</span>{" "}
          account
        </h2>

        {/* NAME */}
        <input
          className="w-full p-3 mb-4 rounded-md bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        {/* EMAIL */}
        <input
          className="w-full p-3 mb-4 rounded-md bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        {/* ROLE */}
        <select
          className="w-full p-3 mb-4 rounded-md bg-black border border-gray-800 text-white focus:outline-none focus:border-teal-400 transition"
          value={data.role}
          onChange={(e) => setData({ ...data, role: e.target.value })}
        >
          <option value="user">Customer</option>
          <option value="employee">Employee</option>
        </select>

        {/* PASSWORD */}
        <input
          className="w-full p-3 mb-6 rounded-md bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        {/* BUTTON */}
        <button
          onClick={register}
          className="w-full bg-teal-400 text-black py-3 rounded-md font-semibold hover:opacity-90 transition"
        >
          Register
        </button>

        {/* LINK */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
