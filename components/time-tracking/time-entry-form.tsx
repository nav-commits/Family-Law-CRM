"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClients } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export function TimeEntryForm() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [billable, setBillable] = useState(true);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!client || !description || !hours || !date) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill out all required fields",
      });
      return;
    }
    
    // In a real app, this would send the data to your backend
    toast({
      title: "Time entry added",
      description: `Added ${hours} hours for ${client}`,
    });
    
    // Reset the form
    setDescription('');
    setHours('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Time Entry</CardTitle>
        <CardDescription>Record time spent on client matters</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the work performed..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Hours</Label>
            <Input 
              id="hours" 
              type="number" 
              step="0.25" 
              min="0.25" 
              placeholder="0.00"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="billable" 
              checked={billable}
              onCheckedChange={setBillable}
            />
            <Label htmlFor="billable">Billable</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save Time Entry</Button>
        </CardFooter>
      </form>
    </Card>
  );
}