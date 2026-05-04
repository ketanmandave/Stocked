import React from "react";
import { motion } from "framer-motion";

const NewsLetter = () => {
  return (
    <section className="mt-20 px-4 md:px-8 lg:px-12">
      
      {/* 🌿 Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#EAF7F1] via-white to-[#F4FBF7] rounded-3xl px-6 md:px-12 py-10 md:py-14 shadow-sm border border-[#E2E8F0]"
      >
        {/* 🔥 Heading */}
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          Never Miss a Deal!
        </h2>

        {/* 📝 Subtext */}
        <p className="md:text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts.
        </p>

        {/* 📩 Form */}
        <form className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
          
          {/* ✉️ Input */}
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full h-12 md:h-14 px-4 rounded-xl border border-gray-300 focus:border-[#22A45D] focus:ring-2 focus:ring-[#22A45D]/20 outline-none transition"
          />

          {/* 🚀 Button */}
          <button
            type="submit"
            className="w-full sm:w-auto h-12 md:h-14 px-8 bg-[#22A45D] hover:bg-[#1c8a4f] text-white font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
          >
            Subscribe
          </button>
        </form>

        {/* 🔒 Trust note */}
        <p className="text-xs text-gray-400 mt-4">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
};

export default NewsLetter;
