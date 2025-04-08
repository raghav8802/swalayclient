// src/components/Email/PasswordReset.tsx

import React from "react";
import EmailLayout from "./EmailLayout";

interface PasswordResetEmailTemplateProps {
  recipientName: string;
  resetLink: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailTemplateProps> = ({
  recipientName,
  resetLink,
}) => {
  return (
    <EmailLayout>
    <div style={{ padding: "20px 30px" }}>
      <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "normal" }}>
        Hi {recipientName},
      </h2>
      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
        We received a request to reset your password for your SwaLay account. To
        reset your password, please click the button below:
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

      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        If you did not request a password reset, please ignore this email or
        contact our support team if you have concerns.
      </p>

      <p style={{ color: "#989595", fontSize: "16px" }}>
        This password reset link will expire in {10} minutes.
      </p>
    </div>
    </EmailLayout>

  );
};
