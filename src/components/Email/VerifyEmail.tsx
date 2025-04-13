// src/components/Email/PasswordReset.tsx

import React from "react";
import EmailLayout from "./EmailLayout";

interface VerifyEmailEmailTemplateProps {
  recipientName: string;
  resetLink: string;
}

export const VerifyEmail: React.FC<VerifyEmailEmailTemplateProps> = ({
  recipientName,
  resetLink,
}) => {
  return (
    <EmailLayout>
    <div style={{ padding: "20px 30px" }}>

    <h2 style={{ fontSize: '32px', textAlign: 'center', color: '#000000', marginBottom: '24px' }}>
      Verify Your Email
    </h2>

    <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
      Hi {recipientName},</p>

      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
       Your account is created successfully. To complete the process, please verify your email address by clicking the button below:
      </p>

      {/* Reset Button */}
      <div style={{ padding: "20px 0", textAlign: "center" }}>
        <a
          href={resetLink}
          style={{
            backgroundColor: "#00b3b3",
            color: "white",
            padding: "12px 25px",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Reset Password
        </a>
      </div>

      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666666' }}>
        Or copy and paste this link into your browser:<br />
        {`${resetLink}`}
      </p>

 
      <p style={{ marginBottom: '16px' }}>
        If you didn&apos;t request this, 
        please ignore this email or contact support if you have questions.
      </p>
      
    </div>
    </EmailLayout>

  );
};
