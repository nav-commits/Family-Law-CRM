import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientCardProps {
  client: {
    id: string;
    status: string;
    priority?: 'high' | 'medium' | 'low';
    billableHours?: number;
    clientInfo?: {
      name: string;
      email: string;
      phone?: string;
      caseType?: string;
    };
  };
}

function ClientCard({ client }: Readonly<ClientCardProps>) {
  const name = client.clientInfo?.name || 'Unnamed Client';
  const caseType = client.clientInfo?.caseType || 'No Case Type';

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Link href={`/dashboard/clients/${client.id}`} className="block">
      <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          {/* Left: Avatar + Name + Case Type */}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-medium truncate">{name}</h3>
              <p className="text-sm text-muted-foreground truncate">{caseType}</p>
            </div>
          </div>

          {/* Right: Status and Actions */}
          <div className="flex flex-wrap items-center gap-3 justify-end min-w-0">
            <Badge
              variant={client.status === 'active' ? 'default' : 'secondary'}
              className="whitespace-nowrap"
            >
              {client.status}
            </Badge>

            {/* Dropdown Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                {/* <DropdownMenuItem>Edit Client</DropdownMenuItem>
                <DropdownMenuItem>Track Time</DropdownMenuItem>
                <DropdownMenuItem>Generate Invoice</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ClientCard;
