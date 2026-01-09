"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sun,
  Moon,
  Type,
  LogIn,
  UserPlus,
  LayoutDashboard,
  FileText,
  Link as LinkIcon,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAppDispatch,
  useAppSelector,
  setTheme,
  toggleDyslexiaMode,
  selectTheme,
  selectDyslexiaMode,
} from "@/lib/stores";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/utils/constants";

const navLinks = [
  { href: ROUTES.SIMPLIFY_TEXT, label: "Simplify Text", icon: FileText },
  { href: ROUTES.SIMPLIFY_URL, label: "Simplify URL", icon: LinkIcon },
  { href: ROUTES.ABOUT, label: "About", icon: Info },
];

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export function Navbar({ isAuthenticated = false, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);

  const handleThemeToggle = () => {
    const themes = ["normal", "dark", "high-contrast", "cream"] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    dispatch(setTheme(themes[nextIndex]));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-xl"
        >
          <span className="text-primary">Clarity</span>
          <span className="text-muted-foreground">Web</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Accessibility Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Accessibility options"
              >
                <Type className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleThemeToggle}>
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                Theme: {theme}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => dispatch(toggleDyslexiaMode())}>
                <Type className="mr-2 h-4 w-4" />
                Dyslexia Mode: {dyslexiaMode ? "On" : "Off"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth buttons */}
          {isAuthenticated ? (
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="default" size="sm" className="hidden md:flex">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button variant="default" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  {userName && (
                    <p className="text-sm text-muted-foreground px-2">
                      Welcome, {userName}
                    </p>
                  )}
                  <Link href={ROUTES.DASHBOARD}>
                    <Button variant="default" className="w-full">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN}>
                    <Button variant="outline" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER}>
                    <Button variant="default" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
