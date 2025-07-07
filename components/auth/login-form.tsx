// components/auth/login-form.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Shield, User } from 'lucide-react';

interface LoginFormProps {
  readonly role: 'client' | 'lawyer';
}

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        toast({
          title: 'Login successful',
          description: `Welcome to your ${role === 'lawyer' ? 'lawyer' : 'client'} dashboard`,
        });
        router.push(role === 'lawyer' ? '/dashboard' : '/client-intake');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: 'Please check your credentials and try again',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            {role === 'lawyer' ? (
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            ) : (
              <User className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {role === 'lawyer' ? 'Lawyer Login' : 'Client Login'}
        </CardTitle>
        <CardDescription className="text-center">
          {role === 'lawyer'
            ? 'Access your client management dashboard'
            : 'Login to submit or view your case details'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`email-${role}`}>Email</Label>
            <Input
              id={`email-${role}`}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`password-${role}`}>Password</Label>
            <Input
              id={`password-${role}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
      <div className="p-4 pt-0 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
        <Shield className="h-3 w-3" /> Secure login simulated
      </div>
    </Card>
  );
}
