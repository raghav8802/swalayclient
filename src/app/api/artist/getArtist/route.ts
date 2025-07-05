import { connect } from "@/dbConfig/dbConfig";
import Artist from "@/models/Artists";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const lableId = req.nextUrl.searchParams.get("lableId");

    if(!lableId){
        return NextResponse.json({
            status: 400,
            message: "Lable ID is missing",
            success: false
        })
    }

    try {
        // Connect to the database
        await connect();

        // Fetch artists based on the label ID
        const artist = await Artist.findOne({ labelId: lableId })
            .select('_id artistName isSinger isLyricist isComposer isProducer')
            .sort({ _id: -1 });

        if (!artist) {
            return NextResponse.json({
                status: 404,
                message: "No artist found for the given label ID",
                success: false
            });
        }

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Artist found",
            artist : artist
        })
        

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error.message, success: false });
    }
}
    