"use client"

import { useState } from "react"
import { Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PricingDashboard() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-background">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Music Distribution Plans</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Choose the perfect plan to distribute your music and grow your audience
        </p>

        <Tabs defaultValue="monthly" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")}>
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" onClick={() => setBillingCycle("yearly")}>
              Yearly <Badge className="ml-2 bg-primary/20 text-primary">Save 20%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* BASIC Plan */}
        <Card className="flex flex-col border-2 border-border">
          <CardHeader>
            <CardTitle className="text-xl">BASIC</CardTitle>
            <CardDescription>For independent artists starting out</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹99</span>
              <span className="text-muted-foreground ml-1">{billingCycle === "monthly" ? "/month" : "/year"}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Start your music career and get your music to major music platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Basic distribution to popular platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Keep 100% of your rights</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">GET STARTED</Button>
          </CardFooter>
        </Card>

        {/* INDIAN+ Plan */}
        <Card className="flex flex-col border-2 border-teal-500 relative">
          <Badge className="absolute -top-3 right-4 bg-teal-500 text-white">POPULAR</Badge>
          <CardHeader>
            <CardTitle className="text-xl">INDIAN+</CardTitle>
            <CardDescription>For artists targeting Indian platforms</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹129</span>
              <span className="text-muted-foreground ml-1">{billingCycle === "monthly" ? "/month" : "/year"}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Get your music distributed to major Indian music platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Caller tunes included</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Indian platform optimization</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-teal-500 hover:bg-teal-600">GET STARTED</Button>
          </CardFooter>
        </Card>

        {/* BASIC+ Plan */}
        <Card className="flex flex-col border-2 border-border">
          <CardHeader>
            <CardTitle className="text-xl">BASIC+</CardTitle>
            <CardDescription>For international distribution</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹199</span>
              <span className="text-muted-foreground ml-1">{billingCycle === "monthly" ? "/month" : "/year"}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Get your music distributed to international and Indian music platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Caller tunes included</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Wider global reach</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">GET STARTED</Button>
          </CardFooter>
        </Card>

        {/* PRO Plan */}
        <Card className="flex flex-col border-2 border-border">
          <CardHeader>
            <CardTitle className="text-xl">PRO</CardTitle>
            <CardDescription>For serious artists and professionals</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹359</span>
              <span className="text-muted-foreground ml-1">{billingCycle === "monthly" ? "/month" : "/year"}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Get your music distributed to all global music platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Caller tunes, social media promo assistance</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-primary" />
                <span>Profile linking and more included</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">GET STARTED</Button>
          </CardFooter>
        </Card>

        {/* ALL-IN-ONE Plan */}
        <Card className="flex flex-col border-2 border-teal-500 relative">
          <Badge className="absolute -top-3 right-4 bg-teal-500 text-white">BEST VALUE</Badge>
          <CardHeader>
            <CardTitle className="text-xl">ALL-IN-ONE</CardTitle>
            <CardDescription>Complete music distribution package</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">₹599</span>
              <span className="text-muted-foreground ml-1">{billingCycle === "monthly" ? "/month" : "/year"}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Complete pack to get your music on all music platforms</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Caller tunes, promotion, profile linking</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Lyrics distribution and more included</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-teal-500 hover:bg-teal-600">GET STARTED</Button>
          </CardFooter>
        </Card>

        {/* LABEL PARTNER Plan */}
        <Card className="flex flex-col border-2 border-border bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl">LABEL PARTNER</CardTitle>
            <CardDescription className="text-slate-300">For record labels and companies</CardDescription>
            <div className="mt-4 flex items-center">
              <span className="text-2xl font-bold">Custom Pricing</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">More info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Contact us for custom pricing based on your label's needs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Join Swalay as a Label Partner</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>Release unlimited tracks and unlimited artists</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-teal-500" />
                <span>No extra cost for additional releases</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              KNOW MORE
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Need help choosing the right plan?{" "}
          <a href="#" className="text-primary underline">
            Contact our team
          </a>
        </p>
      </div>
    </div>
  )
}
