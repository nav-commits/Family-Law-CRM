"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../hooks/use-auth-redirect"; 
import { ClientList } from "@/components/clients/client-list";

export default function DashboardPage() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);
  if (user === undefined) return null;
  if (user)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-2">
            <ClientList />
          </div>
        </div>
      </div>
    );
  return null;
}
