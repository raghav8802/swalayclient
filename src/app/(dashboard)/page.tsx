"use client";
import React from "react";
import DashboradSection from "@/components/DashboradSection";
import HomeStatsCard from "@/components/HomeStatsCard";
import SubscriptionEndAlert from "@/components/SubcriptionEndAlert";
import UserContext from "@/context/userContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useContext, useRef } from "react";
import Style from "../styles/Home.module.css";

const Home = () => {
  const subscriptionEndDivRef = useRef<HTMLDivElement>(null);

  const handleSubscriptionEndAlert = () => {
    if (subscriptionEndDivRef.current) {
      subscriptionEndDivRef.current.style.display = "none";
    }
  };
  

  const user = useContext(UserContext);
  const subcriptionAvailable = user?.user?.subscriptionAvailable;

  return (
    <div className="min-h-screen  rounded ">
      <HomeStatsCard />
      
{/* <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
        <p className="text-sm">
          Your subscription details have been updated. If you experience any issues, please do not hesitate to contact us. We are here to assist you.
        </p>
      </div> */}

      {user?.user?.subscriptionAvailable !== undefined &&
        !subcriptionAvailable && (
          <div className="mt-4 mb-2" ref={subscriptionEndDivRef}>
            <SubscriptionEndAlert handleSubscriptionEndAlert={handleSubscriptionEndAlert}/>
          </div>
        )}

      <div className={`mt-4  ${Style.toolContainer}`}>
        <DashboradSection />
      </div>
    </div>
  );
};

export default Home;
