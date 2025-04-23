"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PlanProps {
  id: number
  name: string
  price: string
  amount: string // Added numeric amount value for Razorpay
  icon: React.ReactNode
  description: string
  features: string[]
  // highlighted: boolean
  buttonText: string
}

interface PricingCardProps {
  plan: PlanProps
  isHovered: boolean
  onSelectPlan: (plan: PlanProps) => void
}

export default function PricingCard({ plan, isHovered, onSelectPlan }: PricingCardProps) {
  const { name, price, icon, description, features, buttonText } = plan

  const handleClick = () => {
    // For "LABEL PARTNER" plan that requires more info, we can add a different action
    if (name === "LABEL PARTNER") {
      window.location.href = "/contact-us"; // Redirect to a contact page
      return;
    }
    onSelectPlan(plan);
  }

  return (
    <motion.div
      className={`relative h-full rounded-3xl p-0.5 
        bg-gradient-to-br from-cyan-500 to-emerald-500`}
      animate={{
        scale: isHovered ? 1.03 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full rounded-[22px] bg-white p-6 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full bg-cyan-400/20`}>{icon}</div>
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
          {price && <div className="text-3xl font-extrabold">{price}</div>}
        </div>

        <p className="text-gray-600 text-sm mb-6 flex-grow">{description}</p>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`mr-2 rounded-full p-1 bg-cyan-400/20 text-cyan-600`}
              >
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className={`w-full py-5 font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white
           `}
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </div>
    </motion.div>
  )
}