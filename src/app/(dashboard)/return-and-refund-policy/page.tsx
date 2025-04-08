"use client";

import React from "react";

const ReturnAndRefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">RETURN / REFUND POLICY</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: September 03, 2022</p>

      <div className="prose max-w-none space-y-8">
        <section>
          <p className="text-gray-700">
            Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any reason, you may return it to us for store credit or an exchange. Please see below for more information on our return policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">RETURNS PROCESS</h2>
          <p className="text-gray-700 font-semibold">
            [ NO RETURN / CANCELLATION POLICY IS APPLICABLE ]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">REGISTERED ADDRESS</h2>
          <div className="text-gray-700">
            <p>SwaLay Digital</p>
            <p>TC HO, C-4, 4/19, Sector-2</p>
            <p>Rajender Nagar, Sahibabad</p>
            <p>Ghaziabad, Uttar Pradesh 201005</p>
            <p>India</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">QUESTIONS</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions concerning our return policy, please contact us at:
          </p>
          <div className="text-gray-700">
            <p>+917303730201</p>
            <p>swalay.care@talantoncore.in</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">REFUND</h2>
          <h3 className="text-xl font-semibold mb-2">For Music/Content Distribution Service (if applicable)</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>A refund will happen in case of your uploaded song does not pass our Quality Check test. In this case, you will be notified about the uploaded content failing our Quality Check and the amount will be refunded to you within 7-8 days</li>
            <li>A refund can be asked via mail till your song status is processing, QC Pending, QC Approved. Once your song status changes to Song sent to OTT we won't be able to offer a refund.</li>
            <li>We will refund the full amount in case your song is not LIVE on any platform within 15 days of upload.</li>
            <li>We will refund your song if we will take down your song from our end</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">EXCEPTIONS</h2>
          <p className="text-gray-700 mb-2">We will not refund the song in case of</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Forced takedown by uploader</li>
            <li>Takedown by the third party in case of infringement of rights</li>
            <li>Takedown in case of unauthorized upload or upload of the cover song without having appropriate rights</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ReturnAndRefundPolicy; 