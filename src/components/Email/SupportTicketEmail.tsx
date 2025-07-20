import React from "react";
import EmailLayout from "./EmailLayout";

interface SupportTicketEmailProps {
  clientName: string;
  ticketId: string;
  subject: string;
  message: string;
}

const SupportTicketEmail: React.FC<SupportTicketEmailProps> = ({
  clientName,
  ticketId,
  subject,
  message,
}) => {
  return (
    <EmailLayout>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '32px', textAlign: 'center', color: '#000000', marginBottom: '24px' }}>
          Support Ticket Created
        </h1>
        <div style={{ color: '#333333', fontSize: '16px', lineHeight: '1.5' }}>
          <p style={{ marginBottom: '16px' }}>Hi {clientName},</p>
          
          <p style={{ marginBottom: '16px' }}>
            Your support ticket has been successfully created. Our team will review your request and get back to you as soon as possible.
          </p>

          <div style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Ticket Details:</h2>
            <p style={{ margin: '8px 0' }}><strong>Ticket ID:</strong> {ticketId}</p>
            <p style={{ margin: '8px 0' }}><strong>Subject:</strong> {subject}</p>
            <p style={{ margin: '8px 0' }}><strong>Message:</strong> {message}</p>
          </div>

          <p style={{ marginBottom: '16px' }}>
            You can track the status of your ticket in the &quot;My Tickets&quot; section of your account.
          </p>

          <p style={{ marginBottom: '16px' }}>
            If you have any additional questions, please don&apos;t hesitate to contact us at{' '}
            <a href="mailto:swalay.care@talantoncore.in" style={{ color: '#0066cc', textDecoration: 'none' }}>
              swalay.care@talantoncore.in
            </a>
          </p>

          <p style={{ marginBottom: '24px' }}>
            Thank you for reaching out to SwaLay Support!
          </p>
        </div>
      </div>
    </EmailLayout>
  );
};

export default SupportTicketEmail; 