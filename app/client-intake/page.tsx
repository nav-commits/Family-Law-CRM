"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-redirect";
import { useForm } from "react-hook-form";
import TextField from "../../components/text-field/text-field";
import TextareaField from "../../components/text-area/text-area";
import Section from "../../components/section/section";
import { ClientData } from "@/types/client-data";

const defaultValues: ClientData = {
  clientInfo: {
    howHeard: "",
    name: "",
    dateOfBirth: "",
    placeOfBirth: "",
    citizenship: "",
    surnameAtBirth: "",
    arrivedInBC: "",
    usCitizen: "No",
    address: "",
    mailingAddress: "",
    home: "",
    work: "",
    mobile: "",
    email: "",
    occupation: "",
    employer: "",
    annualIncome: "",
    otherIncome: "",
  },

  adverseParty: {
    name: "",
    surnameAtBirth: "",
    otherNames: "",
    dateOfBirth: "",
    placeOfBirth: "",
    address: "",
    arrivedInBC: "",
    occupation: "",
    employer: "",
    income: "",
    otherIncome: "",
    lawyer: {
      name: "",
      firm: "",
      address: "",
      phone: "",
      fax: "",
      email: "",
    },
  },
  relationship: {
    cohabitationDate: "",
    marriageDate: "",
    marriagePlace: "",
    separationDate: "",
    hasAgreement: "No",
    divorced: "No",
    hasMarriageCertificate: "Client will order",
  },

  children: {
    details: "",
    custodySought: "",
    custodyTerms: "",
  },

  assets: {
    summary: "",
    rrsp: "",
    privatePensions: "",
    investments: "",
    businessInterests: "",
    automobiles: "",
    debts: "",
  },
  notes: "",
  status: ""
};

export default function ClientIntakePage() {
  const user = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientData>({
    mode: "onBlur",
    defaultValues,
  });

  // Check if the user has already submitted the form
  useEffect(() => {
    if (user === null) {
      router.replace("/");
      return;
    }
    if (user) {
      const checkSubmission = async () => {
        try {
          const clientsRef = collection(db, "clients");
          const q = query(clientsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // User already submitted
            setHasSubmitted(true);
            setSubmitted(true);
          }
        } catch (error) {
          console.error("Error checking submissions:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to check submission status.",
          });
        }
      };
      checkSubmission();
    }
  }, [user, router, toast]);

  if (user === undefined) return null;

  const onSubmit = async (data: ClientData) => {
    try {
      if (hasSubmitted) {
        toast({
          title: "Submission exists",
          description: "You have already submitted the intake form.",
        });
        return;
      }
      await addDoc(collection(db, "clients"), {
        ...data,
        userId: user?.uid || "",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setHasSubmitted(true);
      toast({
        title: "Form submitted",
        description: "Your intake has been saved.",
      });
      reset(defaultValues);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error submitting",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Try again.",
      });
    }
  };

  const ControlledTextField = ({
    name,
    label,
    type = "text",
    required = false,
  }: {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
  }) => (
    <TextField
      {...register(name, required ? { required: `${label} is required` } : {})}
      label={label + (required ? " *" : "")}
      type={type}
      error={errors && errors[name as keyof typeof errors]?.message}
    />
  );

  const ControlledTextareaField = ({
    name,
    label,
    required = false,
  }: {
    name: string; 
    label: string;
    required?: boolean;
  }) => (
    <TextareaField
      {...register(name, required ? { required: `${label} is required` } : {})}
      label={label + (required ? " *" : "")}
      error={errors && errors[name as keyof typeof errors]?.message}
    />
  );

  return (
    <div className="min-h-screen bg-white p-4 relative">
      <div className="absolute top-4 right-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="flex justify-center mt-12">
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Client Intake Form</CardTitle>
          </CardHeader>

          {!submitted ? (
            !hasSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <Section title="Client Information">
                    <ControlledTextField
                      name="clientInfo.howHeard"
                      label="How did you hear about our firm"
                    />
                    <ControlledTextField
                      name="clientInfo.name"
                      label="Name"
                      required
                    />
                    <ControlledTextField
                      name="clientInfo.dateOfBirth"
                      label="Date of Birth"
                      type="date"
                    />
                    <ControlledTextField
                      name="clientInfo.placeOfBirth"
                      label="Place of Birth"
                    />
                    <ControlledTextField
                      name="clientInfo.citizenship"
                      label="Citizenship"
                    />
                    <ControlledTextField
                      name="clientInfo.surnameAtBirth"
                      label="Surname at Birth"
                    />
                    <ControlledTextField
                      name="clientInfo.arrivedInBC"
                      label="Date Arrived in BC"
                    />
                    <ControlledTextField
                      name="clientInfo.usCitizen"
                      label="US Citizen (Yes/No)"
                    />
                    <ControlledTextField
                      name="clientInfo.address"
                      label="Address"
                    />
                    <ControlledTextField
                      name="clientInfo.mailingAddress"
                      label="Mailing Address"
                    />
                    <ControlledTextField
                      name="clientInfo.home"
                      label="Home Phone"
                    />
                    <ControlledTextField
                      name="clientInfo.work"
                      label="Work Phone"
                    />
                    <ControlledTextField
                      name="clientInfo.mobile"
                      label="Mobile"
                    />
                    <ControlledTextField
                      name="clientInfo.email"
                      label="Email"
                      type="email"
                      required
                    />
                    <ControlledTextField
                      name="clientInfo.occupation"
                      label="Occupation"
                    />
                    <ControlledTextField
                      name="clientInfo.employer"
                      label="Employer"
                    />
                    <ControlledTextField
                      name="clientInfo.annualIncome"
                      label="Annual Income"
                    />
                    <ControlledTextareaField
                      name="clientInfo.otherIncome"
                      label="Other Sources of Income"
                    />
                  </Section>
                  <Section title="Adverse Party">
                    <ControlledTextField
                      name="adverseParty.name"
                      label="Name"
                    />
                    <ControlledTextField
                      name="adverseParty.surnameAtBirth"
                      label="Surname at Birth"
                    />
                    <ControlledTextField
                      name="adverseParty.otherNames"
                      label="Other Names"
                    />
                    <ControlledTextField
                      name="adverseParty.dateOfBirth"
                      label="Date of Birth"
                    />
                    <ControlledTextField
                      name="adverseParty.placeOfBirth"
                      label="Place of Birth"
                    />
                    <ControlledTextField
                      name="adverseParty.address"
                      label="Address"
                    />
                    <ControlledTextField
                      name="adverseParty.arrivedInBC"
                      label="Date Arrived in BC"
                    />
                    <ControlledTextField
                      name="adverseParty.occupation"
                      label="Occupation"
                    />
                    <ControlledTextField
                      name="adverseParty.employer"
                      label="Employer"
                    />
                    <ControlledTextField
                      name="adverseParty.income"
                      label="Annual Income"
                    />
                    <ControlledTextareaField
                      name="adverseParty.otherIncome"
                      label="Other Income"
                    />
                    <ControlledTextField
                      name="adverseParty.lawyer.name"
                      label="Opposing Lawyer Name"
                    />
                    <ControlledTextField
                      name="adverseParty.lawyer.firm"
                      label="Opposing Lawyer Firm"
                    />
                    <ControlledTextField
                      name="adverseParty.lawyer.address"
                      label="Opposing Lawyer Address"
                    />
                    <ControlledTextField
                      name="adverseParty.lawyer.phone"
                      label="Opposing Lawyer Phone"
                    />
                    <ControlledTextField
                      name="adverseParty.lawyer.fax"
                      label="Opposing Lawyer Fax"
                    />
                    <ControlledTextField
                      name="adverseParty.lawyer.email"
                      label="Opposing Lawyer Email"
                    />
                  </Section>
                  <Section title="Relationship Particulars">
                    <ControlledTextField
                      name="relationship.cohabitationDate"
                      label="Date of Cohabitation"
                      type="date"
                    />
                    <ControlledTextField
                      name="relationship.marriageDate"
                      label="Marriage Date"
                      type="date"
                    />
                    <ControlledTextField
                      name="relationship.marriagePlace"
                      label="Marriage Place"
                    />
                    <ControlledTextField
                      name="relationship.separationDate"
                      label="Separation Date"
                      type="date"
                    />
                    <ControlledTextField
                      name="relationship.hasAgreement"
                      label="Has Agreement (Yes/No)"
                    />
                    <ControlledTextField
                      name="relationship.divorced"
                      label="Divorced (Yes/No)"
                    />
                    <ControlledTextField
                      name="relationship.hasMarriageCertificate"
                      label="Marriage Certificate Status"
                    />
                  </Section>
                  <Section title="Children & Custody">
                    <ControlledTextareaField
                      name="children.details"
                      label="Children (Name, DOB, Lives With)"
                    />
                    <ControlledTextField
                      name="children.custodySought"
                      label="Custody Sought"
                    />
                    <ControlledTextareaField
                      name="children.custodyTerms"
                      label="Custody Terms"
                    />
                  </Section>
                  <Section title="Assets & Liabilities">
                    <ControlledTextareaField
                      name="assets.summary"
                      label="Assets (Real Estate, RRSPs, Pensions, Investments)"
                    />
                    <ControlledTextField
                      name="assets.rrsp"
                      label="RRSP"
                    />
                    <ControlledTextField
                      name="assets.privatePensions"
                      label="Private Pensions"
                    />
                    <ControlledTextField
                      name="assets.investments"
                      label="Investments"
                    />
                    <ControlledTextField
                      name="assets.businessInterests"
                      label="Business Interests"
                    />
                    <ControlledTextField
                      name="assets.automobiles"
                      label="Automobiles"
                    />
                    <ControlledTextField
                      name="assets.debts"
                      label="Debts"
                    />
                    <ControlledTextareaField
                      name="notes"
                      label="Additional Notes"
                    />
                  </Section>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Form"}
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="p-8 text-center">
                <h2 className="text-lg font-semibold">
                  You have already submitted the intake form.
                </h2>
              </CardContent>
            )
          ) : (
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <h2 className="text-xl font-semibold text-center">
                Thank you! Your information has been submitted.
              </h2>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
