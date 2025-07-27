import { NextResponse } from 'next/server';
import { apiCache } from '@/lib/cache';

export async function GET() {
  try {
    const stats = apiCache.getStats();
    
    return NextResponse.json({
      success: true,
      message: 'Cache statistics retrieved',
      data: {
        cacheSize: stats.size,
        maxSize: stats.maxSize,
        usagePercentage: Math.round((stats.size / stats.maxSize) * 100),
        status: stats.size < stats.maxSize * 0.8 ? 'healthy' : 'warning'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Error retrieving cache stats',
      error: error.message
    });
  }
}

// Clear cache endpoint (useful for debugging)
export async function DELETE() {
  try {
    apiCache.clear();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Error clearing cache',
      error: error.message
    });
  }
} 