import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Calendar, ArrowLeft, Copy, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import { getSharedContent } from "@/lib/actions/share.actions";
import { ROUTES, SIMPLIFICATION_CONFIG } from "@/lib/utils/constants";

interface SharedPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: SharedPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Shared Content - ClarityWeb`,
    description: `View shared simplified content (ID: ${id})`,
  };
}

export default async function SharedPage({ params }: SharedPageProps) {
  const { id } = await params;
  const response = await getSharedContent(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const content = response.data;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Link */}
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shared Simplification</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Shared on {new Date(content.createdAt).toLocaleDateString()}
              </span>
              <Badge variant="outline">
                {SIMPLIFICATION_CONFIG.MODE_EMOJIS[content.mode]}{" "}
                {SIMPLIFICATION_CONFIG.MODE_LABELS[content.mode]}
              </Badge>
            </div>
          </div>

          {/* Content Cards */}
          <div className="space-y-6">
            {/* Simplified Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Simplified Text
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {content.simplifiedText}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Listen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Original Text */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Original Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {content.originalText}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="mt-8">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Want to simplify your own text?
              </p>
              <Link href={ROUTES.SIMPLIFY_TEXT}>
                <Button>Try ClarityWeb Free</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
