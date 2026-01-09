import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Link as LinkIcon,
  Sparkles,
  Shield,
  Zap,
  Accessibility,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
  Brain,
  Volume2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import { PricingTable } from "@/components/landing";
import { ScrollAnimationProvider } from "@/components/shared";
import { ROUTES } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "ClarityWeb - Make Text Easier to Read",
  description:
    "Simplify complex text and web content for easier reading. Perfect for students, non-native speakers, and anyone who wants clearer communication.",
};

const features = [
  {
    icon: FileText,
    title: "Text Simplification",
    description: "Paste any text and get an easier-to-read version instantly.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: LinkIcon,
    title: "URL Simplification",
    description: "Extract and simplify content from any webpage.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Multiple Modes",
    description:
      "Choose between Simple, Accessible, or Summary simplification levels.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    description:
      "Dyslexia-friendly fonts, high contrast themes, and text-to-speech.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Shield,
    title: "Privacy Focused",
    description:
      "Your data stays private. We don't store or share your content.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Zap,
    title: "Fast & Free",
    description: "Get instant results without any cost or sign-up required.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

const modes = [
  {
    name: "Simple",
    emoji: "🌱",
    description:
      "Easiest to read. Uses basic vocabulary suitable for 8-year-olds.",
    color: "bg-green-100 text-green-800 border-green-200",
    bgGradient: "from-green-50 to-green-100/50",
  },
  {
    name: "Accessible",
    emoji: "♿",
    description:
      "Balanced clarity. Middle school vocabulary with clear structure.",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgGradient: "from-blue-50 to-blue-100/50",
  },
  {
    name: "Summary",
    emoji: "📝",
    description: "Key points only. Condenses text to 3-5 main ideas.",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    bgGradient: "from-purple-50 to-purple-100/50",
  },
];

const accessibilityFeatures = [
  {
    icon: Brain,
    title: "Dyslexia Mode",
    description: "OpenDyslexic font with optimized spacing",
  },
  {
    icon: Eye,
    title: "High Contrast",
    description: "WCAG AAA compliant color schemes",
  },
  {
    icon: Volume2,
    title: "Text-to-Speech",
    description: "Listen to simplified text with word highlighting",
  },
];

const faqs = [
  {
    question: "What is ClarityWeb?",
    answer:
      "ClarityWeb is an AI-powered text simplification tool that makes complex content easier to understand. It's designed for students, non-native speakers, people with reading difficulties, and anyone who wants clearer communication.",
  },
  {
    question: "How does text simplification work?",
    answer:
      "Our AI analyzes your text and rewrites it using simpler words, shorter sentences, and clearer structure. You can choose from three modes: Simple (easiest to read), Accessible (balanced clarity), and Summary (key points only).",
  },
  {
    question: "Is ClarityWeb free to use?",
    answer:
      "Yes! ClarityWeb offers free text simplification. You can simplify up to 10 texts per day without creating an account. Create a free account to save your history and access additional features.",
  },
  {
    question: "What accessibility features are available?",
    answer:
      "ClarityWeb includes dyslexia-friendly fonts (OpenDyslexic), adjustable text size, high-contrast mode, and text-to-speech functionality. All features are designed to make reading easier for everyone.",
  },
  {
    question: "Can I simplify web pages?",
    answer:
      "Absolutely! Just paste any URL and ClarityWeb will extract the main content and simplify it for you. This works great for news articles, blog posts, and educational content.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. We take privacy seriously. Your text is processed securely and we don't store or share your content without your consent. Account users can optionally save their history for convenience.",
  },
  {
    question: "Who benefits from ClarityWeb?",
    answer:
      "ClarityWeb helps people with dyslexia, ADHD, learning disabilities, seniors, non-native speakers, students studying complex subjects, and anyone who wants to quickly understand difficult text.",
  },
  {
    question: "Can I save my simplifications?",
    answer:
      "Yes! Create a free account to save your simplification history, mark favorites, and access your simplified texts from any device. Premium users get unlimited storage.",
  },
];

const stats = [
  { value: "1.2B+", label: "People with reading difficulties worldwide" },
  { value: "43%", label: "Average readability improvement" },
  { value: "10K+", label: "Texts simplified daily" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollAnimationProvider />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* Hero Section - Modern, Impactful */}
        <section className="relative py-24 md:py-36 px-4 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              AI-Powered Text Simplification
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Make Text{" "}
              <span className="text-gradient-primary">Easier to Read</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform complex content into clear, accessible language. Perfect
              for everyone who deserves to understand what they read.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={ROUTES.SIMPLIFY_TEXT}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 py-6 btn-hover-lift"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Start Simplifying — Free
                </Button>
              </Link>
              <Link href="#demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 py-6"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                No signup required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                100% free to try
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Privacy-first
              </span>
            </div>
          </div>
        </section>

        {/* Problem Statement with Stats */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="scroll-animate">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Reading Should Be{" "}
                  <span className="text-primary">Accessible</span> to Everyone
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Over 1 billion people worldwide face challenges with reading
                  complex text. Whether due to dyslexia, language barriers, or
                  simply encountering technical jargon — everyone deserves to
                  understand what they read.
                </p>
                <p className="text-muted-foreground mb-8">
                  ClarityWeb uses AI to transform difficult text into clear,
                  easy-to-understand language while preserving the meaning.
                </p>
                <Link href={ROUTES.ABOUT}>
                  <Button variant="outline" className="group">
                    Learn Our Story
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 stagger-children">
                {stats.map((stat) => (
                  <Card
                    key={stat.label}
                    className="text-center p-6 border-0 bg-background shadow-sm"
                  >
                    <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Simplification Modes */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-14 scroll-animate">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Three Modes for Your Needs
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the simplification level that works best for you
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {modes.map((mode) => (
                <Card
                  key={mode.name}
                  className={`card-hover overflow-hidden border-2 ${
                    mode.color.split(" ")[2]
                  }`}
                >
                  <div className={`h-2 bg-linear-to-r ${mode.bgGradient}`} />
                  <CardHeader className="text-center pb-2">
                    <span className="text-4xl mb-3 block">{mode.emoji}</span>
                    <CardTitle className="text-xl">{mode.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{mode.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-14 scroll-animate">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Choose ClarityWeb?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful features designed with accessibility in mind
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="card-hover border-0 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div
                      className={`inline-flex p-3 rounded-xl ${feature.bgColor} w-fit mb-3`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility Features Highlight */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="scroll-animate">
                <Badge className="mb-4 bg-teal-100 text-teal-800 border-0">
                  <Accessibility className="h-3.5 w-3.5 mr-1.5" />
                  Accessibility First
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Built for Everyone
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  ClarityWeb goes beyond simplification. Our accessibility
                  features help people with dyslexia, visual impairments, and
                  other reading challenges.
                </p>
                <div className="space-y-4">
                  {accessibilityFeatures.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-0.5">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative scroll-animate-scale">
                <Card className="p-6 bg-linear-to-br from-primary/5 to-accent/5 border-0">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20" />
                    <div className="h-8 w-8 rounded-lg bg-primary/20" />
                    <div className="h-8 w-8 rounded-lg bg-primary/20" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section - Simplified to just a CTA button */}
        <section id="demo" className="py-20 px-4 bg-muted/30 scroll-mt-20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center scroll-animate">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                <PlayCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Experience It?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Start simplifying text in seconds. No credit card required.
              </p>
              <Link href={ROUTES.SIMPLIFY_TEXT}>
                <Button size="lg" className="h-14 px-10 text-lg btn-hover-lift">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Simplifying for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingTable />

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-12 scroll-animate">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to know about ClarityWeb
              </p>
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full scroll-animate-fade"
            >
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-4 bg-linear-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto max-w-4xl text-center scroll-animate">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Make Text Accessible?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands who use ClarityWeb to understand complex content
              better. Start for free today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href={ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 py-6 btn-hover-lift"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={ROUTES.SIMPLIFY_TEXT}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 py-6"
                >
                  Try Without Account
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • 10 free simplifications per day
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
