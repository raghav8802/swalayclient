import { NextRequest, NextResponse } from 'next/server';
import Album, { AlbumStatus } from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
import TotalBalance from '@/models/totalBalance';
import Artist from '@/models/Artists';
import { apiCache, generateCacheKey } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    await connect();

    const labelId = request.nextUrl.searchParams.get("labelId");

    if (!labelId) {
      return NextResponse.json({
        message: "Label ID is required",
        success: false,
        status: 400,
      });
    }

    // ✅ Generate cache key
    const cacheKey = generateCacheKey('numbers', { labelId });
    
    // ✅ Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return NextResponse.json(cached);
    }

    // ✅ Execute expensive queries
    const albumIds = await Album.find({ labelId }).distinct('_id');
    const totalAlbums = albumIds.length;
    const totalArtists = await Artist.countDocuments({ labelId });
    const totalBalance = await TotalBalance.findOne({ labelId }).then(balance => balance ? balance.totalBalance : 0);
    const upcomingReleases = await Album.countDocuments({ labelId, status: AlbumStatus.Processing });

    const result = {
      message: "Numbers are fetched",
      success: true,
      status: 200,
      data: {
        totalAlbums,
        totalArtist: totalArtists,
        totalBalance,
        upcomingReleases,
      }
    };

    // ✅ Cache for 5 minutes (dashboard stats)
    apiCache.set(cacheKey, result, 5 * 60 * 1000);
    console.log(`💾 Cache set: ${cacheKey}`);

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
}
