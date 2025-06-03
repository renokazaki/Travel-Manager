"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlanPage() {
  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">旅行プラン</h1>
            <p className="text-muted-foreground mt-1">目的地とアクティビティを共同で計画</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            アクティビティを追加
          </Button>
        </div>

        <div className="grid gap-4">
          {[
            {
              day: "1日目",
              activities: [
                { time: "09:00", title: "東京タワー", votes: { up: 4, down: 1 }, priority: "high" },
                { time: "12:00", title: "蔦ラーメン", votes: { up: 5, down: 0 }, priority: "medium" },
                { time: "14:00", title: "原宿散策", votes: { up: 3, down: 2 }, priority: "low" },
              ]
            },
            {
              day: "2日目",
              activities: [
                { time: "10:00", title: "チームラボプラネッツ", votes: { up: 5, down: 0 }, priority: "high" },
                { time: "13:00", title: "寿司作り体験", votes: { up: 4, down: 1 }, priority: "medium" },
                { time: "16:00", title: "銀座ショッピング", votes: { up: 2, down: 3 }, priority: "low" },
              ]
            }
          ].map((day, index) => (
            <Card key={index} className="p-6">
              <h2 className="text-xl font-semibold mb-4">{day.day}</h2>
              <div className="space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-start space-x-4">
                      <div className="text-sm font-medium text-muted-foreground">
                        {activity.time}
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded",
                            activity.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                            activity.priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          )}>
                            {activity.priority === "high" ? "優先度: 高" :
                             activity.priority === "medium" ? "優先度: 中" : "優先度: 低"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {activity.votes.up}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {activity.votes.down}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}