
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";


interface SubscriptionCardProps {
  plan: {
    name: string;
    provider: string;
    description: string;
    price: string;
    features: string[];
    color: string;
    buttonText: string;
    icon: React.ReactNode;
    isLabel?: boolean;
  };
  isPopular?: boolean;
  isLabel?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelectPlan: (plan: any) => void;
}

const SubscriptionCard = ({ plan, isPopular, onSelectPlan  }: SubscriptionCardProps) => {
  return (
    <div className={cn(
      "relative group rounded-2xl p-0.5 transition-all duration-300 hover:scale-105",
      plan.color
    )}>
      <div className="relative h-full rounded-2xl bg-white/95 p-6 backdrop-blur-sm dark:bg-black/80 flex flex-col justify-between">

      <div >

        {isPopular && (
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1">
            <p className="text-sm font-medium text-white">Most Popular</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.provider}</p>
          </div>
          <div className={cn("p-2 rounded-xl text-white", plan.color)}>
            {plan.icon}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>

        <div className="mt-4 flex items-baseline text-3xl font-bold">
          ₹{plan.price}
          <span className="ml-1 text-sm font-medium text-muted-foreground"> {plan.isLabel? "/Year" : "/Track"} </span>
        </div>

        <ul className="mt-6 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex text-sm">
              <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
          <li className="flex text-sm">
            <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
            <span>18% GST applicable</span>
          </li>
        </ul>

      </div>

        <Button 
          className={cn(
            "mt-8 w-full text-white py-6 font-semibold text-lg ",
            plan.color,
            "hover:opacity-90 transition-opacity"
          )}
          onClick={() => onSelectPlan(plan)}
        >
          {plan.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;