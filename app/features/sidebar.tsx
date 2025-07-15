"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Users, Clock, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems: NavItem[] = [
    {
      title: "Clients",
      href: "/dashboard",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Time Tracking",
      href: "/dashboard/time-tracking",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: <FileText className="h-5 w-5" />,
    },

  ];

  return (
    <div
      className={cn(
        "relative border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute -right-3 top-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full h-6 w-6 bg-background shadow-md border"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      <ScrollArea className="h-full py-4">
        <div className="space-y-2 px-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-3"
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}