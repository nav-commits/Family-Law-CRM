"use client";

import { useAuth } from "../../../../hooks/use-auth-redirect";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ClientPageProps {
  params: {
    id: string;
  };
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  caseType: string;
  description: string;
  dateOfBirth?: string;
  address?: string;
  contactMethod?: string;
  maritalStatus?: string;
  children?: string;
  employment?: string;
  income?: string;
  hasLawyer?: string;
  status: string;
  priority: string;
  billableHours?: number;
  lastActivity?: string;
  notes?: string;
  files?: { name: string; url: string }[];
}

export default function ClientPage({ params }: ClientPageProps) {
  const user = useAuth();
  const router = useRouter();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Client | null>(null);
  const { toast } = useToast();

   // Redirect if not authenticated
   useEffect(() => {
    if (user === null) {
      router.replace("/"); // or "/" depending on your app
    }
  }, [user, router]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "clients", params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Client not found");
          setClient(null);
        } else {
          const data = docSnap.data();
          const clientData: Client = {
            id: docSnap.id,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            caseType: data.caseType || "",
            description: data.description || "",
            dateOfBirth: data.dateOfBirth || "",
            address: data.address || "",
            contactMethod: data.contactMethod || "",
            maritalStatus: data.maritalStatus || "",
            children: data.children || "",
            employment: data.employment || "",
            income: data.income || "",
            hasLawyer: data.hasLawyer || "",
            status: data.status || "unknown",
            priority: data.priority || "low",
            billableHours: data.billableHours || 0,
            lastActivity: data.lastActivity || "N/A",
            notes: data.notes || "",
            files: data.files || [],
          };
          setClient(clientData);
          setFormData(clientData);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch client:", err);
        setError("Failed to fetch client data");
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await updateDoc(doc(db, "clients", params.id), {
        ...formData,
        lastActivity: Timestamp.now().toDate().toISOString(),
      });
      setClient(formData);
      toast({ title: "Success", description: "Client data updated" });
      setEditMode(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update client data",
      });
      console.error(error);
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading client data...</div>;
  if (error || !client)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">{error || "Client not found"}</h1>
        <p>No client matches the provided ID.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{client.name}</CardTitle>
            <CardDescription>{client.caseType}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-3 flex-wrap">
            <Badge
              variant={client.status === "active" ? "default" : "secondary"}
            >
              {client.status}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                client.priority === "high" &&
                  "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
                client.priority === "medium" &&
                  "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
                client.priority === "low" &&
                  "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
              )}
            >
              {client.priority}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {client.billableHours}h
            </div>
          </div>

          {/* Editable fields */}
          {editMode ? (
            <>
              {[
                "email",
                "phone",
                "dateOfBirth",
                "address",
                "contactMethod",
                "maritalStatus",
                "children",
                "employment",
                "income",
                "hasLawyer",
              ].map((field) => (
                <div className="space-y-2" key={field}>
                  <label className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <Input
                    name={field}
                    value={(formData as any)[field] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label className="font-medium">Case Details</label>
                <Textarea
                  name="description"
                  value={formData?.description || ""}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Lawyer Notes</label>
                <Textarea
                  name="notes"
                  value={formData?.notes || ""}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone}</p>
              <p><strong>Date of Birth:</strong> {client.dateOfBirth}</p>
              <p><strong>Address:</strong> {client.address}</p>
              <p><strong>Preferred Contact:</strong> {client.contactMethod}</p>
              <p><strong>Marital Status:</strong> {client.maritalStatus}</p>
              <p><strong>Children:</strong> {client.children}</p>
              <p><strong>Employment:</strong> {client.employment}</p>
              <p><strong>Income:</strong> {client.income}</p>
              <p><strong>Had Lawyer Before:</strong> {client.hasLawyer}</p>
              <p><strong>Case Details:</strong> {client.description}</p>
              <p><strong>Lawyer Notes:</strong> {client.notes || "No notes yet."}</p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 justify-end">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(client);
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)}>Edit Client</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
