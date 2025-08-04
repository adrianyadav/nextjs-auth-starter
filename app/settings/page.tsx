"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (session?.user?.email) {
            checkPasswordStatus();
        }
    }, [session]);

    const checkPasswordStatus = async () => {
        try {
            const response = await fetch("/api/auth/check-password", {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                setHasPassword(data.hasPassword);
            }
        } catch (error) {
            console.error("Error checking password status:", error);
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/set-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: data.message,
                });
                setPassword("");
                setConfirmPassword("");
                setHasPassword(true);
            } else {
                toast({
                    title: "Error",
                    description: data.error,
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to set password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Please sign in to access settings.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                            Manage your account preferences and security settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        </div>

                        <div>
                            <Label>Name</Label>
                            <p className="text-sm text-muted-foreground">{session?.user?.name}</p>
                        </div>

                        {hasPassword !== null && (
                            <div>
                                <Label>Password Status</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    {hasPassword ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm text-green-600">Password is set</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm text-yellow-600">No password set (Google account only)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {hasPassword === false && (
                            <Card className="border-yellow-200 bg-yellow-50">
                                <CardHeader>
                                    <CardTitle className="text-yellow-800">Set a Password</CardTitle>
                                    <CardDescription className="text-yellow-700">
                                        Add a password to your account so you can sign in with email and password in addition to Google.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSetPassword} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your new password"
                                                required
                                                minLength={6}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm your new password"
                                                required
                                            />
                                        </div>



                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Setting password..." : "Set Password"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 