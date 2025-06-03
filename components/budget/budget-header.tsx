import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Plus,
  Share,
  Settings,
} from "lucide-react";

export default function BudgetHeader() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Summer Trip Budget</h1>
          <p className="text-muted-foreground mt-1">Manage expenses and track spending</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <div className="flex items-center p-4 rounded-lg border bg-card">
          <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Total Budget</p>
            <p className="text-lg font-semibold">$5,000</p>
          </div>
        </div>

        <div className="flex items-center p-4 rounded-lg border bg-card">
          <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Spent So Far</p>
            <p className="text-lg font-semibold">$2,845</p>
          </div>
        </div>

        <Button className="w-full sm:w-auto justify-start sm:justify-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}