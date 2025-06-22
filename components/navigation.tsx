"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  Map,
  Clock,
  Receipt,
  Home,
  Menu,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SignedIn, UserButton } from "@clerk/nextjs";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  ja: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const params = useParams();
  const tripId = params?.id as string;

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 動的ルーティング対応のナビゲーションアイテム
  const getNavItems = (): NavItem[] => {
    // 旅行詳細ページの場合
    if (tripId) {
      return [
        {
          title: "Overview",
          ja: "概要",
          href: `/trip/${tripId}`,
          icon: <Home className="h-5 w-5" />,
        },
        {
          title: "Coordination",
          ja: "日程調整",
          href: `/trip/${tripId}/coordination`,
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: "Schedule",
          ja: "スケジュール",
          href: `/trip/${tripId}/schedule`,
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: "Settlement",
          ja: "精算",
          href: `/trip/${tripId}/settlement`,
          icon: <Receipt className="h-5 w-5" />,
        },
        {
          title: "Back",
          ja: "戻る",
          href: `/home`,
          icon: <ArrowLeft className="h-5 w-5" />,
        },
      ];
    }

    // トップレベルページの場合
    return [
      {
        title: "Dashboard",
        ja: "ダッシュボード",
        href: "/",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "My Trip",
        ja: "マイ旅行",
        href: "/home",
        icon: <Map className="h-5 w-5" />,
      },
    ];
  };

  const navItems = getNavItems();

  // アクティブなパスかどうかを判定
  const isActivePath = (href: string) => {
    if (href === pathname) return true;

    // 旅行概要ページの場合、正確な一致をチェック
    if (tripId && href === `/trip/${tripId}`) {
      return pathname === `/trip/${tripId}`;
    }

    return false;
  };

  // モバイルナビゲーション
  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 px-4">
        <div className="flex items-center justify-between h-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 flex flex-col"
            >
              <SheetTitle>Navigation</SheetTitle>
              <div className="flex flex-col space-y-2 mt-6 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-muted/50",
                      isActivePath(item.href)
                        ? "bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/50 dark:to-teal-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "p-1.5 rounded-md",
                        isActivePath(item.href)
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                          : "bg-muted/50"
                      )}
                    >
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.ja}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex justify-end">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>
    );
  }

  // デスクトップナビゲーション
  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen bg-background/80 backdrop-blur-md border-r border-border pt-6 transition-all duration-300 z-40",
        isOpen ? "w-72" : "w-16"
      )}
    >
      {/* 折りたたみボタン */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-[-16px] top-14 bg-background border border-border rounded-full h-8 w-8 shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* ナビゲーションメニュー */}
      <nav className="flex flex-col justify-center  space-y-2 px-3">
        <div className="flex items-center justify-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg transition-all duration-200 hover:bg-muted/50",
              isActivePath(item.href) ? "..." : "...",
              isOpen ? "space-x-3 px-3 py-3" : "justify-center py-3" // ← この部分を追加
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isActivePath(item.href)
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-muted/50 group-hover:bg-muted"
              )}
            >
              {item.icon}
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-medium text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.ja}</span>
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* 旅行情報表示（旅行詳細ページの場合） */}
      {tripId && isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground mb-1">現在の旅行</p>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              旅行ID: {tripId}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
