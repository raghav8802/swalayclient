"use client"
import React from "react"
import { Bell, ChevronRight} from "lucide-react"

import Link from "next/link"


export default function SubscriptionEndAlert({handleSubscriptionEndAlert}: {handleSubscriptionEndAlert: () => void}) {
  

  return (
    <div className="relative w-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-4 text-white shadow-md mb-5">
      <div className="mx-auto flex  flex-col items-center justify-between gap-2 sm:flex-row ">
        <div className="flex items-center gap-3  ">
          <Bell className="h-5 w-5" />
          <p className="text-sm font-medium">
            Your subscription has expired. Renew now to continue accessing premium features.
          </p>
        </div>
        <div className="flex items-center gap-2 ">
          <Link
            className="px-3 py-2 flex items-center justify-center bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-700 rounded-md text-sm font-medium shadow-sm transition duration-200 ease-in-out"
            href="/subscriptions/upgrade"
          >
            Renew Now
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link> 
          <button onClick={handleSubscriptionEndAlert}>
            <i className="bi bi-x-lg text-white-500 hover:text-gray-700"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
