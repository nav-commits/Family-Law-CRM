"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClients } from "../../lib/mock-data";
import ClientCard from "./client-card";
import ClientModal from "./client-modal";

export function ClientList() {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new client
  const [newClient, setNewClient] = useState<{
    name: string;
    email: string;
    phone: string;
    caseType: string;
    status: string;
    priority: "low" | "medium" | "high";
    billableHours: number;
  }>({
    name: "",
    email: "",
    phone: "",
    caseType: "",
    status: "",
    priority: "medium",
    billableHours: 0,
  });

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: name === "billableHours" ? Number(value) : value,
    }));
  }

  function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    //  mock adding clients later will add to real database
    const id = (clients.length + 1).toString();
    const clientToAdd = {
      id,
      lastActivity: "Just now",
      ...newClient,
    };
    setClients((prev) => [...prev, clientToAdd]);
    setIsModalOpen(false);

    // Reset form
    setNewClient({
      name: "",
      email: "",
      phone: "",
      caseType: "",
      status: "active",
      priority: "medium",
      billableHours: 0,
    });
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>Clients</CardTitle>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
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
      {/* Modal */}
      {isModalOpen && (
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          newClient={newClient}
          onInputChange={handleInputChange}
          onSubmit={handleAddClient}
        />
      )}
    </>
  );
}
