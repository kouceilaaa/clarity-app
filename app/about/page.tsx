import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Accessibility, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import { ROUTES } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "About - ClarityWeb",
  description:
    "Learn about ClarityWeb and our mission to make text more accessible for everyone.",
  openGraph: {
    title: "About ClarityWeb - Making Text Accessible",
    description:
      "Learn about our mission to make text more accessible for everyone through AI-powered simplification.",
    type: "website",
    siteName: "ClarityWeb",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClarityWeb - AI-Powered Text Simplification",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ClarityWeb - Making Text Accessible",
    description:
      "Learn about our mission to make text more accessible for everyone.",
    images: ["/og-image.png"],
  },
};

const values = [
  {
    icon: Accessibility,
    title: "Accessibility",
    description:
      "We believe everyone deserves access to clear, understandable information regardless of reading ability.",
  },
  {
    icon: Shield,
    title: "Privacy",
    description:
      "Your content stays private. We process text on-demand and don't store or share your data.",
  },
  {
    icon: Heart,
    title: "Inclusivity",
    description:
      "We design for diverse needs including dyslexia support, multiple themes, and text-to-speech.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Built with feedback from students, educators, and accessibility advocates.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About ClarityWeb
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We&apos;re on a mission to make written content accessible to
              everyone, regardless of reading level or learning differences.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none">
                <p>
                  ClarityWeb was born from a simple observation: too much of the
                  world&apos;s information is locked behind complex language.
                  Academic papers, legal documents, news articles, and even
                  everyday communications can be unnecessarily difficult to
                  understand.
                </p>
                <p>
                  We use modern language technology to break down these
                  barriers, making text clearer and more accessible while
                  preserving the original meaning. Whether you&apos;re a student
                  tackling a dense textbook, a non-native speaker navigating a
                  new language, or someone with dyslexia looking for a more
                  comfortable reading experience, ClarityWeb is here to help.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardHeader>
                    <value.icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{value.title}</CardTitle>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Input Your Content
                      </h3>
                      <p className="text-muted-foreground">
                        Paste text directly or provide a URL to extract content
                        from any webpage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Choose Your Mode
                      </h3>
                      <p className="text-muted-foreground">
                        Select from Simple (easiest), Standard (balanced), or
                        Detailed (preserves more nuance) simplification levels.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Get Your Results
                      </h3>
                      <p className="text-muted-foreground">
                        Receive simplified text instantly with reading
                        statistics, text-to-speech support, and easy sharing
                        options.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Try It Out?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start simplifying text for free — no account required.
            </p>
            <Link href={ROUTES.SIMPLIFY_TEXT}>
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">Our Team</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              ClarityWeb is built by a passionate team dedicated to making
              information accessible to everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <Card className="w-full max-w-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    Development Team
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Passionate developers focused on creating accessible and
                    user-friendly tools.
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full max-w-sm">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    Accessibility Advocates
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Working closely with educators and accessibility experts to
                    ensure our tools meet real needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have questions, feedback, or want to collaborate? We&apos;d love
              to hear from you.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="mailto:contact@clarityweb.app">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
              <Link href={ROUTES.FAQ}>
                <Button variant="ghost" size="lg">
                  View FAQ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
