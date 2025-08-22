import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, Home, Newspaper, BarChart3, Menu, Flame } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavigationProps {
  user?: {
    streakDays: number;
    username: string;
  };
}

export function Navigation({ user }: NavigationProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/articles", icon: Newspaper, label: "Articles" },
    { path: "/progress", icon: BarChart3, label: "Progress" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <GraduationCap className="text-white text-lg" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">LinguaLearn</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                    <Flame className="text-accent text-sm" />
                    <span className="text-sm font-medium" data-testid="streak-counter">
                      {user.streakDays} day streak
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="mobile-menu-button"
                >
                  <Menu className="text-xl" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-3 py-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex flex-col items-center py-2 transition-colors cursor-pointer",
                    isActive(item.path) ? "text-primary" : "text-gray-600 hover:text-primary"
                  )}
                  data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="text-xl mb-1" />
                  <span className="text-xs">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">LinguaLearn</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "nav-btn transition-colors duration-200 font-medium flex items-center space-x-2 cursor-pointer",
                    isActive(item.path) ? "text-primary" : "text-gray-600 hover:text-primary"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                <Flame className="text-accent text-sm" />
                <span className="text-sm font-medium" data-testid="streak-counter">
                  {user.streakDays} day streak
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
