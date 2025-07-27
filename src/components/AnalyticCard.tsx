import React from "react";
import Style from "../app/styles/AnalyticCard.module.css";
import { LucideIcon } from "lucide-react";

interface AnalyticCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon; // Lucide-react icon component
  trend?: "up" | "down" | "neutral"; // Optional trend indicator
  iconColor?: string; // Custom icon color
}

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = "#6aff67", // Default purple (tailwind indigo-600)
}) => {
  return (
    <div className={Style.Card}>
      <div className={Style.CardDetails}>
        <p className={`${Style.CardHeader}`}>{title} </p>
        <p className={Style.CardNumber}>{value}</p>
      </div>
      <Icon 
        size={24} 
        className={`me-4 ${Style.CardIcon}`}
        style={{ color: iconColor }} 
      />
    </div>
  );
};

export default AnalyticCard;
