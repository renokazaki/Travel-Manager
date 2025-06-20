import Navigation from "@/components/navigation";

export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <div className="flex-1 md:pl-16 pt-16 md:pt-0">{children}</div>
    </div>
  );
}
