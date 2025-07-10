"use client";

import { useAuth } from "../../../../hooks/use-auth-redirect";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ClientData } from "@/types/client-data";

interface ClientPageProps {
  params: {
    id: string;
  };
}

function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : ""), obj);
}

function setNestedValue(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let nested = obj;
  for (const key of keys) {
    if (!(key in nested)) nested[key] = {};
    nested = nested[key];
  }
  nested[lastKey] = value;
}

export default function ClientPage({ params }: ClientPageProps) {
  const user = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ClientData | null>(null);

  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchClient() {
      try {
        setLoading(true);
        const docRef = doc(db, "clients", params.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Client not found");
          setClient(null);
          setFormData(null);
        } else {
          const data = docSnap.data();
          const clientData = { id: docSnap.id, ...data } as ClientData;
          setClient(clientData);
          setFormData(clientData);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch client data");
        setClient(null);
        setFormData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    const newFormData = JSON.parse(JSON.stringify(formData));
    setNestedValue(newFormData, name, value);
    setFormData(newFormData);
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const updateData = { ...formData };
      delete updateData.id;

      await updateDoc(doc(db, "clients", params.id), {
        ...updateData,
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

  const fields = [
    "clientInfo.howHeard",
    "clientInfo.name",
    "clientInfo.dateOfBirth",
    "clientInfo.placeOfBirth",
    "clientInfo.citizenship",
    "clientInfo.surnameAtBirth",
    "clientInfo.arrivedInBC",
    "clientInfo.usCitizen",
    "clientInfo.address",
    "clientInfo.mailingAddress",
    "clientInfo.home",
    "clientInfo.work",
    "clientInfo.mobile",
    "clientInfo.email",
    "clientInfo.occupation",
    "clientInfo.employer",
    "clientInfo.annualIncome",
    "clientInfo.otherIncome",
    "adverseParty.name",
    "adverseParty.surnameAtBirth",
    "adverseParty.otherNames",
    "adverseParty.dateOfBirth",
    "adverseParty.placeOfBirth",
    "adverseParty.address",
    "adverseParty.arrivedInBC",
    "adverseParty.occupation",
    "adverseParty.employer",
    "adverseParty.income",
    "adverseParty.otherIncome",
    "adverseParty.lawyer.name",
    "adverseParty.lawyer.firm",
    "adverseParty.lawyer.address",
    "adverseParty.lawyer.phone",
    "adverseParty.lawyer.fax",
    "adverseParty.lawyer.email",
    "relationship.cohabitationDate",
    "relationship.marriageDate",
    "relationship.marriagePlace",
    "relationship.separationDate",
    "relationship.hasAgreement",
    "relationship.divorced",
    "relationship.hasMarriageCertificate",
    "children.details",
    "children.custodySought",
    "children.custodyTerms",
    "assets.summary",
    "assets.rrsp",
    "assets.privatePensions",
    "assets.investments",
    "assets.businessInterests",
    "assets.automobiles",
    "assets.debts",
    "notes",
  ];

  const textareaFields = new Set([
    "clientInfo.otherIncome",
    "adverseParty.otherIncome",
    "children.custodyTerms",
    "children.details",
    "assets.summary",
    "notes",
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {client.clientInfo.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{client.clientInfo.name}</CardTitle>
            <div className="flex gap-3 flex-wrap mt-1">
              <Badge
                variant={client.status === "pending" ? "secondary" : "default"}
              >
                {client.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {client.priority || "low"}
              </Badge>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-3 w-3 mr-1" />
                {client.billableHours ?? 0}h
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {editMode ? (
            <>
              {/* Editable Status */}
              <div className="space-y-1">
                <label htmlFor="status" className="font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full border border-input bg-background p-2 rounded-md"
                  value={formData?.status || "pending"}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev ? { ...prev, status: e.target.value as ClientData["status"] } : prev
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* All other fields */}
              {fields.map((field) => (
                <div key={field} className="space-y-1">
                  <label htmlFor={field} className="font-medium capitalize">
                    {field
                      .split(".")
                      .slice(-1)[0]
                      .replace(/([A-Z])/g, " $1")
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  {textareaFields.has(field) ? (
                    <Textarea
                      id={field}
                      name={field}
                      value={getNestedValue(formData, field) || ""}
                      onChange={handleChange}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={field}
                      name={field}
                      value={getNestedValue(formData, field) || ""}
                      onChange={handleChange}
                      type={
                        field.includes("Date") ||
                        [
                          "clientInfo.dateOfBirth",
                          "relationship.marriageDate",
                          "relationship.separationDate",
                          "relationship.cohabitationDate",
                          "adverseParty.dateOfBirth",
                        ].includes(field)
                          ? "date"
                          : "text"
                      }
                    />
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              {fields.map((field) => {
                const value = getNestedValue(client, field);
                if (!value) return null;
                return (
                  <p key={field}>
                    <strong>
                      {field
                        .split(".")
                        .slice(-1)[0]
                        .replace(/([A-Z])/g, " $1")
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      :
                    </strong>{" "}
                    {value}
                  </p>
                );
              })}
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
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
