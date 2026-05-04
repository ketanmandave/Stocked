import React from "react";

const Terms = () => {
  return (
    <div className="mt-16 px-4 md:px-12 lg:px-20 pb-20 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">
          Terms & <span className="text-primary">Conditions</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this platform, you agree to comply with these
            Terms & Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account
            credentials. Any activity under your account is your responsibility.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">3. Orders & Payments</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Orders can be placed using Cash on Delivery or Online Payment.</li>
            <li>Online payments are processed securely via Razorpay.</li>
            <li>We reserve the right to cancel orders in case of pricing or stock issues.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Pricing & Availability</h2>
          <p>
            All prices are listed in INR and are subject to change without notice.
            Product availability may vary and is not guaranteed.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Shipping & Delivery</h2>
          <p>
            Delivery timelines are estimates and may vary based on location and
            external factors. We are not responsible for delays beyond our control.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">6. Cancellations & Refunds</h2>
          <p>
            Orders once placed cannot be cancelled after processing. Refunds, if
            applicable, will be processed to the original payment method.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">7. User Responsibilities</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Provide accurate personal and delivery information</li>
            <li>Do not misuse or attempt to hack the platform</li>
            <li>Do not place fake or fraudulent orders</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">8. Limitation of Liability</h2>
          <p>
            We are not liable for any indirect or consequential damages arising
            from the use of this platform.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">9. Changes to Terms</h2>
          <p>
            We may update these Terms & Conditions at any time. Continued use of
            the platform means you accept the updated terms.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">10. Contact</h2>
          <p>
            For any questions regarding these terms, contact us at:
            <span className="text-primary ml-1">support@yourstore.com</span>
          </p>
        </section>

      </div>
    </div>
  );
};

export default Terms;
