import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lableId = req.nextUrl.searchParams.get("lableId");

  if (!lableId) {
    return NextResponse.json({
      status: 400,
      message: "Lable ID is missing",
      success: false,
    });
  }

  try {
    // Connect to the database
    await connect();

    // Fetch label details based on the label ID
    const labelDetails = await Label.findOne({ _id: lableId })
      .select("-__v -createdAt -updatedAt")
      .sort({ _id: -1 });

    if (!labelDetails) {
      return NextResponse.json({
        status: 404,
        message: "No label found for the given ID",
        success: false,
      });
    }
    

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Label details found",
      data: labelDetails,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
      success: false,
    });
  }
}
