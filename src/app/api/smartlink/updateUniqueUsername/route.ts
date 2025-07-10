import Label, { iLabel } from "@/models/Label";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { labelId,uniqueUsername } = await req.json();

    const label = (await Label.findOne({ _id: labelId })) as iLabel;

    if (!label) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Label Not Found",
        },
        {
          status: 404,
        }
      );
    }

    if(label.uniqueUsername === uniqueUsername){
      return NextResponse.json({
        success : false,
        status : 304,
        message : "The username is already set to this value."
      },{
        status : 304
      })
    }

    const existing = await Label.findOne({
      uniqueUsername,
    })

    if(existing){
      return NextResponse.json({
        success : false,
        status : 409,
        message : "Username already exists",
      },{
        status : 409
      })
    }

    
    label.uniqueUsername = uniqueUsername;

    const savedlabel = await label.save();

    return NextResponse.json({
        success : true,
        status : 201,
        message : "Username saved Successfully",
        data : savedlabel.uniqueUsername
    })

  } catch (error) {
    return NextResponse.json({
        success : false,
        status : 500,
        message : "Internal Server Error",
    })
  }
}
