import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log("Creating order api ............");

    console.log("Razorpay Credentials Check:", {
      keyIdExists: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keySecretExists: !!process.env.RAZORPAY_KEY_SECRET,
      keyIdValue:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 4) + "...",
    });

    if (
      !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      throw new Error("Razorpay credentials are missing");
    }

    const { amount, currency, planName, username } = (await request.json()) as {
      amount: string;
      currency: string;
      planName: string;
      username: string;
    };

    console.log("Parsed request body:", {
      amount,
      currency,
      planName,
      username,
    });

    console.log("amount", amount);
    console.log("currency", currency);
    console.log("planName", planName);
    
    const options = {
      amount: amount, // Convert amount to smallest currency unit
      currency: currency,
      receipt: `rcp_${username}_${Date.now()}`.substring(0, 40), // Removed extra closing brace
    };

    const order = await razorpay.orders.create(options);
    console.log("order");
    console.log(order);

    return NextResponse.json(
      { orderId: order.id, sucess: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error.message);
    console.log(error);

    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
