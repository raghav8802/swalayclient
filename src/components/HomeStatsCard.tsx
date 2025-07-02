"use client";

import React, { useContext } from "react";
import Style from "../app/styles/HomeStatsCard.module.css";

import UserContext from "@/context/userContext";

const HomeStatsCard = () => {
  const context = useContext(UserContext);
  
  // const labelId = context?.user?._id;
  
  // let userName = context?.user?.username || "Guest";
  let userName = "";
  if (context?.user?.usertype === "super") {
    userName = context?.user?.lable || context?.user?.username;
  } else if (context?.user?.usertype === "normal") {
    userName = context?.user?.username || "Guest";
  }



  return (
    <div className={Style.statsContainer}>
      <div className={Style.greetContainer}>
        <div className={Style.heading}>
          <span>Welcome, </span>
          <span>{userName}</span>
          </div>
      </div>

      
    </div>
  );
};

export default HomeStatsCard;
