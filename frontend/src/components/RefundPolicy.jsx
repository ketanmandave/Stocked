import React from "react";

const RefundPolicy = () => {
  return (
    <div className="mt-16 px-4 md:px-12 lg:px-20 pb-20 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">
          Refund <span className="text-primary">Policy</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

        {/* Section 1 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Overview</h2>
          <p>
            This platform is developed as part of a college project. Refunds are
            handled under limited conditions as described below.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">2. Eligibility for Refund</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Payment was successfully made but order was not processed</li>
            <li>Payment was deducted but order was not created</li>
            <li>Duplicate payment for the same order</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">3. Non-Refundable Cases</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Orders placed using Cash on Delivery</li>
            <li>Incorrect details provided by the user</li>
            <li>Change of mind after placing the order</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Refund Process</h2>
          <p>
            If eligible, refunds will be processed to the original payment method
            used during checkout.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Refund Timeline</h2>
          <p>
            Refunds may take <span className="font-medium">5–7 working days</span> 
            to reflect in your account, depending on your bank or payment provider.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">6. Cancellation Policy</h2>
          <p>
            Orders once placed cannot be cancelled after they are processed.
            Cancellation requests may not be guaranteed.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-semibold text-lg mb-2">7. Contact for Refunds</h2>
          <p>
            For refund-related queries, contact us at:
            <span className="text-primary ml-1">support@yourstore.com</span>
          </p>
        </section>

      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 mt-10">
        Note: This is a college project. Refund policies are simplified and may
        not reflect real-world commercial standards.
      </p>

    </div>
  );
};

export default RefundPolicy;
