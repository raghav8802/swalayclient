import {  NextResponse } from "next/server";
import mongoose from 'mongoose';
import Subscription from '@/models/Subscription'; // Adjust path as needed
import Label from '@/models/Label'; // Adjust path as needed
import { connect } from '@/dbConfig/dbConfig';

export async function GET() {
  try {
    // Connect to database
    await connect();

    // Fetch all users from Labels schema
    const allUsers = await Label.find<{
      _id: mongoose.Types.ObjectId;
      usertype: string;
      email: string;
    }>({});

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    // Get the last invoice ID to start our sequence
    const lastSubscription = await Subscription.findOne({})
      .sort({ createdAt: -1 })
      .select("invoiceId");

    let invoiceCounter = 1; // Default starting point
    if (lastSubscription && lastSubscription.invoiceId) {
      const lastInvoiceId = lastSubscription.invoiceId;
      const invoiceNumberMatch = lastInvoiceId.match(/(\d+)$/);

      if (invoiceNumberMatch) {
        invoiceCounter = parseInt(invoiceNumberMatch[1], 10) + 1;
      }
    }

    // Process each user
    const subscriptionStartDate = new Date('2025-01-01');
    const results = [];

    for (const user of allUsers) {
      // Calculate end date based on user type
      const endDate = new Date(subscriptionStartDate);
      if (user.usertype === 'super') {
        endDate.setFullYear(endDate.getFullYear() + 2);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Generate invoice ID with sequential numbering
      const newInvoiceNumber = invoiceCounter.toString().padStart(4, "0");
      const invoiceId = `SL/INV/P${newInvoiceNumber}`;
      // Create subscription data
      const subscriptionData = {
        userId: user._id.toString(),
        planId: 2, // Assuming 2 is the Pro plan ID
        planName: 'Pro',
        price: user.usertype === 'super' ? '0' : '0', // Free since it's a migration
        trackCount: 'unlimited',
        startDate: subscriptionStartDate,
        endDate: endDate,
        paymentId: 'MIGRATION-' + user._id.toString(),
        orderId: 'MIGRATION-ORDER-' + user._id.toString(),
        razorpayPaymentId: 'MIGRATION-RAZOR-' + user._id.toString(),
        invoiceId: invoiceId,
        status: 'active'
      };

      // Create and save subscription
      const newSubscription = new Subscription(subscriptionData);
      await newSubscription.save();

      // Update user's subscriptionEndDate
      await Label.findByIdAndUpdate(user._id, { subscriptionEndDate: endDate });

      results.push({
        userId: user._id,
        email: user.email,
        subscriptionId: newSubscription._id,
        invoiceId: invoiceId,
        endDate: endDate
      });
    }

    return NextResponse.json({
      message: 'Subscriptions created successfully',
      count: results.length,
      results: results
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating subscriptions:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}