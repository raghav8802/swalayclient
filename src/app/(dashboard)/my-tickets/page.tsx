"use client";

import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  reply: string;
  status: string;
  createdAt: string;
}

export default function MyTickets() {
  const context = useContext(UserContext);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (context?.user?._id) {
          const response = await apiGet(`/api/support/getUserTickets?labelId=${context.user._id}`);
          if (response.success) {
            setTickets(response.data);
          } else {
            setError(response.message);
          }
        }
      } catch (err) {
        setError("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [context?.user?._id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">My Support Tickets</h1>
          <p className="text-muted-foreground">
            View all your support tickets and responses
          </p>
        </div>
        <Link href="/support">
          <Button className="bg-primary hover:bg-primary/90">
            New Ticket
          </Button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p>No support tickets found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{ticket.subject}</span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Your Message:</h3>
                  <p className="text-gray-600">{ticket.message}</p>
                </div>
                {ticket.reply && (
                  <div>
                    <h3 className="font-semibold mb-2">Admin Reply:</h3>
                    <p className="text-gray-600">{ticket.reply}</p>
                  </div>
                )}
                <div className="text-sm text-gray-400">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 