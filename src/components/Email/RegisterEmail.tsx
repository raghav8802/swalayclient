import React from "react";
import EmailLayout from "./EmailLayout";

interface EmailProps {
  clientName: string;
}

const RegisterEmail: React.FC<EmailProps> = ({
  clientName,
}) => {
  return (
    <EmailLayout>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#000000', marginBottom: '24px' }}>
        Thanks For Joining!
      </h1>

      <div style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5' }}>
        <p style={{ marginBottom: '16px' }}>Hi {clientName},</p>
        
        <p style={{ marginBottom: '16px' }}>
          Welcome to SwaLay! We're thrilled you've joined our exclusive music community.
        </p>
        
        <p style={{ marginBottom: '16px' }}>
          It's time to unlock a world of premium music experiences. Here's how to begin your journey:
        </p>

        <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
          <li style={{ marginBottom: '12px' }}>
            Access your SwaLay Plus Artist account: Visit{' '}
            <a href="https://app.swalayplus.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
              app.swalayplus.in
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
          Visit the "
            <a href="https://app.swalayplus.in/signin" style={{ color: '#0066cc', textDecoration: 'none' }}>
            Sign In 
            </a>
            " page to access your SwaLay Plus Artist account.
          </li>
        </ol>

          <p style={{ 
            marginLeft: '20px', 
            fontStyle: 'italic',
            color: '#333333',
            fontSize: '16px'
          }}>
            Ready to explore? Once you've set up your login, dive into the exclusive world of music on SwaLay Plus!
          </p>
        
        <p style={{ marginBottom: '24px' }}>
          Our dedicated support team is here to ensure your experience is flawless. If you need any assistance, 
          please don't hesitate to reach out to us at{' '}
          <a href="mailto:swalay.care@talantoncore.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
            swalay.care@talantoncore.in
          </a>.
        </p>

        <p style={{ marginBottom: '24px' }}>
          We're excited to have you embark on this musical journey with SwaLay!
        </p>

        
      </div>
    </div>
    </EmailLayout>
  );
};

export default RegisterEmail;  // Export the component directly