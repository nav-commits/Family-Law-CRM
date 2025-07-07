"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function ClientIntakePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    caseType: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "clients"), {
        ...formData,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      toast({
        title: "Form submitted",
        description: "Your information has been successfully submitted."
      });

      // Optional: Send email via Cloud Function or third-party email API

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Please try again later."
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 relative">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={() => router.push("/")}>Logout</Button>
      </div>

      <div className="flex items-center justify-center mt-12">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Client Intake Form</CardTitle>
          </CardHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="caseType">Case Type</Label>
                  <Input id="caseType" name="caseType" placeholder="Divorce, Custody, etc." value={formData.caseType} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="description">Case Details</Label>
                  <Textarea id="description" name="description" rows={4} placeholder="Describe your situation briefly" value={formData.description} onChange={handleChange} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">Submit Form</Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <h2 className="text-xl font-semibold text-center">Thank you! Your information has been submitted.</h2>
              <p className="text-muted-foreground text-center">A lawyer will contact you shortly.</p>
              <Button onClick={() => router.push("/")}>Back to Home</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
