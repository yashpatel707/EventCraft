import { useState } from "react";
import API from "../utils/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const sendMessage = async () => {
    try {
      await API.post("/contact", form);
      alert("Message Sent ✅");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      alert("Error sending message ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-6">
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* LEFT SIDE */}
        <div className="text-white space-y-6">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-300">
            Feel free to reach out. We will get back to you soon.
          </p>

          <div>
            <p className="text-yellow-400 font-semibold">📍 Address</p>
            <p>India</p>
          </div>

          <div>
            <p className="text-yellow-400 font-semibold">📧 Email</p>
            <p>support@eventcraft.com</p>
          </div>

          <div>
            <p className="text-yellow-400 font-semibold">📞 Phone</p>
            <p>+91 9876543210</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-white">
          <h2 className="text-2xl mb-6 font-semibold">Send Message</h2>

          <input
            className="w-full p-3 mb-4 bg-transparent border-b border-gray-400 focus:outline-none"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full p-3 mb-4 bg-transparent border-b border-gray-400 focus:outline-none"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            className="w-full p-3 mb-6 bg-transparent border-b border-gray-400 focus:outline-none"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button
            onClick={sendMessage}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:opacity-90"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
