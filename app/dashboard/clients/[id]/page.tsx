import { mockClients } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientPageProps {
  params: {
    id: string;
  };
}

export default function ClientPage({ params }: ClientPageProps) {
  const client = mockClients.find((c) => c.id === params.id);

  if (!client) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Client not found</h1>
        <p>No client matches the provided ID.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card >
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{client.name}</CardTitle>
            <CardDescription>{client.caseType}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
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
