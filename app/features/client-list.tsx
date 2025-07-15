"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientCard from "../features/client-card";

import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { ClientData } from "@/types/client-data";

export function ClientList() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsRef = collection(db, "clients");
        const q = query(clientsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const clientsData: ClientData[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(data.createdAt),
          };
        });

        setClients(clientsData);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.clientInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = ["pending", "active", "closed"];

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle>Clients</CardTitle>
        <CardDescription>Manage your client cases</CardDescription>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading clients...
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-4 flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              {tabs.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Clients */}
            <TabsContent value="all">
              <div className="flex-col gap-3 flex">
                {filteredClients.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No clients found.
                  </p>
                ) : (
                  filteredClients
                    .filter((client) => client.id !== undefined)
                    .map((client) => (
                      <ClientCard
                        key={client.id!}
                        client={client as ClientData & { id: string }}
                      />
                    ))
                )}
              </div>
            </TabsContent>

            {/* Filtered Tabs */}
            {tabs.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="flex-col gap-3 flex">
                  {filteredClients.filter((c) => c.status === tab).length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No {tab} clients found.
                    </p>
                  ) : (
                    filteredClients
                      .filter(
                        (client) => client.status === tab && client.id !== undefined
                      )
                      .map((client) => (
                        <ClientCard
                          key={client.id!}
                          client={client as ClientData & { id: string }}
                        />
                      ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
