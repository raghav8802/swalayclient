import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import sendMail from "@/helpers/sendMail";
import RegisterEmail from "@/components/Email/RegisterEmail";
import React from "react";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();

    const token = reqBody.token; 

    const user = await Label.findOne({
      verifyCode: token,
      verifyCodeExpiry: { $gt: Date.now() },
    });


    if (!user) {

      return NextResponse.json({
        status: 400,
        message: "Invalid token",
        success: false,
      });

    }

    user.isVerified = true;
    user.verifyCode = "";
    user.verifyCodeExpiry = null;

    await user.save();

    const tokenData = {
      id: user._id,
      username: user.username,
    };

    const authToken = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    
    const email = user.email;

    const emailTemplate = React.createElement(RegisterEmail, {
      clientName: user.username as string,
    });

    await sendMail({
      to: email, // Key 'to' must be specified
      subject: "Welcome to SwaLay Plus - Account Created Successfully", // Key 'subject' must be specified
      emailTemplate, // This passes the rendered template
    });

    const response = NextResponse.json({
      message: "Logged In Success",
      data: user,
      success: true,
      status: 200,
    });

    response.cookies.set("token", authToken, { httpOnly: true });

    return response;
  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
}
