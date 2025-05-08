"use client";

import React, { useState, useEffect, useContext } from 'react';
import { apiGet } from '@/helpers/axiosRequest';
import UserContext from '@/context/userContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SubscriptionDataTable } from './components/SubcriptionOrderHistoryDatatable';



const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useContext(UserContext);
  console.log('User context:', user);

  useEffect(() => {
    const fetchSubscriptionHistory = async () => {
      if (!user?.user?._id) return;
      
      try {
        const response = await apiGet(`/api/subscription/order-history?userId=${user.user._id}`);
       console.log('Subscription history response:', response);
        if (response.success) {
          setSubscriptions(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch subscription history');
        }
      } catch (error) {
        console.error('Error fetching subscription history:', error);
        setError('Failed to fetch subscription history');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionHistory();
  }, [user?.user?._id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (subscriptions.length === 0) {
    return <div className="text-center p-4">No subscription history found</div>;
  }

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

    <div className="flex justify-between items-center mt-3">
      <h3 className="text-3xl font-bold mb-2 text-blue-500">
        Subscription Order History
      </h3>

      <Button >New Copyrights</Button>
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