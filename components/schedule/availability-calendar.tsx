"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data for availability
const mockAvailability = {
  "2025-07-15": { available: 3, total: 5 },
  "2025-07-16": { available: 4, total: 5 },
  "2025-07-17": { available: 5, total: 5 },
  "2025-07-18": { available: 5, total: 5 },
  "2025-07-19": { available: 4, total: 5 },
  "2025-07-20": { available: 3, total: 5 },
  "2025-07-21": { available: 2, total: 5 },
  "2025-07-22": { available: 1, total: 5 },
};

export default function AvailabilityCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date("2025-07-15"));
  const [availability, setAvailability] = useState("available");

  // Function to get availability color class based on ratio
  const getAvailabilityColorClass = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const dateData = mockAvailability[dateStr as keyof typeof mockAvailability];
    
    if (!dateData) return "";
    
    const ratio = dateData.available / dateData.total;
    if (ratio === 1) return "bg-green-500/20 hover:bg-green-500/30";
    if (ratio >= 0.7) return "bg-green-400/15 hover:bg-green-400/25";
    if (ratio >= 0.5) return "bg-amber-400/15 hover:bg-amber-400/25";
    if (ratio > 0) return "bg-red-400/15 hover:bg-red-400/25";
    return "";
  };

  return (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">July 2025</h3>
            <div className="flex items-center gap-2">
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Set availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">I'm Available</SelectItem>
                  <SelectItem value="unavailable">I'm Unavailable</SelectItem>
                  <SelectItem value="maybe">Maybe</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="bg-green-500/20">Everyone</Badge>
            <Badge variant="outline" className="bg-green-400/15">Most People</Badge>
            <Badge variant="outline" className="bg-amber-400/15">Some People</Badge>
            <Badge variant="outline" className="bg-red-400/15">Few People</Badge>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day: (date) => cn(getAvailabilityColorClass(date)),
          }}
          defaultMonth={new Date("2025-07-15")}
          components={{
            Day: ({ date, ...props }) => {
              const dateStr = date.toISOString().split("T")[0];
              const dateData = mockAvailability[dateStr as keyof typeof mockAvailability];
              
              return (
                <div {...props} className={cn(props.className)}>
                  <time dateTime={dateStr}>{date.getDate()}</time>
                  {dateData && (
                    <div className="text-[0.625rem] mt-1">
                      {dateData.available}/{dateData.total}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}