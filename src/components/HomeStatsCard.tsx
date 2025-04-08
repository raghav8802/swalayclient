"use client";

import React, { useContext, useEffect, useState } from "react";
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
        <h1 className={Style.heading}>Welcome, {userName}</h1>
      </div>

      
    </div>
  );
};

export default HomeStatsCard;
