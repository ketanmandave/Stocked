import React, { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just simulate (you don’t have backend for this)
    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }

    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mt-16 px-4 md:px-12 lg:px-20 pb-20 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Have questions? We’d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT: Contact Info */}
        <div className="space-y-6 text-gray-700 text-sm">

          <div>
            <h2 className="font-semibold text-lg mb-2">Email</h2>
            <p className="text-primary">support@yourstore.com</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Phone</h2>
            <p>+91 9876543210</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Address</h2>
            <p>
              Your College Name <br />
              Your City, India
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Note: This platform is developed as a college project. Responses may
            be delayed.
          </p>
        </div>

        {/* RIGHT: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-xl px-4 py-2 outline-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded-xl px-4 py-2 outline-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="border rounded-xl px-4 py-2 outline-primary resize-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:scale-[1.02] active:scale-95 transition"
          >
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;
