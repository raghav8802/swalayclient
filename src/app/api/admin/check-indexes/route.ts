import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import { checkAllIndexes } from '@/dbConfig/indexes';

export async function GET() {
  try {
    await connect();
    await checkAllIndexes(); // This logs to console
    
    return NextResponse.json({
      success: true,
      message: 'Index report generated. Check server console.',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Error checking indexes',
      error: error.message
    });
  }
}