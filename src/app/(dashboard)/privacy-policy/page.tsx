"use client";

import React from "react";

const PrivacyPolicy = () => {
  const tableOfContents = [
    "WHAT INFORMATION DO WE COLLECT?",
    "HOW DO WE PROCESS YOUR INFORMATION?",
    "WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?",
    "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?",
    "DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?",
    "HOW DO WE HANDLE YOUR SOCIAL LOGINS?",
    "HOW LONG DO WE KEEP YOUR INFORMATION?",
    "WHAT ARE YOUR PRIVACY RIGHTS?",
    "CONTROLS FOR DO-NOT-TRACK FEATURES",
    "DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
    "DO WE MAKE UPDATES TO THIS NOTICE?",
    "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?",
    "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"
  ];

  // Using React.ReactNode instead of JSX.Element for type safety
  function getSectionContent(index: number): React.ReactNode {
    switch (index) {
      case 1: // WHAT INFORMATION DO WE COLLECT?
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Personal information you disclose to us</h3>
            <p className="italic">In Short: We collect personal information that you provide to us.</p>
            
            <p>
              We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
            </p>

            <div className="space-y-4">
              <p><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>names</li>
                <li>phone numbers</li>
                <li>email addresses</li>
                <li>mailing addresses</li>
                <li>usernames</li>
                <li>contact preferences</li>
                <li>billing addresses</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p><strong>Sensitive Information.</strong> When necessary, with your consent or as otherwise permitted by applicable law, we process the following categories of sensitive information:</p>
              <ul className="list-disc pl-6">
                <li>student data</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p><strong>Payment Data.</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by Razorpay and Paytm. You may find their privacy notice link(s) here: https://razorpay.com/privacy/ and https://www.paypal.com/in/webapps/mpp/ua/privacy-full.</p>
            </div>

            <div className="space-y-2">
              <p><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called &quot;HOW DO WE HANDLE YOUR SOCIAL LOGINS?&quot; below.</p>
            </div>
          </div>
        );

      case 2: // HOW DO WE PROCESS YOUR INFORMATION?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
            
            <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and authentication and otherwise manage user accounts.</li>
              <li>To deliver and facilitate delivery of services to the user.</li>
              <li>To respond to user inquiries/offer support to users.</li>
              <li>To send administrative information to you.</li>
              <li>To fulfill and manage your orders.</li>
              <li>To enable user-to-user communications.</li>
              <li>To save or protect an individual&apos;s vital interest.</li>
            </ul>
          </div>
        );

      default:
        return (
          <p className="text-gray-700">
            Section content coming soon...
          </p>
        );
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PRIVACY NOTICE</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: September 03, 2022</p>

      <div className="prose max-w-none space-y-8">
        <section>
          <p className="text-gray-700">
            This privacy notice for SwaLay Digital (doing business as SwaLay) (&quot;SwaLay,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), describes how and why we might collect, store, use, and/or share (&quot;process&quot;) your information when you use our services (&quot;Services&quot;), such as when you:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
            <li>Visit our website at https://swalay.in, or any website of ours that links to this privacy notice</li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">TABLE OF CONTENTS</h2>
          <div className="space-y-2">
            {tableOfContents.map((title, index) => (
              <a 
                key={index}
                href={`#section-${index + 1}`}
                className="block text-blue-600 hover:text-blue-800"
              >
                {index + 1}. {title}
              </a>
            ))}
          </div>
        </section>

        {/* Add numbered sections */}
        {tableOfContents.map((title, index) => (
          <section key={index} id={`section-${index + 1}`} className="scroll-mt-20">
            <h2 className="text-2xl font-semibold mb-4">
              {index + 1}. {title}
            </h2>
            <div className="text-gray-700">
              {getSectionContent(index + 1)}
            </div>
          </section>
        ))}

        {/* Add contact information footer */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="text-gray-700 space-y-1">
            <p>SwaLay Digital</p>
            <p>Data Protection Officer</p>
            <p>TC HO, C-4, 4/19, Sector-2</p>
            <p>Rajender Nagar, Sahibabad</p>
            <p>Ghazibabad, Uttar Pradesh 201005</p>
            <p>India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;