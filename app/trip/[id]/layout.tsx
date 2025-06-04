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
      <div>{children}</div>
    </div>
  );
}
