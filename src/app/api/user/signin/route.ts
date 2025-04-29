import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import Subscription from "@/models/Subscription";


export async function POST(request: NextRequest) {
    
    await connect();

    try {
        const reqBody = await request.json();
        
        const { email, password } = reqBody;

        // Validate and format email address
        if (!email || !email.includes('@') || !email.includes('.')) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "Invalid email format"
            });
        }

        const user = await Label.findOne({ email });
        if (!user) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "User doesn't exist"
            });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "Check your credentials"
            });
        }

         // Check subscription availability
         const currentDate = new Date();
         const subscription = await Subscription.findOne({ userId: user._id }).sort({ createdAt: -1 });
 
         let subscriptionAvailable = false;
         if (subscription) {
             const { trackCount, endDate } = subscription;
             subscriptionAvailable = trackCount.toLowerCase() !== 'unlimited' && new Date(endDate) > currentDate;
         }

        const tokenData = {
            id: user._id,
            username: user.username,
            subscriptionAvailable: subscriptionAvailable,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });


        const response = NextResponse.json({
            message: "Logged In Success",
            data: user,
            success: true,
            status: 200
        });

        response.cookies.set("token", token, { httpOnly: true });

        return response;

    } catch (error: any) {
        console.log("error :: ");
        console.log(error);
        
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        });
    }
}
