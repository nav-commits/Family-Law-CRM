import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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

function ClientCard({ client }: Readonly<ClientCardProps>) {
  return (
    <Link href={`/dashboard/clients/${client.id}`} className="block">
      <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          {/* Left side: Avatar + Name + Case Type */}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar>
              <AvatarFallback>
                {client.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-medium truncate">{client.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{client.caseType}</p>
            </div>
          </div>

          {/* Right side: badges and actions */}
          <div className="flex flex-wrap items-center gap-3 justify-end min-w-0">
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="whitespace-nowrap">
              {client.status}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'whitespace-nowrap',
                client.priority === 'high' &&
                  'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
                client.priority === 'medium' &&
                  'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
                client.priority === 'low' &&
                  'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
              )}
            >
              {client.priority}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
              {client.billableHours}h
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
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

export default ClientCard;
