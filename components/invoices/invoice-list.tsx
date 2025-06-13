"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, FileText, Calendar, DollarSign, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockInvoices } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function InvoiceList() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter invoices based on search query
  const filteredInvoices = mockInvoices.filter((invoice) => 
    invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>
        <CardDescription>Manage and track client invoices</CardDescription>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search invoices..." 
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
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="m-0">
            <div className="space-y-2">
              {filteredInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="unpaid" className="m-0">
            <div className="space-y-2">
              {filteredInvoices.filter(invoice => invoice.status === 'unpaid').map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="paid" className="m-0">
            <div className="space-y-2">
              {filteredInvoices.filter(invoice => invoice.status === 'paid').map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface InvoiceCardProps {
  invoice: {
    id: string;
    client: string;
    amount: number;
    date: string;
    dueDate: string;
    status: string;
    hours: number;
  };
}

function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{invoice.id}</h3>
            <Badge 
              variant={invoice.status === 'paid' ? 'outline' : 'default'}
              className={cn(
                invoice.status === 'paid' && "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",
                invoice.status === 'unpaid' && "bg-amber-500 hover:bg-amber-500/90"
              )}
            >
              {invoice.status}
            </Badge>
          </div>
          <p className="text-sm font-medium mt-1">{invoice.client}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {invoice.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Due: {invoice.dueDate}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {invoice.hours} hours
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="font-medium">{invoice.amount.toFixed(2)}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Invoice</DropdownMenuItem>
              <DropdownMenuItem>Download PDF</DropdownMenuItem>
              <DropdownMenuItem>Send to Client</DropdownMenuItem>
              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}