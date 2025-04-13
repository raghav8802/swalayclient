"use client";
import { apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";



const Page = () => {

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setToken(searchParams.get("token"));
  }, []);

  const router = useRouter();

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onVerify = async () => {
    setIsLoading(true);
    try {
      const response = await apiPost("/api/user/verifyemail", { token });

      toast.success("Email verified successfully!");

      if (!response.success) {
        setError(true);
      } else {
        router.push("/signin");
      }
    
    } catch (err) {
      console.error("Error verifying token:", err);
      toast.error("Internal server error");
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">

            <div
              className="flex flex-col items-center justify-center min-h-[400px] mx-auto mt-5 mb-5"
            >

             <div style={{ width: "30%" }} className="mx-auto mt-5 mb-2 min-h-[100px]">
                <Image
                    src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png"
                    alt="SwaLay Banner"
                    width={100}
                    height={100}
                    style={{ width: "100%", height: "auto", display: "block", }}
                />
                </div>

              <Image
                src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/loading.gif"
                width={100}
                height={100}
                alt="Loading"
                style={{  marginTop: "20px"}}
              />

            </div>
          </div>
        ) : (
          <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
            <div style={{ width: "30%" }} className="mx-auto mt-5 mb-2 ">
              <Image
                src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png"
                alt="SwaLay Banner"
                width={100}
                height={100}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {error ? (
              <Card className="w-full max-w-md p-6 space-y-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-red-600">
                    Oops, Invalid URL
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    The URL you tried to access is not valid. Please check the
                    URL and try again.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => router.push("/")}>
                    Go to Homepage
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="p-6 sm:p-8">
                  <div className="flex justify-center mb-6">
                    <div className="bg-blue-50 rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Verify Your Email
                  </h1>

                  <p className="text-gray-600 text-center mb-8">
                    Click the button below to verify your identity and continue.
                  </p>

                  <div className="flex justify-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
                      onClick={onVerify}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
