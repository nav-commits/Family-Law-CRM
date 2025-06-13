"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Search, MoreHorizontal, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockClients } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ClientList() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter clients based on search query
  const filteredClients = mockClients.filter((client) => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.caseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Clients</CardTitle>
          <Button size="sm">
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
              {filteredClients.filter(client => client.status === 'active').map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="closed" className="m-0">
            <div className="flex-col gap-3 flex">
              {filteredClients.filter(client => client.status === 'closed').map((client) => (
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

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    caseType: string;
    status: string;
    priority: 'high' | 'medium' | 'low';
    lastActivity: string;
    billableHours: number;
  };
}

function ClientCard({ client }: ClientCardProps) {
  return (
    <Link href={`/dashboard/clients/${client.id}`}>
      <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.caseType}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status}
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                client.priority === 'high' && "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
                client.priority === 'medium' && "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
                client.priority === 'low' && "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
              )}
            >
              {client.priority}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {client.billableHours}h
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Client</DropdownMenuItem>
                <DropdownMenuItem>Track Time</DropdownMenuItem>
                <DropdownMenuItem>Generate Invoice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Link>
  );
}