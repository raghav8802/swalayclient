import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import Subscription from "@/models/Subscription";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";


interface TokenPayload {
    id: string;
}

export async function GET(request: NextRequest) {
    await connect()

    try {

        const token = request.cookies.get('token')?.value || '';
        const cookieData = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;
        const userid = cookieData.id;

        const UserData = await Label.findById(userid).select('-password');

        if (!UserData) {

            return NextResponse.json({
                status: 400,
                message: "Invalid User",
                success: false
            })
        }

         // Check subscription availability
         const currentDate = new Date();
         const subscription = await Subscription.findOne({ userId: userid }).sort({ createdAt: -1 });
 
         let subscriptionAvailable = false;
         if (subscription) {
            const { trackCount, endDate } = subscription;
        
            // Check if trackCount is "unlimited"
            const isUnlimited = typeof trackCount === "string" && trackCount.toLowerCase() === "unlimited";
        
            // Check if endDate has exceeded the current date
            const isEndDateValid = new Date(endDate) > currentDate;
        
            // Determine subscriptionAvailable based on the logic
            if (isUnlimited) {
                subscriptionAvailable = isEndDateValid; // true if endDate is valid, false otherwise
            } else {
                subscriptionAvailable = trackCount > 0 && isEndDateValid; // true if trackCount > 0 and endDate is valid
            }
        }
         console.log("Subscription available:", subscriptionAvailable);
            // If the subscription is unlimited, set subscriptionAvailable to true


        //  subscriptionAvailable =  true; // Set to false for testing purposes
         // Add subscriptionAvailable to UserData
        const userResponse = {
            ...UserData.toObject(),
            subscriptionAvailable
        };

        return NextResponse.json({
            status: 200,
            data: userResponse,
            message: "user find successfully",
            success: true
        })


    } catch (error) {
        return NextResponse.json({
            status: 5100,
            message: "Internal Server Error",
            success: false
        })
    }

}







