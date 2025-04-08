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

  function getSectionContent(index: number): JSX.Element {
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
              <p><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS?" below.</p>
            </div>

            <p>
              All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
            </p>

            <h3 className="text-xl font-semibold mt-8">Information automatically collected</h3>
            <p className="italic">In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>

            <p>
              We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
            </p>

            <p>Like many businesses, we also collect information through cookies and similar technologies.</p>

            <p>The information we collect includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Log and Usage Data.</strong> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).</li>
              <li><strong>Device Data.</strong> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.</li>
              <li><strong>Location Data.</strong> We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.</li>
            </ul>
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
              <li>To save or protect an individual's vital interest.</li>
            </ul>
          </div>
        );

      case 3: // WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>
            
            {/* Add EU/UK section */}
            <div className="space-y-2">
              <p><strong>If you are located in the EU or UK, this section applies to you.</strong></p>
              {/* Add EU/UK content */}
            </div>

            {/* Add Canada section */}
            <div className="space-y-2 mt-4">
              <p><strong>If you are located in Canada, this section applies to you.</strong></p>
              {/* Add Canada content */}
            </div>
          </div>
        );

      case 4: // WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: We may share information in specific situations described in this section and/or with the following categories of third parties.</p>
            
            <p>Vendors, Consultants, and Other Third-Party Service Providers. We may share your data with third-party vendors, service providers, contractors, or agents ("third parties") who perform services for us or on our behalf and require access to such information to do that work. The categories of third parties we may share personal information with are as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ad Networks</li>
              <li>Affiliate Marketing Programs</li>
              <li>Cloud Computing Services</li>
              <li>Communication & Collaboration Tools</li>
              <li>Data Analytics Services</li>
              <li>Finance & Accounting Tools</li>
              <li>Order Fulfillment Service Providers</li>
              <li>Payment Processors</li>
              <li>Performance Monitoring Tools</li>
              <li>Product Engineering & Design Tools</li>
              <li>Social Networks</li>
              <li>Website Hosting Service Providers</li>
              <li>User Account Registration & Authentication Services</li>
              <li>Testing Tools</li>
              <li>Retargeting Platforms</li>
            </ul>

            <p>We also may need to share your personal information in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>When we use Google Maps Platform APIs.</strong> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). To find out more about Google's Privacy Policy, please refer to this link.</li>
              <li><strong>Affiliates.</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice.</li>
              <li><strong>Business Partners.</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
            </ul>
          </div>
        );

      case 5: // DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: We may use cookies and other tracking technologies to collect and store your information.</p>
            
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>
          </div>
        );

      case 6: // HOW DO WE HANDLE YOUR SOCIAL LOGINS?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: If you choose to register or log in to our services using a social media account, we may have access to certain information about you.</p>
            
            <p>Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</p>
            
            <p>We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</p>
          </div>
        );

      case 7: // HOW LONG DO WE KEEP YOUR INFORMATION?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</p>
            
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>
            
            <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
          </div>
        );

      case 8: // WHAT ARE YOUR PRIVACY RIGHTS?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>
            
            <p>In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.</p>
            
            {/* Add more content for privacy rights section */}
          </div>
        );

      case 9: // CONTROLS FOR DO-NOT-TRACK FEATURES
        return (
          <div className="space-y-4">
            <p>
              Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
            </p>
          </div>
        );

      case 10: // DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</p>

            <p>
              California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
            </p>

            <p>
              If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-4">CCPA Privacy Notice</h3>
            <p>The California Code of Regulations defines a "resident" as:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>every individual who is in the State of California for other than a temporary or transitory purpose and</li>
              <li>every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</li>
            </ul>
            {/* Add more CCPA-specific content */}
          </div>
        );

      case 11: // DO WE MAKE UPDATES TO THIS NOTICE?
        return (
          <div className="space-y-4">
            <p className="italic">In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>

            <p>
              We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
            </p>
          </div>
        );

      case 12: // HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        return (
          <div className="space-y-4">
            <p>
              If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO), Data Protection Officer, by email at mytalent@talantoncore.in, by phone at +917303630201, or by post to:
            </p>

            <div className="pl-4 mt-4">
              <p>SwaLay Digital</p>
              <p>Data Protection Officer</p>
              <p>TC HO, C-4, 4/19, Sector-2</p>
              <p>Rajender Nagar, Sahibabad</p>
              <p>Ghazibabad, Uttar Pradesh 201005</p>
              <p>India</p>
            </div>
          </div>
        );

      case 13: // HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
        return (
          <div className="space-y-4">
            <p>
              Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please contact us at mytalent@talantoncore.in.
            </p>
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
            This privacy notice for SwaLay Digital (doing business as SwaLay) ("SwaLay," "we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
            <li>Visit our website at https://swalay.in, or any website of ours that links to this privacy notice</li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
        </section>

        <section>
          <p className="text-gray-700">
            Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at swalay.care@talantoncore.in.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">SUMMARY OF KEY POINTS</h2>
          <p className="text-gray-700 mb-4">
            This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
          </p>
          
          <div className="space-y-4 text-gray-700">
            {/* Summary points */}
            <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with SwaLay and the Services, the choices you make, and the products and features you use.</p>
            
            <p><strong>Do we process any sensitive personal information?</strong> We may process sensitive personal information when necessary with your consent or as otherwise permitted by applicable law.</p>
            
            <p><strong>Do we receive any information from third parties?</strong> We do not receive any information from third parties.</p>
            
            {/* Add other summary points similarly */}
          </div>
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