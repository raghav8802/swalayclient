import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import Artist from "@/models/Artists";
import Label from "@/models/Label";
import Track from "@/models/track";
import { NextRequest, NextResponse } from "next/server";

interface DataForSmartLink {
  labelName: string;
  facebook?: string;
  appleMusic?: string;
  instagram?: string;
  spotify?: string;
  ytMusic?: string;
  profilePicture?: string;
  albumId?: string;
  albumTitle: string;
  albumThumbnail: string;
  albumLanguage: string;
  albumGenre: string;
  tracks: [
    {
      trackName: string;
      audioFile: string;
      platformLinks: {
        [key: string]: string | null;
      };
      singers: [
        {
          artistName: string;
        }
      ];
    }
  ];
}

export async function GET(request: NextRequest) {
  const uniqueUsername = request.nextUrl.searchParams.get("uniqueUsername");

  try {
    await connect();
    const label = await Label.findOne({
      uniqueUsername: uniqueUsername,
    }).select(
      "_id username appleMusic facebook instagram spotify ytMusic profilePicture"
    );

    if (!label) {
      return NextResponse.json({
        status: 404,
        message: "label not found",
        success: false,
      });
    }

    const album = await Album.findOne({
      labelId: label._id,
    }).select("_id title thumbnail language genre");

    const tracks = await Track.find({
      albumId: album._id,
    }).select("_id songName singers audioFile platformLinks platformLinks");

    const singers = await Promise.all(
      tracks.map(async (track) => {
        return await Artist.findOne({
          _id: {
            $in: track.singers,
          },
        }).select("_id artistName");
      })
    );

    const data: DataForSmartLink = {
      labelName: label.username,
      facebook: label.facebook || undefined,
      appleMusic: label.appleMusic || undefined,
      instagram: label.instagram || undefined,
      spotify: label.spotify || undefined,
      ytMusic: label.ytMusic || undefined,
      profilePicture: label.profilePicture || undefined,
      albumId: album._id,
      albumTitle: album.title,
      albumThumbnail: album.thumbnail,
      albumLanguage: album.language,
      albumGenre: album.genre,
      tracks: tracks.map((track) => ({
        trackName: track.songName,
        audioFile: track.audioFile,
        platformLinks: track.platformLinks || null,
        singers: singers.map((singer) => ({
          artistName: singer ? singer.artistName : "Unknown Artist",
        })),
      })) as DataForSmartLink["tracks"],
    };

    return NextResponse.json({
      status: 200,
      message: "Label found",
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      success: false,
    });
  }
}
