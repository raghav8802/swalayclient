import { NextRequest, NextResponse } from 'next/server';
import { apiCache, generateCacheKey } from '@/lib/cache';

export async function GET(req: NextRequest) {
  const testParam = req.nextUrl.searchParams.get('test') || 'default';
  const cacheKey = generateCacheKey('test-cache', { test: testParam });

  // Check if data exists in cache
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({
      success: true,
      source: 'cache',
      message: 'Data retrieved from cache',
      timestamp: cached.timestamp,
      cacheKey,
      data: cached.data
    });
  }

  // Simulate some work (like a database query)
  await new Promise(resolve => setTimeout(resolve, 1000));

  const result = {
    timestamp: new Date().toISOString(),
    data: `Test data for parameter: ${testParam}`,
    randomValue: Math.random()
  };

  // Cache for 30 seconds (short time for testing)
  apiCache.set(cacheKey, result, 30 * 1000);

  return NextResponse.json({
    success: true,
    source: 'database',
    message: 'Data retrieved from database and cached',
    timestamp: result.timestamp,
    cacheKey,
    data: result.data,
    randomValue: result.randomValue
  });
} 