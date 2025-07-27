import { NextRequest, NextResponse } from 'next/server';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
import Marketing from '@/models/Marketing';
import { apiCache, generateCacheKey } from '@/lib/cache';

export async function GET(req: NextRequest) {
  await connect();

  // Extract query parameters
  const labelId = req.nextUrl.searchParams.get("labelId");

  // ✅ Cache key
  const cacheKey = generateCacheKey('marketing-albums', { labelId: labelId || 'all' });
  
  // ✅ Check cache
  const cached = apiCache.get(cacheKey);
  if (cached) {
    console.log(`✅ Cache hit: ${cacheKey}`);
    return NextResponse.json(cached);
  }

  // Build the query object
  let query: any = {};

  if (labelId) {
    query.labelId = labelId;
  }

  // Fetch albums where status is 2 or 4
  query.status = { $in: [2, 4] };

  try {
    // Fetch albums based on query and sort by new to old
    const albums = await Album.find(query).sort({ createdAt: -1 });

    if (!albums || albums.length === 0) {
      const result = {
        message: "No albums found",
        success: true,
        status: 404,
      };
      
      // ✅ Cache empty results too (shorter time)
      apiCache.set(cacheKey, result, 2 * 60 * 1000);
      return NextResponse.json(result);
    }

    // ✅ OPTIMIZED: Fetch all marketing data in ONE query instead of N+1
    const albumIds = albums.map(album => album._id);
    const marketingData = await Marketing.find({ 
      albumId: { $in: albumIds } 
    }).select('albumId isExtraFileRequested isSelectedForPromotion');

    // ✅ Create a Map for O(1) lookup performance
    const marketingMap = new Map();
    marketingData.forEach(marketing => {
      let status = "Pitched";
      if (marketing.isExtraFileRequested) {
        status = "Requested";
      } else if (marketing.isSelectedForPromotion) {
        status = "Selected";
      }
      marketingMap.set(marketing.albumId.toString(), status);
    });

    // ✅ Map albums with marketing status (no async needed!)
    const albumsWithMarketingStatus = albums.map(album => ({
      ...album.toObject(),
      marketingStatus: marketingMap.get(album._id.toString()) || "Not Pitched",
    }));

    const result = {
      message: "Albums are found",
      success: true,
      status: 200,
      data: albumsWithMarketingStatus,
    };

    // ✅ Cache for 5 minutes (marketing data changes occasionally)
    apiCache.set(cacheKey, result, 5 * 60 * 1000);
    console.log(`💾 Cache set: ${cacheKey}`);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json({
      message: "Internal server down",
      success: false,
      status: 500,
    });
  }
}
