import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscription";
import sendMail from "@/helpers/sendMail";
import SubscriptionSuccessEmail from "@/components/Email/SubscriptionSuccessEmail";
import React from "react";


const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  console.log("Generating signature...");
  console.log("Razorpay Credentials Check2:", {
    keyIdExists: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    keySecretExists: !!process.env.RAZORPAY_KEY_SECRET,
    keyIdValue: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 4) + "...",
  });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request: NextRequest) {
  console.log("Verifying payment...");
  try {

      await connect();

    const data = await request.json(); // Read body once
    console.log("Request body:", data);

    // const { orderCreationId, razorpayPaymentId, razorpaySignature } = data;

    const {
      orderCreationId,
      razorpayPaymentId,
      razorpaySignature,
      planDetails,
      userDetails,
    } = data;

    console.log("Received data:", {
      orderCreationId,
      razorpayPaymentId,
      razorpaySignature,
    });

    const signature = generatedSignature(orderCreationId, razorpayPaymentId);

    console.log("Generated signature:", signature);
    console.log("Received signature:", razorpaySignature);

    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: "payment verification failed", isOk: false },
        { status: 400 }
      );
    }

     // Save payment details to the database
     const startDate = new Date();
     const endDate = new Date();
     endDate.setMonth(startDate.getMonth() + 1); // Example: 1-month subscription
 
     const subscription = new Subscription({
       userId: userDetails.userId, // Ensure `userId` is passed in `userDetails`
       planId: planDetails.planId,
       planName: planDetails.name,
       price: planDetails.price,
       trackCount: planDetails.trackCount,
       startDate,
       endDate,
       paymentId: razorpayPaymentId,
       orderId: orderCreationId,
       razorpayPaymentId,
       status: "active",
     });
 
     await subscription.save();
     console.log("Subscription saved successfully:", subscription);

     // Send subscription confirmation email
     try {
       const emailTemplate = React.createElement(SubscriptionSuccessEmail, {
         clientName: userDetails.name,
         planName: planDetails.name,
         price: planDetails.price,
         startDate: startDate.toLocaleDateString(),
       });
       
       await sendMail({
         to: userDetails.email,
         subject: `Your SwaLay Subscription is Active!`,
         emailTemplate,
       });

       console.log("Subscription confirmation email sent to", userDetails.email);
     } catch (emailError) {
       console.error("Failed to send subscription confirmation email:", emailError);
     }

    return NextResponse.json(
      { message: "payment verified successfully", isOk: true },
      { status: 200 }
    );
  } catch (error: any) {

    console.error("Error verifying payment:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );

  }

}
