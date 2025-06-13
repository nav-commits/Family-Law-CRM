"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, Clock, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTimeEntries } from '@/lib/mock-data';

export function TimeEntryList() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter time entries based on search query
  const filteredEntries = mockTimeEntries.filter((entry) => 
    entry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Time Entries</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </div>
        </div>
        <CardDescription>Track and manage your billable hours</CardDescription>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search entries..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="billable">Billable</TabsTrigger>
            <TabsTrigger value="non-billable">Non-Billable</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="m-0">
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <TimeEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="billable" className="m-0">
            <div className="space-y-2">
              {filteredEntries.filter(entry => entry.billable).map((entry) => (
                <TimeEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="non-billable" className="m-0">
            <div className="space-y-2">
              {filteredEntries.filter(entry => !entry.billable).map((entry) => (
                <TimeEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface TimeEntryCardProps {
  entry: {
    id: string;
    client: string;
    description: string;
    date: string;
    hours: number;
    billable: boolean;
    rate: number;
  };
}

function TimeEntryCard({ entry }: TimeEntryCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{entry.client}</h3>
            {entry.billable && (
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
                Billable
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{entry.description}</p>
          <p className="text-xs text-muted-foreground mt-2">{entry.date}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="font-medium">{entry.hours} hrs</span>
            </div>
            {entry.billable && (
              <div className="flex items-center justify-end text-muted-foreground text-sm">
                <DollarSign className="h-3 w-3 mr-1" />
                {(entry.hours * entry.rate).toFixed(2)}
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Entry</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Add to Invoice</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}