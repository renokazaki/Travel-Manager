"use client";

import { Input } from "@/components/ui/input";
import { useDeferredValue, useTransition } from "react";

export function SearchInput() {
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (value: string) => {
    startTransition(() => {
      // 検索ロジックをここに実装
      console.log("Searching for:", value);
    });
  };

  return (
    <Input 
      placeholder="旅行や友達を検索..." 
      className="pl-10" 
      onChange={(e) => handleSearch(e.target.value)}
      disabled={isPending}
    />
  );
}