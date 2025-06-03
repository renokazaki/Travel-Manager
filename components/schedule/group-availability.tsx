"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock group members data
const groupMembers = [
  { id: 1, name: "Alex Kim", avatar: "", available: [15, 16, 17, 18, 19, 20, 21, 22] },
  { id: 2, name: "Jamie Chen", avatar: "", available: [15, 16, 17, 18, 19] },
  { id: 3, name: "Taylor Wong", avatar: "", available: [17, 18, 19, 20, 21] },
  { id: 4, name: "Morgan Liu", avatar: "", available: [15, 16, 17, 18, 21, 22] },
  { id: 5, name: "Jordan Park", avatar: "", available: [16, 17, 18, 19, 20] },
];

// Generate dates for the trip
const tripDates = Array.from({ length: 8 }, (_, i) => {
  const date = new Date("2025-07-15");
  date.setDate(date.getDate() + i);
  return {
    day: date.getDate(),
    month: date.toLocaleString('default', { month: 'short' }),
    dateObj: date,
    dayName: date.toLocaleString('default', { weekday: 'short' }),
  };
});

export default function GroupAvailability() {
  // Calculate best dates (where most people are available)
  const dateAvailability = tripDates.map(date => {
    const day = date.day;
    const availableCount = groupMembers.filter(member => 
      member.available.includes(day)
    ).length;
    return { ...date, availableCount };
  });

  const maxAvailable = Math.max(...dateAvailability.map(d => d.availableCount));
  const bestDates = dateAvailability.filter(d => d.availableCount === maxAvailable);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-medium mb-4">Optimal Dates</h3>
          <div className="flex flex-wrap gap-2">
            {bestDates.map((date, i) => (
              <Badge key={i} variant="outline" className="bg-green-500/20 text-foreground">
                {date.dayName}, {date.month} {date.day}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {maxAvailable} out of {groupMembers.length} members available
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[200px_repeat(8,1fr)] border-b">
              <div className="p-4 font-medium">Member</div>
              {tripDates.map((date, i) => (
                <div key={i} className="p-4 text-center border-l">
                  <div className="font-medium">{date.day}</div>
                  <div className="text-xs text-muted-foreground">{date.dayName}</div>
                </div>
              ))}
            </div>

            {groupMembers.map((member, i) => (
              <div key={member.id} className={cn(
                "grid grid-cols-[200px_repeat(8,1fr)]",
                i !== groupMembers.length - 1 && "border-b"
              )}>
                <div className="p-4 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>

                {tripDates.map((date, j) => (
                  <div key={j} className={cn(
                    "p-4 flex items-center justify-center border-l",
                    member.available.includes(date.day) 
                      ? "bg-green-500/10" 
                      : "bg-red-500/10"
                  )}>
                    {member.available.includes(date.day) 
                      ? <div className="h-3 w-3 rounded-full bg-green-500" /> 
                      : <div className="h-3 w-3 rounded-full bg-red-500" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}