import { NextResponse } from "next/server";

// Create a dynamic config for this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("subscriptionId");

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`http://localhost:3000/api/subscription/fetch-subscription-details?subscriptionId=${subscriptionId}`);
    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch subscription details" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, subscription: data.subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
} 