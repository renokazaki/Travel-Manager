import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Compass, Users, CalendarCheck, DollarSign, Receipt } from "lucide-react";
import FeatureCard from "@/components/feature-card";

export default function Home() {
  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4 pt-8 md:pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            TripTogether
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Coordinate travel plans, manage budgets, and split expenses with ease
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link 
            href="/schedule" 
            className={buttonVariants({ 
              size: "lg", 
              className: "rounded-full font-medium"
            })}
          >
            Get Started
          </Link>
          <Link 
            href="/demo" 
            className={buttonVariants({ 
              size: "lg", 
              variant: "outline", 
              className: "rounded-full font-medium"
            })}
          >
            View Demo
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        <FeatureCard
          icon={<CalendarCheck className="h-10 w-10 text-blue-500" />}
          title="Schedule Coordination"
          description="Find the perfect dates for your trip with our visual calendar and availability highlighting."
        />
        <FeatureCard
          icon={<DollarSign className="h-10 w-10 text-green-500" />}
          title="Budget Management"
          description="Track expenses by category and visualize spending across your group."
        />
        <FeatureCard
          icon={<Compass className="h-10 w-10 text-amber-500" />}
          title="Plan Editing"
          description="Collaborate on destinations and activities with priority setting and voting."
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-purple-500" />}
          title="Group Timeline"
          description="Visualize your entire trip timeline and make adjustments with drag-and-drop ease."
        />
        <FeatureCard
          icon={<Receipt className="h-10 w-10 text-rose-500" />}
          title="Settlement"
          description="Record expenses and automatically calculate splits for hassle-free payments."
        />
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 rounded-lg p-6 border border-border flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Plan?</h3>
          <p className="text-muted-foreground mb-4">Start coordinating your perfect group trip today</p>
          <Link 
            href="/schedule" 
            className={buttonVariants({ 
              variant: "default", 
              className: "rounded-full font-medium"
            })}
          >
            Create Trip
          </Link>
        </div>
      </div>
    </div>
  );
}