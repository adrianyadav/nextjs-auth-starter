"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const response = await signIn("credentials", {
        ...Object.fromEntries(formData),
        redirect: false,
      });

      if (response?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("An error occurred during login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                data-testid="email-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                data-testid="password-input"
              />
            </div>

            {error && (
              <div className="text-destructive text-sm text-center" data-testid="error-message">{error}</div>
            )}

            <Button type="submit" className="w-full" data-testid="submit-button">
              Sign in
            </Button>
          </form>
          <div className="text-center mt-4">
            <Button asChild variant="link">
              <Link href="/register" data-testid="register-link">
                No account? Register.
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
