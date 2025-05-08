import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';
import Youtube from '@/models/youtube';
import { connect } from '@/dbConfig/dbConfig';

// Function to extract the YouTube video ID from the provided URL
const extractVideoId = (url: string): string => {
  console.log("Extracting video ID from URL:", url);
  
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([^?]+)/);
    if (match) {
      console.log("Found youtu.be ID:", match[1]);
      return match[1];
    }
  }
  
  // Handle youtube.com format
  if (url.includes('youtube.com')) {
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) {
      console.log("Found youtube.com ID:", match[1]);
      return match[1];
    }
  }
  
  console.log("No video ID found in URL");
  return '';
};

export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { labelId, link } = body;

    console.log("Received link:", link);

    // Extract the video ID from the YouTube URL
    const videoId = extractVideoId(link);

    if (!videoId) {
      return NextResponse.json({ 
        message: "Invalid YouTube link provided. Please provide a valid YouTube URL.",
        success: false,
        status: 400 
      });
    }

    console.log("Extracted video ID:", videoId);

    // Prepare the payload for the SourceAudio API request
    const data = {
      release: [
        {
          type: 'video',
          id: videoId,
        }
      ]
    };

    // Send request to the SourceAudio API
    const apiResponse = await axios.post('https://swadigi.sourceaudio.com/api/contentid/releaseClaim', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SWADIGI_API_KEY}`
      }
    });

    console.log("SourceAudio API response:", apiResponse.data);
    
    // Check if the API response is valid
    if (!apiResponse.data || !Array.isArray(apiResponse.data) || apiResponse.data.length === 0) {
      return NextResponse.json({
        message: "Invalid response from SourceAudio API",
        success: false,
        status: 500
      });
    }

    const status = apiResponse.data[0].success === 1;
      
    // Save the full YouTube URL and other details to the database
    const newYoutube = new Youtube({ labelId, link, status });
    const result = await newYoutube.save();

    // Return a response indicating success
    return NextResponse.json({
      message: status ? "Copyright added and SourceAudio notified" : "Copyright added but SourceAudio notification failed",
      data: {
        databaseResult: result,
        sourceAudioResponse: apiResponse.data
      },
      success: true,
      status: 201
    });

  } catch (error) {
    console.error('Internal server error:', error);

    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        success: false,
        status: 500
      });
    } else {
      return NextResponse.json({
        message: "Something went wrong",
        success: false,
        status: 500
      });
    }
  }
}



