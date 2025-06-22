// components/home/create-trip-button.tsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { CreateTripForm } from "./create-trip-form";

interface CreateTripButtonProps {
  children: React.ReactNode;
}

export function CreateTripButton({ children }: CreateTripButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>新しい旅行を計画</DialogTitle>
          <DialogDescription>
            旅行の詳細を入力して、一緒に行く友達を選択してください。
          </DialogDescription>
        </DialogHeader>
        {/* <CreateTripForm /> */}
      </DialogContent>
    </Dialog>
  );
}