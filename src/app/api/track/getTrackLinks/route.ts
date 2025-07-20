import { connect } from "@/dbConfig/dbConfig";
import { apiGetCustomHeaders } from "@/helpers/axiosRequest";
import Track from "@/models/track";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  const isrc = request.nextUrl.searchParams.get("isrc");

  try {
    const response = await apiGetCustomHeaders(
      `${process.env.MUSIC_FETCH_BASE_URL}/isrc?isrc=${isrc}&x-token=${process.env.MUSIC_FETCH_API_KEY}`,
      {},
      {
        "x-token": process.env.MUSIC_FETCH_API_KEY || "",
      }
    );


    if (response.result) {
      await connect();

      const track = await Track.findOne({ isrc: isrc });


      if (!track) {
        return NextResponse.json(
          {
            success: false,
            message: "Track not found in the database",
            status: 404,
          },
          { status: 404 }
        );
      }

      const services: {
        [key: string]: {
          id: string;
          link: string;
        };
      } = response.result.services || {};

      const platformLinks: { [key: string]: string } = {};

      Object.keys(services).forEach((key) => {
        if (services[key] && services[key].link) {
          platformLinks[key] = services[key].link;
        }
      });

      track.platformLinks = platformLinks;

      await track.save();


      return NextResponse.json({
        success: true,
        message: "Track links fetched successfully",
        data: platformLinks,
      });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to fetch track links",
      status: 404,
    },{
      status : 404
    });
  } catch (error: any) {
    console.error("Error fetching track links:", error.message);
    return NextResponse.json({
      message: error.message || "Internal Server Error",
      status: 500,
      success: false,
    },{
      status : 500
    });
  }
}
