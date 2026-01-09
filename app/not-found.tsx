"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md text-center shadow-lg animate-scale-in">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileQuestion className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <p className="text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <div className="text-8xl font-bold text-muted-foreground/20">404</div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <Button className="w-full btn-hover-lift" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/simplify/text" className="flex-1">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Simplify Text
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
