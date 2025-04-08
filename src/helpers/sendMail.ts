// utils/sendMail.ts
import { Resend } from "resend";
import { ReactElement } from "react";


const resend = new Resend(process.env.RESEND_API_KEY as string);

interface SendMailOptions {
  to: string | string[]; // Supports single or multiple email addresses
  subject: string;
  emailTemplate: ReactElement; // Pass any rendered template component here
}

const sendMail = async ({ to, subject, emailTemplate }: SendMailOptions): Promise<void> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SwaLay India <swalay.care@talantoncore.in>",
      to: Array.isArray(to) ? to : [to],
      subject,
      react: emailTemplate,
    });

    console.log("Email sent successfully:", data);
    console.log("Email send error:", error);

    if (error) {
      throw new Error(`Failed to send email: ${error}`);
      console.log("Error sending email:", error);
      
    }
    
  } catch (error) {
    console.log("Error sending email:", error);
    console.error("Error in sendMail function:", error);
    throw error;
  }
};

export default sendMail;
