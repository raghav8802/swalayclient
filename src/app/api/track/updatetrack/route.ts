import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";
import { uploadTrackToS3 } from "@/dbConfig/uploadFileToS3";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();

    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"); // Log the form data
    console.log("Form data received:"); // Log the form data
    console.log("Form data keys:", Array.from(formData.keys())); // Log the keys in the form data
    console.log("Form data values:"); // Log the values in the form data
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`); // Log each key-value pair
    });

    const trackId = formData.get("trackId")?.toString();
  

    if (!trackId || !mongoose.Types.ObjectId.isValid(trackId)) {
      return NextResponse.json({
        message: "Invalid trackId",
        success: false,
        status: 400,
      });
    }

    const albumId = formData.get("albumId")?.toString();
    if (!albumId || !mongoose.Types.ObjectId.isValid(trackId)) {
      return NextResponse.json({
        message: "Invalid trackId",
        success: false,
        status: 400,
      });
    }


    // Initialize the updateData object with all potential fields
    const updateData: {
      songName?: string;
      primarySinger?: string;
      singers?: string[];
      composers?: string[];
      lyricists?: string[];
      producers?: string[];
      isrc?: string;
      duration?: string;
      crbt?: string;
      category?: string;
      version?: string;
      trackType?: string;
      audioFile?: string; // Include audioFile as an optional field
    } = {};

    // Populate updateData with fields from formData
    updateData.songName = formData.get("songName")?.toString() ?? "";
    updateData.primarySinger = formData.get("primarySinger")?.toString() ?? "";
    updateData.singers = JSON.parse(formData.get("singers")?.toString() ?? "[]");
    updateData.composers = JSON.parse(formData.get("composers")?.toString() ?? "[]");
    updateData.lyricists = JSON.parse(formData.get("lyricists")?.toString() ?? "[]");
    updateData.producers = JSON.parse(formData.get("producers")?.toString() ?? "[]");
    // updateData.isrc = formData.get("isrc")?.toString() ?? "";
    updateData.duration = formData.get("duration")?.toString() ?? "";
    updateData.crbt = formData.get("crbt")?.toString() ?? "";
    updateData.category = formData.get("category")?.toString() ?? "";
    updateData.version = formData.get("version")?.toString() ?? "";
    updateData.trackType = formData.get("trackType")?.toString() ?? "";

    const audioFile = formData.get("audioFile") as File;

    // Handle audio file update
    if (audioFile) {
      console.log("Audio file received:", audioFile); // Log the audio file details
      console.log("Audio file name:", audioFile.name); // Log the audio file name
      console.log("Audio file size:", audioFile.size); // Log the audio file size
      console.log("Audio file type:", audioFile.type); // Log the audio file type

      const songName = (formData.get("songName") as string).trim();
      const songNameNoSpace = songName.replace(/ /g, "-");
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const audioFileExtension = audioFile.name.split(".").pop();
      const audioFileName = `${songNameNoSpace}-${Date.now()}.${audioFileExtension}`;

      const uploadResult = await uploadTrackToS3({
        file: audioBuffer,
        fileName: audioFileName,
        folderName: albumId,
      });

      console.log("Upload result:", uploadResult); // Log the upload result

      if (!uploadResult.status) {
        return NextResponse.json({
          message: "Failed to upload audio file",
          success: false,
          status: 500,
        });
      }

      // Update the audio file field
      updateData.audioFile = uploadResult.fileName;
    }

    // Perform the update operation
    const updatedTrack = await Track.findByIdAndUpdate(trackId, updateData, { new: true });

    if (!updatedTrack) {
      return NextResponse.json({
        message: "Track not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Success! Track updated",
      data: updatedTrack,
      success: true,
      status: 200,
    });

  } catch (error: any) {
    console.error("Error updating track:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
