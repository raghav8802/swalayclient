import { NextRequest, NextResponse } from 'next/server';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
import Marketing from '@/models/Marketing';

export async function GET(req: NextRequest) {
  await connect();

  // Extract query parameters
  const labelId = req.nextUrl.searchParams.get("labelId");


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
      return NextResponse.json({
        message: "No albums found",
        success: true,
        status: 404,
      });
    }

    // Iterate through each album and fetch related marketing details
    const albumsWithMarketingStatus = await Promise.all(
      albums.map(async (album) => {
        // Fetch marketing details for the current album
        const marketing = await Marketing.findOne({ albumId: album._id });

        let marketingStatus = "Not Pitched"; // Default to "Not Pitched"

        if (marketing) {
          // If marketing is found, set status to "Pitched"
          marketingStatus = "Pitched";
          
          // If extra file is requested, set status to "Requested"
          if (marketing.isExtraFileRequested) {
            marketingStatus = "Requested";
          }

          if (marketing.isSelectedForPromotion) {
            marketingStatus = "Selected";
          }

        }

        // Add marketing status to the album object
        return {
          ...album.toObject(),
          marketingStatus,
        };
      })
    );

    return NextResponse.json({
      message: "Albums are found",
      success: true,
      status: 200,
      data: albumsWithMarketingStatus,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json({
      message: "Internal server down",
      success: false,
      status: 500,
    });
  }
}
