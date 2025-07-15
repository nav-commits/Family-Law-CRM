"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use-auth-redirect";
import { ClientList } from "../features/client-list";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const user = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const id = change.doc.id;

          if (id !== lastNotificationId) {
            setLastNotificationId(id);

            toast({
              title: "📩 New Client Added",
              description: data.message || "A new client intake was submitted.",
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, toast, lastNotificationId]);

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
