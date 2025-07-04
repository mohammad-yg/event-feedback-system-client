'use client';

import {
  Home,
  Calendar,
  Settings,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { Skeleton } from "src/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "src/components/ui/sheet";

export const Header = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto sm:px-6">
        {/* Mobile Menu Button (Only visible on small screens) */}
        <div className="flex md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetTitle className="sr-only">menu</SheetTitle>
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-6 pt-6 ps-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/events"
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5" />
                    Events
                  </Link>
                </div>
                <div className="m-5">
                  {session && (
                    <Button
                      variant="outline"
                      className="justify-start gap-3 text-lg h-12 text-red-400 border-red-400"
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo (Centered on mobile) */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link href="/" className="font-bold text-lg">
            Event Feedback System
          </Link>
        </div>

        {/* Desktop Navigation (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/events"
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </Link>
        </nav>

        {/* User Avatar and Auth Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : session ? (
            <>
              {/* Desktop Dropdown */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image || undefined}
                          alt={session.user.email ?? "User"}
                        />
                        <AvatarFallback>
                          {session.user.email
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || session.user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile - Simple Sign Out Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
                <span className="sr-only sm:not-sr-only">Sign in</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
