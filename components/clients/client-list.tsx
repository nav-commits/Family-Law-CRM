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
import ClientCard from "./client-card";

import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export function ClientList() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsRef = collection(db, "clients");
        const q = query(clientsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const clientsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || null,
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

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="m-0">
              <div className="flex-col gap-3 flex">
                {filteredClients.filter((c) => c.status === "pending")
                  .length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No pending clients found.
                  </p>
                ) : (
                  filteredClients
                    .filter((client) => client.status === "pending")
                    .map((client) => (
                      <ClientCard key={client.id} client={client} />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="active" className="m-0">
              <div className="flex-col gap-3 flex">
                {filteredClients.filter((c) => c.status === "active").length ===
                0 ? (
                  <p className="text-center text-muted-foreground">
                    No active clients found.
                  </p>
                ) : (
                  filteredClients
                    .filter((client) => client.status === "active")
                    .map((client) => (
                      <ClientCard key={client.id} client={client} />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="closed" className="m-0">
              <div className="flex-col gap-3 flex">
                {filteredClients.filter((c) => c.status === "closed").length ===
                0 ? (
                  <p className="text-center text-muted-foreground">
                    No closed clients found.
                  </p>
                ) : (
                  filteredClients
                    .filter((client) => client.status === "closed")
                    .map((client) => (
                      <ClientCard key={client.id} client={client} />
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="m-0">
              <div className="flex-col gap-3 flex">
                {filteredClients.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No clients found.
                  </p>
                ) : (
                  filteredClients.map((client) => (
                    <ClientCard key={client.id} client={client} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
