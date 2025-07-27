import { NextRequest, NextResponse } from 'next/server';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { apiCache, generateCacheKey } from '@/lib/cache';

export async function GET(req: NextRequest) {

    await connect();

    const labelId = req.nextUrl.searchParams.get("labelId");

    if (!labelId || !mongoose.Types.ObjectId.isValid(labelId)) {
        return NextResponse.json({
            message: "Invalid or missing labelId",
            success: false,
            status: 400,
        });
    }

    // ✅ Cache key
    const cacheKey = generateCacheKey('albums', { labelId });
    
    // ✅ Check cache
    const cached = apiCache.get(cacheKey);
    if (cached) {
        console.log(`✅ Cache hit: ${cacheKey}`);
        return NextResponse.json(cached);
    }

    try {
        // Convert the labelId string to a mongoose ObjectId
        const albums = await Album.find({ labelId: new mongoose.Types.ObjectId(labelId) });

        if (albums.length === 0) {
            const result = {
                message: "No albums found for the given labelId",
                success: false,
                status: 404,
            };
            
            // ✅ Cache empty results too (shorter time)
            apiCache.set(cacheKey, result, 2 * 60 * 1000);
            return NextResponse.json(result);
        }

        const result = {
            message: "Albums found",
            success: true,
            status: 200,
            data: albums,
        };

        // ✅ Cache for 10 minutes (albums don't change often)
        apiCache.set(cacheKey, result, 10 * 60 * 1000);
        console.log(`💾 Cache set: ${cacheKey}`);

        return NextResponse.json(result);
        
    } catch (error) {
        console.error('Internal Server Error:', error);

        return NextResponse.json({
            message: "Internal server error",
            success: false,
            status: 500,
        });
    }
}
