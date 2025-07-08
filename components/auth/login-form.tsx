"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Shield, User } from "lucide-react";

import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

interface LoginFormProps {
  readonly role: "client" | "lawyer";
}

const AUTHORIZED_LAWYER_EMAILS = ["vik@ghankaslaw.com"];

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        // 🔐 Block unauthorized lawyer registrations
        if (role === "lawyer" && !AUTHORIZED_LAWYER_EMAILS.includes(email)) {
          throw new Error("Only authorized lawyers can register.");
        }
        // 🆕 Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        console.log("✅ User registered. UID:", uid);
        try {
          await setDoc(doc(db, "users", uid), {
            email,
            role,
          });
        } catch (firestoreError) {
          throw new Error("Failed to save user role to Firestore.");
        }

        toast({
          title: "Registration successful",
          description: `Welcome ${role === "lawyer" ? "lawyer" : "client"}!`,
        });
        router.push(role === "lawyer" ? "/dashboard" : "/client-intake");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        console.log("Login successful. UID:", uid);
        const userDoc = await getDoc(doc(db, "users", uid));

        if (!userDoc.exists()) {
          throw new Error("User role not found in Firestore.");
        }
        const userData = userDoc.data();
        if (userData.role !== role) {
          throw new Error(
            `Incorrect role. You’re trying to login as ${role}, but your account is ${userData.role}.`
          );
        }
        toast({
          title: "Login successful",
          description: `Welcome to your ${role} dashboard`,
        });

        router.push(role === "lawyer" ? "/dashboard" : "/client-intake");
      }
    } catch (error: any) {
      console.error("Auth Error:", error.message);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description:
          error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            {role === "lawyer" ? (
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            ) : (
              <User className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {isRegister
            ? role === "lawyer"
              ? "Lawyer Registration"
              : "Client Registration"
            : role === "lawyer"
            ? "Lawyer Login"
            : "Client Login"}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegister
            ? "Register to get started"
            : "Login to access your dashboard"}
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
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading
              ? isRegister
                ? "Registering..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Login"}
          </Button>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-center text-sm text-blue-600 hover:underline"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </CardFooter>
      </form>
      <div className="p-4 pt-0 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
        <Shield className="h-3 w-3" /> Secure login powered by Firebase
      </div>
    </Card>
  );
}
