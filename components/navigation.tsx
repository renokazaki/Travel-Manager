"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  DollarSign, 
  Map, 
  Clock, 
  Receipt, 
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  ja: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems: NavItem[] = [
    {
      title: "Schedule",
      ja: "スケジュール",
      href: "/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Budget",
      ja: "予算",
      href: "/budget",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Plan",
      ja: "プラン",
      href: "/plan",
      icon: <Map className="h-5 w-5" />,
    },
    {
      title: "Timeline",
      ja: "タイムライン",
      href: "/timeline",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Settlement",
      ja: "精算",
      href: "/settlement",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Profile",
      ja: "プロフィール",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 px-4">
        <div className="flex items-center justify-between h-full">
          <h1 className="font-semibold">TripTogether</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-2 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-muted",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.icon}
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.ja}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <div className={cn(
      "fixed top-0 left-0 h-screen bg-background border-r border-border pt-20 transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-[-20px] top-8 bg-background border border-border rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      <div className="flex flex-col space-y-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-muted",
              pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            {item.icon}
            {isOpen && (
              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.ja}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}