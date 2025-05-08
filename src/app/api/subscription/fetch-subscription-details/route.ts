import { NextRequest, NextResponse } from 'next/server';

import Subscription from '@/models/Subscription';
import { connect } from '@/dbConfig/dbConfig';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    await connect();

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}