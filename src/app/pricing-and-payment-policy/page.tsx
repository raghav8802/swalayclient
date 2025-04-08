import React from 'react';

const PricingAndPaymentPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Pricing & Payment Policy – SwaLay Digital</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg leading-relaxed mb-8">
          Welcome to SwaLay Digital! We are committed to providing transparent, flexible, and competitive pricing for our digital music distribution and promotional services. Please read this Pricing & Payment Policy carefully to understand the charges, billing, and payment terms applicable to your use of our services.
        </p>

        <hr className="my-8 border-gray-200" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Pricing Structure</h2>
          <p className="mb-4">
            SwaLay Digital offers a flexible pricing model based on the services you choose. Our charges are determined by the type of distribution, promotional services, and subscription plans you opt for.
          </p>

          <h3 className="text-xl font-semibold mb-3">A. Digital Music Distribution</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>The cost of distribution depends on the number of platforms you choose.</li>
            <li>Some platforms may have additional charges based on premium features or promotional placements.</li>
            <li>Distribution fees are one-time charges, and earnings from streams/downloads are credited to your SwaLay account.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">B. Promotional & Marketing Services</h3>
          <p className="mb-3">SwaLay Digital offers various promotional services to enhance artist visibility, such as:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Playlist Placements</li>
            <li>Social Media Promotions</li>
            <li>Influencer Marketing</li>
            <li>Ad Campaigns (Google, Facebook, Instagram, YouTube, etc.)</li>
            <li>Press Releases & Blog Features</li>
          </ul>
          <p className="mb-4">
            Pricing for promotions varies based on the campaign's reach, duration, and customization requirements. Fees for these services will be provided upon request.
          </p>

          <h3 className="text-xl font-semibold mb-3">C. Subscription Plans</h3>
          <p className="mb-3">To cater to artists and labels of all sizes, we offer subscription-based plans that include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Basic Plan: Suitable for new artists with limited distribution and basic support.</li>
            <li>Pro Plan: Ideal for artists looking for wider distribution, advanced analytics, and promotional support.</li>
            <li>Label/Enterprise Plan: For record labels managing multiple artists and tracks with high-volume distribution and exclusive services.</li>
          </ul>
          <p>Subscription charges will be billed monthly or annually, based on the selected plan.</p>
        </section>

        <hr className="my-8 border-gray-200" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Payment Terms & Conditions</h2>
          
          <h3 className="text-xl font-semibold mb-3">A. Payment Methods</h3>
          <p className="mb-3">All payments for services are processed through Razorpay, a secure and PCI-DSS-compliant payment gateway. We accept:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Credit/Debit Cards (Visa, MasterCard, RuPay, etc.)</li>
            <li>UPI Payments (Google Pay, PhonePe, Paytm, etc.)</li>
            <li>Net Banking</li>
            <li>Wallet Payments</li>
            <li>International Payments (where applicable)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">B. Billing & Invoices</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>After completing the payment, an invoice will be generated and sent to the registered email address.</li>
            <li>Users can also access invoices and payment history from the SwaLay Digital Dashboard (https://app.swalayplus.in).</li>
            <li>For subscription plans, payments will be auto-debited on the due date unless canceled before the renewal.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">C. Refund & Cancellation Policy</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>One-time service charges (e.g., distribution, promotions) are non-refundable once the service is initiated.</li>
            <li>Subscription Plans: You may cancel your subscription anytime before renewal. However, no refunds will be issued for the ongoing billing cycle.</li>
            <li>Refunds may be processed in case of technical issues or payment failures, subject to verification by our support team.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">D. Revenue & Royalty Payments</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Artists will receive their royalties directly to their SwaLay Wallet on the dashboard.</li>
            <li>Withdrawals are processed monthly, and users can transfer funds to their bank account after meeting the minimum payout threshold.</li>
            <li>All royalty payments are subject to platform deductions, taxes, and processing fees.</li>
          </ul>
        </section>

        <hr className="my-8 border-gray-200" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Razorpay Compliance & Payment Gateway Information</h2>
          <p className="mb-4">As part of our compliance with Razorpay's payment gateway requirements, we provide the following details:</p>
          <ul className="list-none space-y-2 mb-6">
            <li>• Business Name: SwaLay Digital</li>
            <li>• Main Website: https://swalay.talantoncore.in</li>
            <li>• Dashboard URL: https://app.swalayplus.in</li>
            <li>• Nature of Business: Digital Music Distribution & Promotion</li>
            <li>• Services Provided: Online music distribution, marketing, promotions, royalty management, and subscription-based services.</li>
            <li>• Transaction Handling: Payments are handled securely via Razorpay, and invoices are automatically generated.</li>
            <li>• Refund Policy: As detailed in Section 2C, refunds are only applicable in cases of system failures or double transactions.</li>
          </ul>

          <p className="mb-6">For any payment-related issues, you can contact SwaLay Digital Support at:</p>
          <p>📩 Email: [Your Support Email]</p>
          <p>📞 Phone: [Your Support Number]</p>
        </section>

        <hr className="my-8 border-gray-200" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Security & Data Protection</h2>
          <ul className="list-disc pl-6">
            <li>All transactions on SwaLay Digital are encrypted using SSL/TLS security protocols to ensure safe payment processing.</li>
            <li>We do not store card details or any sensitive financial data. All payment-related information is handled securely by Razorpay.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PricingAndPaymentPolicy; 