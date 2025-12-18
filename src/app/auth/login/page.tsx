"use client";

import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "./actions"; // Importing the backend logic

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    // The server action handles the redirect, so we just wait
    await login(formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">CRM.TAO</CardTitle>
          <CardDescription  className="text-lg font-semibold "> Sign in to your AlphaCRM account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-6 " />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@crm.com"
                  className="pl-10 h-10 w-full hover:border-[#373737] border border-[#373737] rounded-md bg-transparent focus:border-[#575757] focus:ring-2 focus:ring-[#575757] outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-10 w-full hover:border-[#373737] border border-[#373737] rounded-md bg-transparent focus:border-[#575757] focus:ring-2 focus:ring-[#575757] outline-none"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-2 hover:bg-[#E5E5E5] h-10 bg-white text-[#171717] font-bold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}