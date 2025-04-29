import { NextRequest, NextResponse } from 'next/server';
import Subscription from '@/models/Subscription';
import { connect } from '@/dbConfig/dbConfig';

export async function GET(req: NextRequest) {
  try {
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        message: "User ID is required",
        success: false,
        status: 400
      });
    }

    const subscriptions = await Subscription.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('planName price startDate endDate status createdAt trackCount');

    // Add isExpired field to each subscription
    const subscriptionsWithExpiry = subscriptions.map(subscription => {
      const currentDate = new Date();
      const endDate = new Date(subscription.endDate);
      const isExpired = 
        subscription.trackCount === '0' || 
        subscription.trackCount.toLowerCase() !== 'unlimited' && endDate < currentDate;

      return {
        ...subscription.toObject(),
        isExpired
      };
    });

    return NextResponse.json({
      success: true,
      status: 200,
      data: subscriptionsWithExpiry
    });

  } catch (error: any) {
    console.error('Error fetching subscription history:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}