import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  const isrc = request.nextUrl.searchParams.get("isrc");


  try {
    const response = await axios.get(
      `${process.env.MUSIC_FETCH_BASE_URL}/isrc?isrc=${isrc}&x-token=${process.env.MUSIC_FETCH_API_KEY}`,
      {
        headers: {
          "x-token": process.env.MUSIC_FETCH_API_KEY || "",
        },
      }
    );


    console.log("Response from Music Fetch API:", response.data);

    if (response.status === 200 && response.data) {
      

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
      } = response.data.result.services || {};

      const platformLinks: { [key: string]: string } = {};

      Object.keys(services).forEach((key) => {
        if (services[key] && services[key].link) {
          platformLinks[key] = services[key].link;
        }
      });

      track.platformLinks = platformLinks;

      const updatedTrack = await track.save();


      return NextResponse.json({
        success: true,
        message: "Track links fetched successfully",
        data: platformLinks,
      });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to fetch track links",
      status: response.status || 500,
    });
  } catch (error: any) {
    console.error("Error fetching track links:", error.message);
    return NextResponse.json({
      message: error.message || "Internal Server Error",
      status: 500,
      success: false,
    });
  }
}
