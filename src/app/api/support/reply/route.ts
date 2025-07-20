import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import SupportReply from '@/models/SupportReply';

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { supportId, senderType, senderId, senderName, message } = body;

    if (!supportId || !senderType || !senderId || !senderName || !message) {
      return NextResponse.json({
        message: 'All fields are required',
        success: false,
        status: 400
      });
    }

    const newReply = new SupportReply({
      supportId,
      senderType,
      senderId,
      senderName,
      message
    });
    const savedReply = await newReply.save();
    return NextResponse.json({
      message: 'Reply added successfully',
      success: true,
      status: 201,
      data: savedReply
    });
  } catch (error: any) {
    console.error('Error adding reply:', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false,
      status: 500
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const searchParams = req.nextUrl.searchParams;
    const supportId = searchParams.get('supportId');
    if (!supportId) {
      return NextResponse.json({
        message: 'supportId is required',
        success: false,
        status: 400
      });
    }
    const replies = await SupportReply.find({ supportId })
      .sort({ createdAt: 1 });
    return NextResponse.json({
      success: true,
      status: 200,
      data: replies
    });
  } catch (error: any) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false,
      status: 500
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { replyId, isRead } = body;

    if (!replyId || isRead === undefined) {
      return NextResponse.json({
        message: 'replyId and isRead are required',
        success: false,
        status: 400
      });
    }

    const updatedReply = await SupportReply.findByIdAndUpdate(
      replyId,
      { isRead },
      { new: true }
    );

    if (!updatedReply) {
      return NextResponse.json({
        message: 'Reply not found',
        success: false,
        status: 404
      });
    }

    return NextResponse.json({
      message: 'Reply status updated successfully',
      success: true,
      status: 200,
      data: updatedReply
    });
  } catch (error: any) {
    console.error('Error updating reply status:', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false,
      status: 500
    });
  }
} 