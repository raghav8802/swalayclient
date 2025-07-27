import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import UserProvider from "@/context/UserProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

import Favicon from "/public/favicon.ico";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swalay",
  description: "India's First All-In-One Music Distribution Solution",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`dashboardBody ${inter.className} dark:bg-gray-900 dark:text-white`}
      >
        <UserProvider>
          <Navbar />

          {/* <main style={{ padding: "1rem", minHeight: "80vh" }}> */}
          {/* <main style={{ padding: "0.5rem", minHeight: "80vh" }}> */}
          <main style={{ minHeight: "80vh" }} className="rootLayoutMain">
            {/* <section style={{ border: "2px solid green" }}> */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 5000,
              }}
            />
            <section>{children}</section>
          </main>

          <div style={{ padding: "1rem" }}>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
