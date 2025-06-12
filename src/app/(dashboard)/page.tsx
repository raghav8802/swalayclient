"use client";
import React, { useContext, useRef, useState } from "react";
import Style from "../styles/Home.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeStatsCard from "@/components/HomeStatsCard";
import DashboradSection from "@/components/DashboradSection";
import UserContext from "@/context/userContext";
import SubscriptionEndAlert from "@/components/SubcriptionEndAlert";

const Home = () => {
  const [subscriptionAlert, setSubscriptionAlert] = useState(true);
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
      
<<<<<<< HEAD
      {
        subscriptionAlert && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4 flex items-center justify-between" role="alert">
          <p className="text-sm">
            Your subscription details have been updated. If you experience any issues, please do not hesitate to contact us. We are here to assist you.
          </p>
          <button className="self-start" onClick={() => setSubscriptionAlert(false)}>
            <i className="bi bi-x-lg text-gray-500 hover:text-gray-700"></i>
          </button>
        </div>
        )
      }
=======
      {/* <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
        <p className="text-sm">
          Your subscription details have been updated. If you experience any issues, please do not hesitate to contact us. We are here to assist you.
        </p>
      </div> */}
>>>>>>> bcf5eef83c9b25db947e99763314290732fc5f54

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
