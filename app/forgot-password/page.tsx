import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Forgot Password - ClarityWeb",
  description: "Reset your ClarityWeb account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main
        id="main-content"
        className="flex-1 flex items-center justify-center p-4"
        tabIndex={-1}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Reset your password
            </CardTitle>
            <CardDescription>
              Password reset functionality is coming soon
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">
                We&apos;re working on implementing password reset via email. In
                the meantime, please contact support if you need to recover your
                account.
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium mb-2">Need help?</p>
              <p>
                Email us at{" "}
                <a
                  href="mailto:support@clarityweb.com"
                  className="text-primary hover:underline"
                >
                  support@clarityweb.com
                </a>
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
