"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ✅ Firebase logout
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function DashboardHeader() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [navValue, setNavValue] = useState<string | undefined>(undefined);

  // ✅ Proper logout logic
  const handleLogout = async () => {
    try {
      await signOut(auth);        // Sign out from Firebase
      router.push("/");           // Redirect to login or landing page
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const onNavigate = (value: string) => {
    setNavValue(value);
    if (value === "clients") router.push("/dashboard");
    else if (value === "cases") router.push("/dashboard");
    else if (value === "documents") router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-background border-b h-16 flex items-center justify-center px-4">
      <div className="flex items-center justify-between max-w-7xl w-full">
        <div className="flex items-center gap-3 md:gap-4">
          <h1 className="text-xl font-bold tracking-tight">Ghankas Law Group Portal</h1>

          <div className="hidden md:flex w-64">
            <Select value={navValue} onValueChange={onNavigate}>
              <SelectTrigger className="bg-muted/40">
                <SelectValue placeholder="Quick navigate..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="cases">Cases</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                  <AvatarFallback>GL</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
