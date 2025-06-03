"use client";

import ScheduleHeader from "@/components/schedule/schedule-header";
import AvailabilityCalendar from "@/components/schedule/availability-calendar";
import GroupAvailability from "@/components/schedule/group-availability";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SchedulePage() {
  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <ScheduleHeader />
      
      <Tabs defaultValue="calendar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="calendar">カレンダー表示</TabsTrigger>
          <TabsTrigger value="group">グループ予定</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          <AvailabilityCalendar />
        </TabsContent>
        
        <TabsContent value="group" className="mt-0">
          <GroupAvailability />
        </TabsContent>
      </Tabs>
    </div>
  );
}