'use client'
import { useState } from "react";
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
import { mockClients } from "../../lib/mock-data";
import ClientCard from "./client-card";

export function ClientList() {
  const [clients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseType.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Cases</TabsTrigger>
            <TabsTrigger value="closed">Closed Cases</TabsTrigger>
            <TabsTrigger value="all">All Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="m-0">
            <div className="flex-col gap-3 flex">
              {filteredClients
                .filter((client) => client.status === "active")
                .map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="m-0">
            <div className="flex-col gap-3 flex">
              {filteredClients
                .filter((client) => client.status === "closed")
                .map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="m-0">
            <div className="flex-col gap-3 flex">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
