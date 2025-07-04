import { connect } from "@/dbConfig/dbConfig";
import { uploadFileToS3ForUser } from "@/dbConfig/uploadFileToS3";
import Label from "@/models/Label";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const data = {
      lablelId: formData.get("labelId")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
      instagram: formData.get("instagram")?.toString() || "",
      facebook: formData.get("facebook")?.toString() || "",
      ytMusic: formData.get("ytMusic")?.toString() || "",
      spotify: formData.get("spotify")?.toString() || "",
      appleMusic: formData.get("appleMusic")?.toString() || "",
    };

    if (!data.lablelId) {
      return NextResponse.json({
        status: 400,
        message: "Label ID is not found",
        success: false,
      });
    }

    await connect();

    const label = await Label.findOne({ _id: data.lablelId });

    if (!label) {
      return NextResponse.json({
        status: 404,
        message: "Label not found",
        success: false,
      });
    }

    label.bio = data.bio || label.bio;
    label.instagram = data.instagram || label.instagram;
    label.facebook = data.facebook || label.facebook;
    label.ytMusic = data.ytMusic || label.ytMusic;
    label.spotify = data.spotify || label.spotify;
    label.appleMusic = data.appleMusic || label.appleMusic;

    const savedLabel = await label.save();

    const profilePicture = formData.get("profilePicture") as File | null;

    const folderName = savedLabel._id;

    if (profilePicture) {

      const buffer = Buffer.from(await profilePicture.arrayBuffer());

      const timestamp = Date.now(); // Current timestamp in milliseconds
      const random = Math.round(Math.random() * 16).toString(4);
      const fileExtension = profilePicture.name.split(".").pop(); // Get file extension
      const profilePictureName = `${data.lablelId}-${timestamp}-${random}.${fileExtension}`;

      const uploadResult = await uploadFileToS3ForUser({
        file: buffer,
        fileName: profilePictureName,
        folderName: folderName as string,
      });

      if (!uploadResult.status) {
        return NextResponse.json({
          status: 500,
          message: "Failed to upload profile picture",
          success: false,
        });
      }
      savedLabel.profilePicture = uploadResult.fileName;
      await savedLabel.save();
    }
    return NextResponse.json({
      status: 200,
      message: "Label details updated successfully",
      success: true,
      data: savedLabel,
    });
  } catch (error) {
    console.error("Error updating label details:", error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while updating label details",
      success: false,
    });
  }
}
