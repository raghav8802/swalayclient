import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/Label";

connect();

export async function PUT(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { labelId, newLabelName } = reqBody;

    if (!labelId || !newLabelName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Only allow updates for specific users
    if (labelId === "6784b1d257ce42ea2334c86a" || labelId === "67b6538359d0d433931d1d8c") {
      const user = await User.findByIdAndUpdate(
        labelId,
        { lable: newLabelName },
        { new: true }
      );
  
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "Label name updated successfully",
        success: true,
        data: user,
      });
    }

    return NextResponse.json(
      { error: "Not authorized to update label name" },
      { status: 403 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
