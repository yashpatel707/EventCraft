import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
  const [data, setData] = useState({});

  const login = async () => {
    try {
      // Removed hardcoded admin - use real login with admin@test.com/admin123

      const res = await API.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);

      const role = res.data.role;

      switch (role) {
        case "admin":
          window.location.href = "/admin";
          break;
        case "employee":
          window.location.href = "/employee";
          break;
        default:
          window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center px-4">
      {/* CARD */}
      <div className="w-full max-w-md border border-gray-800 rounded-xl p-8 bg-black shadow-lg">
        {/* TITLE */}
        <h2 className="text-3xl font-light text-center mb-8">
          <span className="text-white">Login to </span>
          <span className="text-teal-400 font-semibold">EventCraft</span>
        </h2>

        {/* EMAIL */}
        <input
          className="w-full p-3 mb-4 rounded-md bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        {/* PASSWORD */}
        <input
          className="w-full p-3 mb-6 rounded-md bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        {/* BUTTON */}
        <button
          onClick={login}
          className="w-full bg-teal-400 text-black py-3 rounded-md font-semibold hover:opacity-90 transition"
        >
          Login
        </button>

        {/* LINK */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
