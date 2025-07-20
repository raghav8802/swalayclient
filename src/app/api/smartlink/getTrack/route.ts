import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import Artist from "@/models/Artists";
import Label from "@/models/Label";
import Track from "@/models/track";
import { NextRequest, NextResponse } from "next/server";

interface TrackFetchData {
  profilePicture? : string
  songName: string;
  category: string;
  audioFile: string;
  singers: [
    {
      artistName: string;
    }
  ];
  albumId : string
  albumTitle: string;
  albumThumbnail: string;
  albumLanguage: string;
  albumGenre: string;
  platformLinks: {
    [key: string]: string;
  };
}

export async function GET(request: NextRequest) {
  const trackName = request.nextUrl.searchParams.get("trackName");

//   console.log(trackName);
  

  try {
    await connect();

    const track = await Track.findOne({
      songName: trackName,
    }).select("_id albumId songName singers audioFile category platformLinks");

    if (!track) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Track Not found",
      });
    }

    const album = await Album.findById(track.albumId).select(
      "_id labelId title thumbnail language genre"
    );

    const label = await Label.findOne({
      _id : album.labelId
    }).select("profilePicture")

    const singers = await Artist.find({
      _id: {
        $in: track.singers,
      },
    }).select("_id artistName");

    const data : TrackFetchData = {
      profilePicture : label?.profilePicture,
      songName: track.songName,
      category: track.category,
      audioFile: track.audioFile,
      singers: singers.map((singer) => ({
        artistName: singer ? singer.artistName : "Unknown Artist",
      })) as TrackFetchData["singers"],
      albumId : album._id,
      albumTitle: album.title,
      albumThumbnail: album.thumbnail,
      albumLanguage: album.language,
      albumGenre: album.genre,
      platformLinks: track.platformLinks,
    };

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Track found",
      data: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server error",
    });
  }
}
