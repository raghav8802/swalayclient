import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { supportId, status } = body;

    if (!supportId || !status) {
      return NextResponse.json({
        message: 'supportId and status are required',
        success: false,
        status: 400
      });
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        message: 'Invalid status. Must be pending, in-progress, or resolved',
        success: false,
        status: 400
      });
    }

    const updatedSupport = await Support.findByIdAndUpdate(
      supportId,
      { status },
      { new: true }
    );

    if (!updatedSupport) {
      return NextResponse.json({
        message: 'Support ticket not found',
        success: false,
        status: 404
      });
    }

    return NextResponse.json({
      message: 'Support ticket status updated successfully',
      success: true,
      status: 200,
      data: updatedSupport
    });
  } catch (error: any) {
    console.error('Error updating support status:', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false,
      status: 500
    });
  }
} 