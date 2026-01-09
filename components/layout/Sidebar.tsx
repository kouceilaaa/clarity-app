"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useAppDispatch,
  useAppSelector,
  toggleSidebar,
  selectSidebarOpen,
} from "@/lib/stores";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/utils/constants";
import { logoutUser } from "@/lib/actions";

const mainNavItems = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
];

const userNavItems = [
  {
    title: "History",
    href: ROUTES.HISTORY,
    icon: History,
  },
  {
    title: "Favorites",
    href: ROUTES.FAVORITES,
    icon: Star,
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Toggle button */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
                  {sidebarOpen && <span>{item.title}</span>}
                </Button>
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          {/* User Navigation */}
          <div className="space-y-1">
            {userNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
                  {sidebarOpen && <span>{item.title}</span>}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>

        {/* User info and logout */}
        <div className="border-t p-3">
          {sidebarOpen && userName && (
            <div className="mb-2 px-2">
              <p className="text-sm font-medium truncate">{userName}</p>
              {userEmail && (
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </p>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
              !sidebarOpen && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
