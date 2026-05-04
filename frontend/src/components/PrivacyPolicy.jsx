import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="px-4 md:px-12 lg:px-20 py-16 max-w-5xl mx-auto text-gray-700">

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-semibold mb-6">
        Privacy <span className="text-primary">Policy</span>
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      {/* Intro */}
      <p className="mb-6 leading-relaxed">
        This Privacy Policy explains how we collect, use, and protect your
        personal information when you use our platform. This project is developed
        as part of a college project and is intended for learning and demonstration purposes.
      </p>

      {/* Data Collection */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Name</li>
          <li>Email address</li>
          <li>Password (stored securely in encrypted form)</li>
          <li>Shipping address (street, city, state, zipcode, country)</li>
          <li>Phone number</li>
          <li>Cart data (products added for purchase)</li>
        </ul>
      </section>

      {/* Usage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>To create and manage your account</li>
          <li>To process and deliver orders</li>
          <li>To store your cart items</li>
          <li>To communicate with you regarding your orders</li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
        <p className="text-sm leading-relaxed">
          We take reasonable measures to protect your personal information.
          Passwords are stored securely and are not visible in plain text.
          However, since this is a development project, we cannot guarantee
          enterprise-level security.
        </p>
      </section>

      {/* Sharing */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Sharing of Information</h2>
        <p className="text-sm leading-relaxed">
          We do not sell or rent your personal data. Your information is only used
          within this platform for order processing and user management.
        </p>
      </section>

      {/* Payments */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Payments</h2>
        <p className="text-sm leading-relaxed">
          Online payments are processed through third-party payment providers.
          We do not store your card or payment details on our servers.
        </p>
      </section>

      {/* User Rights */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
        <p className="text-sm leading-relaxed">
          You can update or delete your account information at any time by
          contacting us.
        </p>
      </section>

      {/* Contact */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
        <p className="text-sm leading-relaxed">
          If you have any questions about this Privacy Policy, you can contact us at:
        </p>
        <p className="text-sm mt-2">
          Email: <span className="text-primary">your-email@example.com</span>
        </p>
      </section>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 mt-10">
        Note: This application is a college project and may not represent a fully
        production-ready system.
      </p>

    </div>
  );
};

export default PrivacyPolicy;
