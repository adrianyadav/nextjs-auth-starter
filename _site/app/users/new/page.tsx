export const dynamic = "force-dynamic"; // This disables SSG and ISR

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewUser() {
  async function createUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    await prisma.user.create({
      data: { name, email, password: "" }, // password will be added by NextAuth
    });

    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action={createUser} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter user name ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex text-lg items-center">
                Email
                <Badge variant="secondary" className="ml-2">
                  Required
                </Badge>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter user email ..."
              />
            </div>
            <Button type="submit" className="w-full">
              Create User
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
