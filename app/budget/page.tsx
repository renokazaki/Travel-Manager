import BudgetHeader from "@/components/budget/budget-header";
import BudgetSummary from "@/components/budget/budget-summary";
import CategoryBreakdown from "@/components/budget/category-breakdown";
import ExpenseList from "@/components/budget/expense-list";

export default function BudgetPage() {
  return (
    <div className="container px-4 py-8 md:py-12 max-w-7xl mx-auto pb-24 md:pb-12">
      <BudgetHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        <div className="md:col-span-8 space-y-6">
          <BudgetSummary />
          <CategoryBreakdown />
        </div>
        <div className="md:col-span-4">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}