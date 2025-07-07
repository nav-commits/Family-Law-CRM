"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import { db } from "@/lib/firebase"; // your Firebase config
import { doc, getDoc } from "firebase/firestore";

interface ClientPageProps {
  params: {
    id: string;
  };
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  caseType: string;
  status: string;
  priority: string;
  billableHours?: number;
  lastActivity?: string;
  // add any other fields you expect
}

export default function ClientPage({ params }: ClientPageProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, "clients", params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Client not found");
          setClient(null);
        } else {
          const data = docSnap.data();

          // Convert Firestore timestamp fields to desired formats if needed
          // e.g. lastActivity, billableHours, createdAt if applicable
          setClient({
            id: docSnap.id,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            caseType: data.caseType || "",
            status: data.status || "unknown",
            priority: data.priority || "low",
            billableHours: data.billableHours || 0,
            lastActivity: data.lastActivity || "N/A",
          });
        }
      } catch (err) {
        console.error("Failed to fetch client:", err);
        setError("Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  if (loading) {
    return <div className="p-6 text-center">Loading client data...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">{error}</h1>
        <p>No client matches the provided ID.</p>
      </div>
    );
  }

  if (!client) {
    return null; // should never reach here because error covers no client case
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {client.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{client.name}</CardTitle>
            <CardDescription>{client.caseType}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Badge variant={client.status === "active" ? "default" : "secondary"}>
              {client.status}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                client.priority === "high" &&
                  "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
                client.priority === "medium" &&
                  "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
                client.priority === "low" &&
                  "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
              )}
            >
              {client.priority}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {client.billableHours}h
            </div>
          </div>

          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Email:</span> {client.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {client.phone}
            </p>
            <p>
              <span className="font-medium">Last Activity:</span> {client.lastActivity}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
