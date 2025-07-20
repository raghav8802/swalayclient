"use client";

import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/userContext";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";


interface SupportTicket {
  _id: string;
  ticketId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface SupportReply {
  _id: string;
  supportId: string;
  senderType: 'user' | 'admin';
  senderName: string;
  message: string;
  createdAt: string;
}

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'resolved';

export default function MyTickets() {
  const context = useContext(UserContext);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [replies, setReplies] = useState<{ [key: string]: SupportReply[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());

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

  const loadReplies = async (ticketId: string) => {
    if (replies[ticketId] || loadingReplies.has(ticketId)) return;

    setLoadingReplies(prev => new Set(prev).add(ticketId));
    
    try {
      const replyRes = await apiGet(`/api/support/reply?supportId=${ticketId}`);
      if (replyRes.success) {
        setReplies(prev => ({ ...prev, [ticketId]: replyRes.data }));
      }
    } catch (err) {
      console.error('Error loading replies:', err);
    } finally {
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  const toggleTicketExpansion = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
      // Load replies when expanding
      loadReplies(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  const handleReply = async (ticketId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const response = await apiPost("/api/support/reply", {
        supportId: ticketId,
        senderType: "user",
        senderId: context?.user?._id,
        senderName: context?.user?.username,
        message: replyMessage
      });

      if (response.success) {
        toast.success("Reply sent successfully");
        setReplyMessage("");
        setReplyingTo(null);
        
        // Refresh replies for this ticket
        const replyRes = await apiGet(`/api/support/reply?supportId=${ticketId}`);
        if (replyRes.success) {
          setReplies(prev => ({ ...prev, [ticketId]: replyRes.data }));
        }
      } else {
        toast.error(response.message || "Failed to send reply");
      }
    } catch (err) {
      toast.error("An error occurred while sending reply");
    }
  };

  const canReply = (ticket: SupportTicket, ticketReplies: SupportReply[]) => {
    // Can reply if status is not resolved and there's at least one admin reply
    if (ticket.status === 'resolved') return false;
    
    const hasAdminReply = ticketReplies.some(reply => reply.senderType === 'admin');
    return hasAdminReply;
  };

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return tickets.length;
    return tickets.filter(ticket => ticket.status === status).length;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm">
      <div className="flex justify-between gap-3 flex-col md:flex-row md:items-center mb-4 md:mb-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">My Support Tickets</h1>
          <p className="text-muted-foreground">
            View all your support tickets and responses
          </p>
        </div>
        <Link href="/support">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'in-progress', 'resolved'] as StatusFilter[]).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              className="text-sm"
            >
              {status === 'all' ? 'All' : 
               status === 'pending' ? 'Pending' :
               status === 'in-progress' ? 'In Progress' : 'Resolved'}
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {getStatusCount(status)}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              {statusFilter === 'all' 
                ? 'No support tickets found.' 
                : `No ${statusFilter === 'pending' ? 'pending' : 
                     statusFilter === 'in-progress' ? 'in-progress' : 'resolved'} tickets found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const ticketReplies = replies[ticket._id] || [];
            const canUserReply = canReply(ticket, ticketReplies);
            const isExpanded = expandedTickets.has(ticket._id);
            const isLoadingReplies = loadingReplies.has(ticket._id);
            
            return (
              <Card key={ticket._id}>
                <CardHeader>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm ">
                        Ticket ID: #{ticket.ticketId}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="flex justify-between items-center">
                      <span>{ticket.subject}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTicketExpansion(ticket._id)}
                        className="text-xs"
                      >
                        {isExpanded ? 'Hide' : 'View'} Conversation
                      </Button>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Your Message:</h3>
                    <p className="text-gray-600">{ticket.message}</p>
                  </div>
                  
                  {isExpanded && (
                    <>
                      {isLoadingReplies ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Loading conversation...</p>
                        </div>
                      ) : ticketReplies.length > 0 ? (
                        <div>
                          <h3 className="font-semibold mb-2">Conversation:</h3>
                          <div className="space-y-2">
                            {ticketReplies.map((reply) => (
                              <div key={reply._id} className={reply.senderType === 'admin' ? 'bg-blue-50 p-2 rounded' : 'bg-gray-50 p-2 rounded'}>
                                <span className="font-semibold">{reply.senderName}:</span> {reply.message}
                                <div className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No replies yet.</p>
                        </div>
                      )}
                      
                      {ticket.status === 'resolved' && (
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <p className="text-green-800 font-medium">This ticket has been resolved and is now closed.</p>
                        </div>
                      )}
                      
                      {canUserReply && (
                        <div className="border-t pt-4">
                          {replyingTo === ticket._id ? (
                            <div className="space-y-2">
                              <textarea
                                placeholder="Type your reply..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleReply(ticket._id)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  Send Reply
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyMessage("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => setReplyingTo(ticket._id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Reply to Ticket
                            </Button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="text-sm text-gray-400">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 