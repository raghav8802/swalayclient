import { uploadFileToS3ForUser } from "@/dbConfig/uploadFileToS3";
import Label from "@/models/Label";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const data = {
      labelId: formData.get("labelId")?.toString() ?? "",
      profilePicture: (formData.get("profilePicture") as File) ?? null,
    };

    const label = await Label.findOne({ _id: data.labelId });

    if (!label) {
      return NextResponse.json(
        {
          status: 404,
          message: "Label not found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    const folderName = label._id;

    const buffer = Buffer.from(await data.profilePicture.arrayBuffer());

    const timestamp = Date.now(); // Current timestamp in milliseconds
    const random = Math.round(Math.random() * 16).toString(4);
    const fileExtension = data.profilePicture.name.split(".").pop(); // Get file extension
    const profilePictureName = `${data.labelId}-${timestamp}-${random}.${fileExtension}`;

    const uploadResult = await uploadFileToS3ForUser({
      file: buffer,
      fileName: profilePictureName,
      folderName: folderName as string,
    });

    label.profilePicture = uploadResult.fileName;
    await label.save();

    if (!uploadResult.status) {
      return NextResponse.json(
        {
          status: 500,
          message: "Failed to upload profile picture",
          success: false,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Label details updated successfully",
      success: true,
      data: label,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      success: false,
    });
  }
} 