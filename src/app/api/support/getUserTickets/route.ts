import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';

export async function GET(req: NextRequest) {
  try {
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const labelId = searchParams.get('labelId');

    if (!labelId) {
      return NextResponse.json({
        message: "Label ID is required",
        success: false,
        status: 400
      });
    }

    const tickets = await Support.find({ labelId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('subject message reply status createdAt'); // Select only needed fields

    return NextResponse.json({
      success: true,
      status: 200,
      data: tickets
    });

  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
} 