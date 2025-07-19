// src/app/api/support/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/Support';
import sendMail from '@/helpers/sendMail';
import SupportTicketEmail from '@/components/Email/SupportTicketEmail';
import React from 'react';

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const { name, email, labelId, subject, message, status } = body;

    // Validate required fields
    if (!name || !email || !labelId || !subject || !message) {
      return NextResponse.json({
        message: "All fields are required",
        success: false,
        status: 400
      });
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Check for existing support requests with the same labelId for today
    const existingSupportRequests = await Support.find({
      labelId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingSupportRequests.length >= 2) {
      return NextResponse.json({
        message: "A maximum of two requests per day is allowed.",
        success: false,
        status: 400
      });
    }

    const newSupport = new Support({
      name,
      email,
      labelId,
      subject,
      message,
      status: status || 'pending',
      priority: 'medium',
      category: 'general',
      isClosed: false
    });

    const savedSupport = await newSupport.save();

    // Send email notification
    try {
      await sendMail({
        to: email,
        subject: `Support Ticket Created - ${savedSupport.ticketId}`,
        emailTemplate: React.createElement(SupportTicketEmail, {
          clientName: name,
          ticketId: savedSupport.ticketId,
          subject: subject,
          message: message
        })
      });
    } catch (emailError) {
      console.error('Error sending support ticket email:', emailError);
      // Don't return error to client if email fails, just log it
    }

    return NextResponse.json({
      message: "Thank you! We will reach out to you soon.",
      success: true,
      status: 201,
      data: savedSupport
    });

  } catch (error: any) {
    console.error('Error creating support request:', error);
    
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
