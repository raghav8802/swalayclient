"use client";
import React, { useContext } from "react";
import Style from "../styles/Home.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeStatsCard from "@/components/HomeStatsCard";
import DashboradSection from "@/components/DashboradSection";
import UserContext from "@/context/userContext";
import SubscriptionEndAlert from "@/components/SubcriptionEndAlert";

const Home = () => {
  const user = useContext(UserContext);
  const subcriptionAvailable = user?.user?.subscriptionAvailable;

  return (
    <div className="min-h-screen bg-white rounded ">
      <HomeStatsCard />
      {!subcriptionAvailable && (
        <div className="mt-4 mb-2">
          <SubscriptionEndAlert />
        </div>
      )}

      <div className={`mt-4  ${Style.toolContainer}`}>
        <DashboradSection />
      </div>
    </div>
  );
};

export default Home;
