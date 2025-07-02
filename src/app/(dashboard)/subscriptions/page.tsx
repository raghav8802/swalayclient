"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";
import { apiGet } from "@/helpers/axiosRequest";
import UserContext from "@/context/userContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SubscriptionDataTable } from "./components/SubcriptionOrderHistoryDatatable";
import Link from "next/link";
// import toast from "react-hot-toast";

const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isProcessing, setIsProcessing] = useState(false);
  const user = useContext(UserContext);
  const subcriptionAvailable = user?.user?.subscriptionAvailable;

  // console.log('User context:', user);

  const fetchSubscriptionHistory = useCallback(async () => {
    if (!user?.user?._id) return;

    try {
      const response = await apiGet(
        `/api/subscription/order-history?userId=${user.user._id}`
      );

      if (response.success) {
        setSubscriptions(response.data || []);
      } else {
        setError(response.message || "Failed to fetch subscription history");
      }
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      setError("Failed to fetch subscription history");
    } finally {
      setLoading(false);
    }
  }, [user?.user?._id]);

  useEffect(() => {
    fetchSubscriptionHistory();
  }, [fetchSubscriptionHistory]);

  // const handleInsertExistingSubscriptions = async () => {
  //   try {
  //     setIsProcessing(true);
  //     const response = await fetch(
  //       "/api/subscription/insert-existing-subscriptions"
  //     );
  //     const data = await response.json();

  //     if (data.success) {
  //       toast.success(data.message);
  //       // Refresh the subscription list
  //       await fetchSubscriptionHistory();
  //     } else {
  //       toast.error(data.message || "Failed to process existing subscriptions");
  //     }
  //   } catch (error) {
  //     console.error("Error processing existing subscriptions:", error);
  //     toast.error("Failed to process existing subscriptions");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // if (subscriptions.length === 0) {
  //   return <div className="text-center p-4">No subscription history found</div>;
  // }

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Subcriptions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between flex-col md:flex-row md:items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">
          Subscription Order History
        </h3>

        <div className="flex gap-2">
          {/* <Button
            onClick={handleInsertExistingSubscriptions}
            disabled={isProcessing}
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-600"
          >
            {isProcessing ? "Processing..." : "Process Existing Users"}
          </Button> */}

          {user?.user?.subscriptionAvailable !== undefined &&
            !subcriptionAvailable && (
              <Link
                href="/subscriptions/upgrade"
                className="bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded"
              >
                Upgrade Plan
              </Link>
            )}

        </div>
      </div>

      {/* Integrating SubscriptionDataTable */}
      <div className="mt-6">
        {subscriptions.length > 0 && (
          <SubscriptionDataTable data={subscriptions} />
        )}
      </div>
    </div>
  );
};

export default SubscriptionHistory;
