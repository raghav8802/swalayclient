import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import Artist from "@/models/Artists";
import Label from "@/models/Label";
import Track from "@/models/track";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface DataForSmartLink {
  bio?: string;
  labelName: string;
  facebook?: string;
  appleMusic?: string;
  instagram?: string;
  spotify?: string;
  ytMusic?: string;
  profilePicture?: string;
  albums: {
    albumId: string;
    albumTitle: string;
    albumThumbnail: string;
    albumLanguage: string;
    albumGenre: string;
  }[];
  tracks: {
    albumId: string;
    albumTitle: string;
    albumThumbnail: string;
    trackName: string;
    audioFile: string;
    platformLinks: {
      [key: string]: string | null;
    };
    singers: {
      artistName: string;
    }[];
  }[];
}

export async function GET(request: NextRequest) {
  const uniqueUsername = request.nextUrl.searchParams.get("uniqueUsername");

  if (!uniqueUsername) {
    return NextResponse.json({
      status: 400,
      message: "Missing uniqueUsername",
      success: false,
    });
  }

  try {
    await connect();

    const label = await Label.findOne({ uniqueUsername }).select(
      "_id username bio appleMusic facebook instagram spotify ytMusic profilePicture"
    );

    if (!label) {
      return NextResponse.json({
        status: 404,
        message: "Label not found",
        success: false,
      });
    }

    const albums = await Album.find({ labelId: label._id }).select(
      "_id title thumbnail language genre"
    );

    const albumMap: {
      [key: string]: { title: string; thumbnail: string };
    } = {};

    const albumIds = albums.map((album) => {
      const idStr = album._id.toString();
      albumMap[idStr] = {
        title: album.title,
        thumbnail: album.thumbnail,
      };
      return album._id;
    });

    const tracks = await Track.find({ albumId: { $in: albumIds } }).select(
      "albumId songName singers audioFile platformLinks"
    );

    const allArtistIds = Array.from(
      new Set(tracks.flatMap((t) => t.singers.map((s: any) => s.toString())))
    );
    const artistDocs = await Artist.find({ _id: { $in: allArtistIds } }).select(
      "_id artistName"
    );

    const artistMap: { [key: string]: string } = {};
    artistDocs.forEach((artist) => {
      artistMap[(artist._id as mongoose.Types.ObjectId).toString()] = artist.artistName;
    });

    const data: DataForSmartLink = {
      bio: label.bio || undefined,
      labelName: label.username,
      facebook: label.facebook || undefined,
      appleMusic: label.appleMusic || undefined,
      instagram: label.instagram || undefined,
      spotify: label.spotify || undefined,
      ytMusic: label.ytMusic || undefined,
      profilePicture: label.profilePicture || undefined,
      albums: albums.map((album) => ({
        albumId: album._id.toString(),
        albumTitle: album.title,
        albumThumbnail: album.thumbnail,
        albumLanguage: album.language,
        albumGenre: album.genre,
      })),
      tracks: tracks.map((track) => {
        const albumIdStr = track.albumId.toString();
        return {
          albumId: albumIdStr,
          albumTitle: albumMap[albumIdStr]?.title || "Unknown Album",
          albumThumbnail: albumMap[albumIdStr]?.thumbnail || "",
          trackName: track.songName,
          audioFile: track.audioFile,
          platformLinks: track.platformLinks || {},
          singers: track.singers.map((singerId: any) => ({
            artistName: artistMap[singerId.toString()] || "Unknown Artist",
          })),
        };
      }),
    };

    return NextResponse.json({
      status: 200,
      message: "Label found",
      success: true,
      data,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      success: false,
    });
  }
}
