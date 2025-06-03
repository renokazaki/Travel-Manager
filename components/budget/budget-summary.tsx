"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetChart } from "@/components/budget/budget-chart";

export default function BudgetSummary() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="perPerson">Per Person</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accommodation</span>
                <span className="text-sm font-medium">$1,500 / $2,000</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transportation</span>
                <span className="text-sm font-medium">$800 / $1,000</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Food & Dining</span>
                <span className="text-sm font-medium">$300 / $1,000</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Activities</span>
                <span className="text-sm font-medium">$245 / $800</span>
              </div>
              <Progress value={31} className="h-2" />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Miscellaneous</span>
                <span className="text-sm font-medium">$0 / $200</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div className="h-[200px] mt-6">
              <BudgetChart />
            </div>
          </TabsContent>
          
          <TabsContent value="perPerson">
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alex Kim</span>
                  <span className="text-sm font-medium">$845 / $1,000</span>
                </div>
                <Progress value={84.5} className="h-2" />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Jamie Chen</span>
                  <span className="text-sm font-medium">$720 / $1,000</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taylor Wong</span>
                  <span className="text-sm font-medium">$630 / $1,000</span>
                </div>
                <Progress value={63} className="h-2" />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Morgan Liu</span>
                  <span className="text-sm font-medium">$350 / $1,000</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Jordan Park</span>
                  <span className="text-sm font-medium">$300 / $1,000</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}