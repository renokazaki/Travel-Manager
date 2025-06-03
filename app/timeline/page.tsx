"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState([
    {
      id: "day-1",
      date: "7月15日",
      events: [
        { id: "1-1", time: "09:00", title: "東京タワー", location: "港区", duration: "2時間", attendees: 5 },
        { id: "1-2", time: "12:00", title: "蔦ラーメン", location: "新宿", duration: "1時間", attendees: 5 },
        { id: "1-3", time: "14:00", title: "原宿", location: "渋谷", duration: "3時間", attendees: 5 },
      ]
    },
    {
      id: "day-2",
      date: "7月16日",
      events: [
        { id: "2-1", time: "10:00", title: "チームラボ", location: "江東区", duration: "2時間", attendees: 5 },
        { id: "2-2", time: "13:00", title: "寿司体験", location: "築地", duration: "2時間", attendees: 4 },
        { id: "2-3", time: "16:00", title: "銀座", location: "銀座", duration: "2時間", attendees: 3 },
      ]
    }
  ]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDay = timelineData.find(day => day.id === source.droppableId);
    const destDay = timelineData.find(day => day.id === destination.droppableId);

    if (!sourceDay || !destDay) return;

    const newTimelineData = [...timelineData];
    const sourceIndex = timelineData.findIndex(day => day.id === source.droppableId);
    const destIndex = timelineData.findIndex(day => day.id === destination.droppableId);

    if (source.droppableId === destination.droppableId) {
      const newEvents = Array.from(sourceDay.events);
      const [removed] = newEvents.splice(source.index, 1);
      newEvents.splice(destination.index, 0, removed);
      newTimelineData[sourceIndex] = { ...sourceDay, events: newEvents };
    } else {
      const sourceEvents = Array.from(sourceDay.events);
      const destEvents = Array.from(destDay.events);
      const [removed] = sourceEvents.splice(source.index, 1);
      destEvents.splice(destination.index, 0, removed);
      newTimelineData[sourceIndex] = { ...sourceDay, events: sourceEvents };
      newTimelineData[destIndex] = { ...destDay, events: destEvents };
    }

    setTimelineData(newTimelineData);
  };

  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">旅程表</h1>
            <p className="text-muted-foreground mt-1">旅行スケジュールの可視化</p>
          </div>
          <Button variant="outline">時間調整</Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-8">
            {timelineData.map((day) => (
              <div key={day.id}>
                <h2 className="text-xl font-semibold mb-4">{day.date}</h2>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[27px] w-px bg-border" />
                  <Droppable droppableId={day.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-6"
                      >
                        {day.events.map((event, index) => (
                          <Draggable key={event.id} draggableId={event.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative flex gap-4"
                              >
                                <div className="w-14 text-sm font-medium text-muted-foreground pt-3">
                                  {event.time}
                                </div>
                                <div className="absolute left-[27px] top-[18px] w-2 h-2 rounded-full bg-primary" />
                                <Card className="flex-1 p-4">
                                  <h3 className="font-medium">{event.title}</h3>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {event.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {event.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {event.attendees}人参加
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}