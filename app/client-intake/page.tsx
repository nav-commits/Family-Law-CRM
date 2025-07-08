"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

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

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

// Import your auth hook (adjust path as needed)
import { useAuth } from "@/hooks/use-auth-redirect";

export default function ClientIntakePage() {
  const user = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    contactMethod: "email",
    maritalStatus: "",
    children: "",
    employment: "",
    income: "",
    hasLawyer: "",
    caseType: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (user === null) {
      router.replace("/");
    }
  }, [user, router]);

  if (user === undefined) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        description: "Your information has been successfully submitted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Please try again later.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login or home after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 relative">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="flex items-center justify-center mt-12">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Client Intake Form</CardTitle>
          </CardHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Basic Info */}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street, City, Province"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Preferences & Case Info */}
                <div>
                  <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                  <Input
                    id="contactMethod"
                    name="contactMethod"
                    placeholder="Email or Phone"
                    value={formData.contactMethod}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Input
                    id="maritalStatus"
                    name="maritalStatus"
                    placeholder="Single, Married, Separated..."
                    value={formData.maritalStatus}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="children">Children (if any)</Label>
                  <Input
                    id="children"
                    name="children"
                    placeholder="E.g. 2 children, ages 5 and 8"
                    value={formData.children}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="employment">Employment Status</Label>
                  <Input
                    id="employment"
                    name="employment"
                    value={formData.employment}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="income">Approx. Annual Income</Label>
                  <Input
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="hasLawyer">Have you had a lawyer before?</Label>
                  <Input
                    id="hasLawyer"
                    name="hasLawyer"
                    placeholder="Yes or No"
                    value={formData.hasLawyer}
                    onChange={handleChange}
                  />
                </div>

                {/* Case Details */}
                <div>
                  <Label htmlFor="caseType">Case Type</Label>
                  <Input
                    id="caseType"
                    name="caseType"
                    placeholder="Divorce, Custody, Support..."
                    value={formData.caseType}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Case Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe your situation briefly"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Submit Form
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <h2 className="text-xl font-semibold text-center">
                Thank you! Your information has been submitted.
              </h2>
              <p className="text-muted-foreground text-center">
                A lawyer will contact you shortly.
              </p>
              <Button onClick={() => router.push("/")}>Back to Home</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
