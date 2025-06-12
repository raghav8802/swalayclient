import React from "react";
import Style from "../app/styles/AnalyticCard.module.css";

interface AnalyticCardProps {
  title: string;
  value: string | number;
  icon: string; // Dynamic icon from react-icons
  trend?: "up" | "down" | "neutral"; // Optional trend indicator
  iconColor?: string; // Custom icon color
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  value,
  icon,
  iconColor = "#6aff67", // Default purple (tailwind indigo-600)
}) => {
  return (
    <div className={Style.Card}>
      <div className={Style.CardDetails}>
        <p className={`${Style.CardHeader}`}>{title} </p>
        <p className={Style.CardNumber}>{value}</p>
      </div>
      {/* <i className={`bi bi-arrow-up-right-circle-fill me-4 ${Style.CardIcon}`}></i> */}
      <i className={`${icon} me-4 ${Style.CardIcon} `} 
        style={{ color: iconColor }} 
      ></i>
    </div>
  );
};

export default AnalyticCard;
