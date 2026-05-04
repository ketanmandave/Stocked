import React from "react";

const About = () => {
  return (
    <div className="mt-16 px-4 md:px-12 lg:px-20 pb-20 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold">
          About <span className="text-primary">GroceryMart</span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          A simple and smart way to shop groceries online.
        </p>
      </div>

      {/* Intro */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-xl font-semibold mb-4">Who We Are</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            GroceryMart is a modern e-commerce platform built as a college project
            to simplify grocery shopping. Our goal is to provide a smooth and
            intuitive experience where users can browse products, manage their cart,
            and place orders easily.
          </p>
        </div>

        <div className="bg-primary/10 rounded-2xl h-60 flex items-center justify-center">
          <p className="text-primary font-medium">Your Image Here</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-600 text-sm">
            To create a seamless online grocery shopping experience with a focus
            on usability, performance, and simplicity.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Our Vision</h3>
          <p className="text-gray-600 text-sm">
            To evolve into a scalable e-commerce platform that can handle real
            users, real payments, and real-world challenges.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold mb-6 text-center">
          What This Platform Offers
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-5 text-sm text-gray-600 hover:shadow-md transition">
            🛒 Easy product browsing and filtering
          </div>

          <div className="border rounded-xl p-5 text-sm text-gray-600 hover:shadow-md transition">
            📦 Add to cart and manage items
          </div>

          <div className="border rounded-xl p-5 text-sm text-gray-600 hover:shadow-md transition">
            📍 Save and use delivery addresses
          </div>

          <div className="border rounded-xl p-5 text-sm text-gray-600 hover:shadow-md transition">
            💳 Cash on Delivery & Online Payment (Razorpay)
          </div>

          <div className="border rounded-xl p-5 text-sm text-gray-600 hover:shadow-md transition">
            📑 Order tracking system
          </div>

          <div className="border rounded-xl p-5 text-sm text-gray-600 hover:shadow-md transition">
            ⚡ Fast and responsive UI
          </div>

        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-700">
        <strong>Note:</strong> This platform is developed as a college project and
        is intended for learning and demonstration purposes.
      </div>

    </div>
  );
};

export default About;
