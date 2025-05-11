"use client";

import React, { useContext, useEffect, useState } from "react";
import { Sparkles, Music, Globe, Zap, Package } from "lucide-react";

/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    Razorpay: any;
  }
}
/* eslint-enable no-unused-vars */


import Script from "next/script";
import { apiPost } from "@/helpers/axiosRequest";
import UserContext from "@/context/userContext";
import SubscriptionCard from "./components/SubscriptionCard";
import toast from "react-hot-toast";

function Payment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [amount, setAmount] = useState("0");
  
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const context = useContext(UserContext);
  const subcriptionAvailable = context?.user?.subscriptionAvailable;

  useEffect(() => {
    const username = context?.user?.username || "";
    const userEmail = context?.user?.email || "";

    console.log("User Context:", context?.user);

    setName(username);
    setEmail(userEmail);
  }, [context]);

  if (subcriptionAvailable === undefined) {
    return null; // Wait until context is loaded
  }

  if (subcriptionAvailable) {
    window.location.href = "/subscriptions";
    return null; // Prevent rendering the page during redirection
  }

  // Plans with numeric amount values for Razorpay processing

  const plans = [
    {
      id: 1,
      name: "Basic Plan",
      provider: "Per Track / Lifetime",
      logo: "/placeholder.svg?height=40&width=40",
      price: "99",
      amount: "99",
      trackCount: "1",
      icon: <Music className="h-5 w-5" />,
      description: "Perfect for independent artists starting their journey",
      cycle: "lifetime",
      startDate: new Date(2024, 3, 28),
      endDate: null,
      status: "active",
      features: [
        "Distribution on: Spotify, iTunes/Apple Music, Amazon Music, YouTube C.I.D., Instagram, Facebook",
        "Earn 80% lifetime royalties",
        "Worldwide Music Distribution",
        "Global Monetization (Social + Streaming)",
        "YouTube Content ID Protection",
        "100% Copyright Ownership",
        "One-time Fee, Lifetime Royalty Reporting",
        "Fast Delivery to Stores",
      ],
      color: "bg-gradient-to-r from-blue-400 to-indigo-500",
      paymentMethod: "One-time Payment",
      autoRenew: false,
      isLabel: false,
      buttonText: "Get Started",
    },
    {
      id: 3,
      name: "Basic Plus Plan",
      provider: "Per Track / Lifetime",
      logo: "/placeholder.svg?height=40&width=40",
      price: "199",
      amount: "199",
      trackCount: "1",
      icon: <Zap className="h-5 w-5" />,
      description: "Enhanced distribution with caller tune integration",
      cycle: "lifetime",
      startDate: new Date(2024, 3, 28),
      endDate: null,
      status: "active",
      features: [
        "Caller Tune Distribution: Airtel, Jio, Vi, BSNL",
        "Distribution to 50+ Global Platforms",
        "Earn 80% lifetime royalties",
        "Worldwide Release and Monetization",
        "YouTube Content ID",
        "Presence on Instagram Reels, Facebook, WhatsApp, Snap",
        "One-time Fee, Lifetime Reporting",
        "Faster Delivery to Stores",
      ],
      color: "bg-gradient-to-r from-purple-400 to-pink-500",
      paymentMethod: "One-time Payment",
      autoRenew: false,
      isLabel: false,
      buttonText: "Get Started",
    },
    {
      id: 4,
      name: "Pro Plan",
      provider: "Per Track / Lifetime",
      logo: "/placeholder.svg?height=40&width=40",
      price: "359",
      amount: "359",
      trackCount: "1",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Professional features with priority support",
      cycle: "lifetime",
      startDate: new Date(2024, 3, 28),
      endDate: null,
      status: "active",
      features: [
        "Distribution to 50+ International Platforms",
        "All Major Indian Platforms: JioSaavn, Gaana, Vi Music",
        "Airtel, Jio, Vi, BSNL Caller Tunes",
        "YouTube Content ID + Global Monetization",
        "Earn 85% lifetime royalties",
        "100% Copyright Ownership",
        "Song Available on Facebook, Reels, WhatsApp, and Snap",
        "Priority Delivery",
        "Social Media Monetization (IG/FB)",
        "Music Profile Linking (Instagram & Facebook)",
        "Premium News Features (Selected Artists)",
        "Publishing and copyright protection",
        "Add Multiple Artists to Songs",
        "Priority Response within 48 hours",
      ],
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      paymentMethod: "One-time Payment",
      autoRenew: false,
      isLabel: false,
      buttonText: "Go Pro",
    },
    {
      id: 5,
      name: "All-In-One Plan",
      provider: "Per Track / Lifetime",
      logo: "/placeholder.svg?height=40&width=40",
      price: "599",
      amount: "599",
      trackCount: "1",
      icon: <Package className="h-5 w-5" />,
      description:
        "Complete solution with maximum benefits and priority features",
      cycle: "lifetime",
      startDate: new Date(2024, 3, 28),
      endDate: null,
      status: "active",
      features: [
        "Distribution on 50+ Global + Indian Platforms",
        "Can release Album/E.P/Single all together",
        "Airtel, Jio, Vi, BSNL Caller Tune Setup",
        "Global and Social Media Monetization",
        "YouTube Content ID Protection",
        "Earn 90% lifetime royalties",
        "100% Copyright Ownership",
        "Fastest Priority Delivery",
        "Instagram, Facebook, WhatsApp Publishing",
        "Social Media Monetization (IG/FB)",
        "Music Profile Verification Assistance",
        "Music Linking with IG & FB Profiles",
        "Premium News Features + Interviews",
        "Add Multiple Artists to One Release",
        "Lyrics Distribution (Depend on platform)",
        "Publishing & copyright Protection Services",
        "Priority Support within 48 hours",
      ],
      color: "bg-gradient-to-r from-green-400 to-emerald-500",
      paymentMethod: "One-time Payment",
      autoRenew: false,
      isLabel: false,
      buttonText: "Get Started",
    },
    {
      id: 6,
      name: "LABEL PARTNER",
      provider: "Per Track / Lifetime",
      logo: "/placeholder.svg?height=40&width=40",
      price: "899",
      amount: "899",
      trackCount: "unlimited",
      icon: <Globe className="h-5 w-5" />,
      description:
        "Are you a record label/company or a music band? Join SwaLay as a Label Partner and release unlimited tracks and unlimited artists at no extra cost.",
      cycle: "lifetime",
      startDate: new Date(2024, 3, 28),
      endDate: null,
      status: "active",
      features: [
        "Distribution on 50+ Global + Indian Platforms",
        "Can release Album/E.P/Single all together",
        "Airtel, Jio, Vi, BSNL Caller Tune Setup",
        "Global and Social Media Monetization",
        "YouTube Content ID Protection",
        "Earn 90% lifetime royalties",
        "100% Copyright Ownership",
        "Fastest Priority Delivery",
        "Instagram, Facebook, WhatsApp Publishing",
        "Social Media Monetization (IG/FB)",
        "Music Profile Verification Assistance",
        "Music Linking with IG & FB Profiles",
        "Premium News Features + Interviews",
        "Add Multiple Artists to One Release",
        "Lyrics Distribution (Depend on platform)",
        "Publishing & copyright Protection Services",
        "Priority Support within 48 hours",
      ],
      color: "bg-gradient-to-r from-purple-500 to-indigo-500",
      paymentMethod: "One-time Payment",
      autoRenew: false,
      isLabel: false,
      buttonText: "Get Ultimate Access",
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
    trackCount?: string; // Added trackCount property
  }

  // Razorpay order creation function

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
        amount: parseFloat(plan?.amount || "0") * 100 * 1.18, // Add 18% GST
        currency: "INR",
        planName: plan?.name || selectedPlan?.name || "",
      });

      const response = await apiPost("/api/subscription/create-order", {
        amount: parseFloat(plan?.amount || "0") * 100 * 1.18, // Add 18% GST
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
        throw new Error(
          "Razorpay key ID is not defined in environment variables."
        );
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
              trackCount: plan.trackCount,
            },
            userDetails: {
              userId: context?.user?._id,
              name,
              email,
            },
          };

          try {
            const result = await apiPost("/api/subscription/verify", data);

            if (result.isOk) {
              toast.success(
                "Payment successful! Your subscription is now active."
              );
              // Optional: Redirect to a success page or dashboard
              window.location.href = "/subscriptions";
            } else {
              alert(`Payment verification failed: ${result.message}`);
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert(
              "There was an issue verifying your payment. Please contact support."
            );
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

      paymentObject.on(
        "payment.failed",
        function (response: { error: { description: string } }) {
          alert(`Payment failed: ${response.error.description}`);
        }
      );

      paymentObject.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setLoading(false);
      console.log(loading)
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* <div className="container mx-auto px-4 py-20">
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
                // onSelectPlan={handlePlanSelectionAndPayment}
                onSelectPlan={()=>{}}
              />
            </motion.div>
          ))}
        </div>
      </div> */}

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Choose Your Distribution Plan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Start your music journey with our flexible distribution plans
            </p>
          </div>

          {!context?.user && (
            <div className="flex justify-center items-center h-full p-4">
              <p className="text-center">Loading plans...</p>
            </div>
          )}

          {/* Filter plans based on usertype */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {!context?.user ? (
              <div></div>
            ) : context.user.usertype === "super" ? (
              plans
                .filter((plan) => plan.name === "LABEL PARTNER")
                .map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    isPopular={plan.name === "Pro Plan"}
                    onSelectPlan={handlePlanSelectionAndPayment}
                  />
                ))
            ) : (
              plans.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  isPopular={plan.name === "Pro Plan"}
                  onSelectPlan={handlePlanSelectionAndPayment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
