"use client";

import { useContext, useEffect, useState } from "react";
import {
  Sparkles,
  Music,
  Globe,
  Zap,
  Users,
  Building,
  Layers,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}
import Script from "next/script";
import { apiPost } from "@/helpers/axiosRequest";
import PricingCard from "./components/PricingCard";
import UserContext from "@/context/userContext";

function Payment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const context = useContext(UserContext);
  // console.log("User Context:", context);

  useEffect(() => {
    // Check if user context is available and has the _id property
    const labelId = context?.user?._id || "";
    const username = context?.user?.username || "";
    const userEmail = context?.user?.email || "";
    const usertype = context?.user?.usertype || "";

    console.log("User Context:", context?.user);

    setName(username);
    setEmail(userEmail);
  }, [context]);

  // Plans with numeric amount values for Razorpay processing
  const plans = [
    {
      id: 1,
      name: "BASIC",
      price: "₹99",
      amount: "99",
      icon: <Music className="h-6 w-6" />,
      description:
        "Best for independent artists, start your music career and get your music to major music platforms and more included",
      features: [
        "Major music platforms",
        "Basic analytics",
        "Standard support",
      ],
      buttonText: "GET STARTED",
    },
    {
      id: 2,
      name: "INDIAN+",
      price: "₹129",
      amount: "129",
      icon: <Sparkles className="h-6 w-6" />,
      description:
        "Get your music distributed to major Indian music platforms with caller tunes and more included",
      features: ["All Indian platforms", "Caller tunes", "Priority support"],

      buttonText: "GET STARTED",
    },
    {
      id: 3,
      name: "BASIC+",
      price: "₹199",
      amount: "199",
      icon: <Globe className="h-6 w-6" />,
      description:
        "Get your music distributed to international and Indian music platforms with caller tunes and more included",
      features: [
        "Global + Indian platforms",
        "Caller tunes",
        "Enhanced analytics",
      ],
      buttonText: "GET STARTED",
    },
    {
      id: 4,
      name: "PRO",
      price: "₹359",
      amount: "359",
      icon: <Zap className="h-6 w-6" />,
      description:
        "Get your music distributed to all global music platforms with caller tunes, social media promo assistance, profile linking, and more included",
      features: [
        "All global platforms",
        "Social media promo",
        "Profile linking",
        "Premium support",
      ],
      buttonText: "GET STARTED",
    },
    {
      id: 5,
      name: "ALL-IN-ONE",
      price: "₹599",
      amount: "599",
      icon: <Package className="h-6 w-6" />,
      description:
        "Complete pack to get your music on all music platforms with caller tunes, promotion, profile linking, lyrics distribution, and more included",
      features: [
        "Everything in PRO",
        "Lyrics distribution",
        "Marketing tools",
        "Priority releases",
      ],
      buttonText: "GET STARTED",
    },
    {
      id: 6,
      name: "LABEL PARTNER",
      price: "",
      amount: "0", // Amount will be determined after discussion
      icon: <Users className="h-6 w-6" />,
      description:
        "Are you a record label/company or a distributor? Join SwayLay as a Label Partner and release unlimited tracks and unlimited artists at no extra cost",
      features: [
        "Unlimited tracks",
        "Unlimited artists",
        "Custom dashboard",
        "Dedicated manager",
      ],
      buttonText: "KNOW MORE",
    },
  ];

  interface Plan {
    id: number;
    name: string;
    price: string;
    amount: string;
    icon: React.ReactNode;
    description: string;
    features: string[];
    buttonText: string;
  }


  const createOrderId = async (plan?: Plan) => {
    setLoading(true);
    try {
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error(
          "Razorpay key ID is not defined in environment variables."
        );
      }
  
      console.log("creating order ...");
      console.log({
        amount: parseFloat(plan?.amount || "0") * 100, // Use plan.amount directly
        currency: "INR",
        planName: plan?.name || selectedPlan?.name || "",
      });
  
      const response = await apiPost("/api/order/create-order", {
        amount: parseFloat(plan?.amount || "0") * 100, // Use plan.amount directly
        currency: "INR",
        planName: plan?.name || selectedPlan?.name || "",
        username: name,
      });
  
      if (!response.sucess) {
        throw new Error(response.message || "Failed to create order");
      }
  
      return response.orderId;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelectionAndPayment = async (plan: Plan) => {
    console.log("Selected plan:", plan);
    console.log("Selected plan amount:", plan.amount);
  
    // Update state for selected plan
    setSelectedPlan(plan);
  
    // Validate user details
    if (!name.trim() || !email.trim()) {
      alert("Please fill in your name and email");
      return;
    }
  
    try {
      setLoading(true);
  
      // Create order ID with the correct amount
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Razorpay key ID is not defined in environment variables.");
      }
  
      console.log("Creating order...");
      const orderId = await createOrderId(plan); // Pass the plan directly
  
      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(plan.amount) * 100, // Convert to paise
        currency: "INR",
        name: "SwaLay",
        description: `${plan.name} Subscription`,
        order_id: orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            planDetails: {
              name: plan.name,
              price: plan.price,
              features: plan.features,
              planId: plan.id.toString(),
            },
            userDetails: {
              userId: context?.user?._id,
              name,
              email,
            },
          };
  
          try {
            const result = await apiPost("/api/order/verify", data);
  
            if (result.isOk) {
              alert("Payment successful! Your subscription is now active.");
              // Optional: Redirect to a success page or dashboard
              // window.location.href = "/dashboard";
            } else {
              alert(`Payment verification failed: ${result.message}`);
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert("There was an issue verifying your payment. Please contact support.");
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        notes: {
          userName: name,
          userEmail: email,
          userType: context?.user?.usertype,
          planName: plan.name,
          planId: plan.id.toString(),
        },
        theme: {
          color: "#42c5be",
        },
      };
  
      // Open Razorpay payment modal
      const paymentObject = new window.Razorpay(options);
  
      paymentObject.on("payment.failed", function (response: { error: { description: string } }) {
        alert(`Payment failed: ${response.error.description}`);
      });
  
      paymentObject.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
            Choose Your Vibe
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
            Level up your music career with distribution packages that hit
            different
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: plan.id * 0.1 }}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="h-full"
            >
              <PricingCard
                plan={plan}
                isHovered={hoveredCard === plan.id}
                onSelectPlan={handlePlanSelectionAndPayment}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checkout Dialog */}
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              {selectedPlan &&
                `You're purchasing the ${selectedPlan.name} plan for ${selectedPlan.price}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={processPayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}
    </>
  );
}

export default Payment;
