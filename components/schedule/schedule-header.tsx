"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Share, Settings } from "lucide-react";
import { DateRange } from "@/components/ui/date-range";

export default function ScheduleHeader() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Summer Trip 2025</h1>
          <p className="text-muted-foreground mt-1">Coordinate schedules with your group</p>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="outline">
            <Share className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="flex items-center p-4 rounded-lg border bg-card">
          <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Trip Dates</p>
            <p className="text-sm text-muted-foreground">Jul 15 - Jul 22, 2025</p>
          </div>
        </div>

        <div className="flex items-center p-4 rounded-lg border bg-card">
          <Users className="h-5 w-5 mr-3 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Group Members</p>
            <p className="text-sm text-muted-foreground">5 people confirmed</p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto justify-start md:justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Set My Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Your Availability</DialogTitle>
              <DialogDescription>
                Mark the dates you're available for this trip.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <DateRange className="mx-auto" />
            </div>
            <DialogFooter>
              <Button type="submit">Save Availability</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Add missing import
import { Users } from "lucide-react";