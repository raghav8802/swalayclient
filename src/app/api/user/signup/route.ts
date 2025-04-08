import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import React from "react";
import Label from "@/models/Label";
import bcryptjs from "bcryptjs";
import sendMail from "@/helpers/sendMail";
import { VerifyEmail } from "@/components/Email/VerifyEmail";



export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();

    const { username, email, password, contact, usertype } = reqBody;

    if (!username || !email || !contact) {

      return NextResponse.json({
        message: "Username, email, and contact are required fields",
        success: false,
        status: 400,
      });

    }

    // Check if the email already exists
    const existingUser = await Label.findOne({ email });
    if (existingUser) {

      return NextResponse.json({
        message: "Email already exists. ",
        success: false,
        status: 400,
      });

    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    let labelType = "normal";
    if (usertype === "label") {
      labelType = "super";
    }

    const newUser = new Label({
      username,
      email,
      contact,
      usertype: labelType,
      // state,
      // razor_contact: razorpayContactId, // Ensure this matches the schema
      // razor_contact: "321320321", // Ensure this matches the schema
      password: hashedPassword,
    });

    const response = await newUser.save();

    // token for email verification
    const hashedToken = await bcryptjs.hash(
      (response as any)._id.toString(),
      12
    );

    await Label.findByIdAndUpdate(response._id, 
        {$set : {verifyCode: hashedToken, verifyCodeExpiry: Date.now() + 3600000}});

    const emailTemplate = React.createElement(VerifyEmail, {
      recipientName: username as string,
      resetLink: `${process.env.NEXT_PUBLIC_BASE_URL}/verifyemail?token=${hashedToken}`,
    });

    await sendMail({
      to: email,
      subject: "Verify your email address",
      emailTemplate,
    });



    return NextResponse.json({
      message: "Account created successfully",
      userData: reqBody,
      success: true,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in API:", error.message);
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}
