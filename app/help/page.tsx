import { Metadata } from "next";
import {
  FileText,
  Link as LinkIcon,
  Settings,
  History,
  Share2,
  Download,
  Accessibility,
  BookOpen,
  Sparkles,
} from "lucide-react";
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

export const metadata: Metadata = {
  title: "Help & Guides - ClarityWeb",
  description:
    "Learn how to use ClarityWeb's features to simplify text and make content more accessible.",
};

const guides = [
  {
    icon: FileText,
    title: "Simplifying Text",
    description: "Learn how to simplify any text content",
    steps: [
      {
        title: "1. Choose Your Mode",
        content:
          "Select from three simplification modes:\n• Simple: Very basic language for elementary reading level\n• Accessible: Balanced simplification for general audience\n• Summary: Condensed version with key points only",
      },
      {
        title: "2. Enter Your Text",
        content:
          "Paste or type your text (up to 10,000 characters) into the text area. The character counter shows your progress.",
      },
      {
        title: "3. Click Simplify",
        content:
          "Press the 'Simplify Text' button and wait for the AI to process your content. This usually takes 2-5 seconds.",
      },
      {
        title: "4. Review Results",
        content:
          "View your simplified text alongside readability statistics like word count, reading time, and Flesch score improvement.",
      },
    ],
  },
  {
    icon: LinkIcon,
    title: "Simplifying from URL",
    description: "Extract and simplify content from web pages",
    steps: [
      {
        title: "1. Enter the URL",
        content:
          "Paste the full URL of the article or web page you want to simplify (e.g., https://example.com/article).",
      },
      {
        title: "2. Select Mode",
        content:
          "Choose your preferred simplification mode - Simple, Accessible, or Summary.",
      },
      {
        title: "3. Click Extract & Simplify",
        content:
          "The system will extract the main content from the page (removing ads and navigation) and simplify it for you.",
      },
      {
        title: "4. View Source Link",
        content:
          "The simplified result includes a link back to the original article for reference.",
      },
    ],
  },
  {
    icon: Accessibility,
    title: "Accessibility Features",
    description: "Customize your reading experience",
    steps: [
      {
        title: "Font Size Control",
        content:
          "Use the slider or +/- buttons to adjust text size between 12px and 32px. Your preference is saved automatically.",
      },
      {
        title: "Dyslexia-Friendly Font",
        content:
          "Toggle OpenDyslexic font for improved readability if you have dyslexia. The font features weighted bottoms and unique character shapes.",
      },
      {
        title: "Contrast Modes",
        content:
          "Choose from Normal, High Contrast (black on white), Dark (dark background), or Cream (easier on eyes) themes.",
      },
      {
        title: "Text-to-Speech",
        content:
          "Click the play button to hear simplified text read aloud. Adjust speech rate (0.5x to 2x) to match your listening preference.",
      },
    ],
  },
  {
    icon: History,
    title: "Managing History",
    description: "Access and organize your simplifications",
    steps: [
      {
        title: "View History",
        content:
          "Navigate to History to see all your past simplifications. Items are sorted by date with newest first.",
      },
      {
        title: "Search & Filter",
        content:
          "Use the search bar to find specific content. Filter by mode (Simple, Accessible, Summary) or favorites only.",
      },
      {
        title: "Favorite Items",
        content:
          "Click the star icon to mark important simplifications as favorites for quick access later.",
      },
      {
        title: "Delete History",
        content:
          "Remove unwanted items by clicking the delete button. This action cannot be undone.",
      },
    ],
  },
  {
    icon: Share2,
    title: "Sharing Simplifications",
    description: "Share your simplified content with others",
    steps: [
      {
        title: "Create Share Link",
        content:
          "Click the Share button on any simplification to generate a unique shareable link. Links expire after 7 days by default.",
      },
      {
        title: "Copy Link",
        content:
          "The share link is automatically copied to your clipboard. You can also manually copy it from the share dialog.",
      },
      {
        title: "Public Access",
        content:
          "Anyone with the link can view the simplified content - no account required. Perfect for sharing with students or colleagues.",
      },
      {
        title: "View Count",
        content:
          "Track how many times your shared link has been viewed in the share management dialog.",
      },
    ],
  },
  {
    icon: Download,
    title: "Exporting Content",
    description: "Download simplified text in multiple formats",
    steps: [
      {
        title: "Export Formats",
        content:
          "Export your simplifications as Plain Text (.txt), Markdown (.md), JSON (.json), HTML (.html), or print to PDF.",
      },
      {
        title: "Plain Text & Markdown",
        content:
          "Use .txt for simple sharing or .md for formatted documents with headers and lists preserved.",
      },
      {
        title: "JSON Export",
        content:
          "Export as JSON to get the complete data including statistics, timestamps, and metadata - useful for data analysis.",
      },
      {
        title: "PDF Export",
        content:
          "Print to PDF opens a print dialog where you can save as PDF or print directly. Includes formatted content with statistics.",
      },
    ],
  },
  {
    icon: Settings,
    title: "Settings & Preferences",
    description: "Personalize your ClarityWeb experience",
    steps: [
      {
        title: "Default Mode",
        content:
          "Set your preferred simplification mode so it's pre-selected every time you simplify text.",
      },
      {
        title: "Speech Rate",
        content:
          "Adjust the default text-to-speech speed. Your preference applies to all TTS playback.",
      },
      {
        title: "Reset Preferences",
        content:
          "Use the 'Reset to Defaults' button if you want to restore all settings to their original values.",
      },
      {
        title: "Sync Across Devices",
        content:
          "Your preferences are synced to your account and available on all devices where you're logged in.",
      },
    ],
  },
];

const tips = [
  {
    title: "Keyboard Shortcuts",
    content:
      "• Tab through form fields and buttons\n• Enter to submit forms\n• Escape to close dialogs\n• Space to play/pause TTS",
  },
  {
    title: "Quota Limits",
    content:
      "Free accounts: 10 simplifications per day\nPremium accounts: 100 simplifications per day\nQuota resets at midnight UTC",
  },
  {
    title: "Best Practices",
    content:
      "• Keep input text under 5,000 words for best results\n• Use URL simplification for articles and blog posts\n• Save important simplifications to favorites\n• Export content before the 30-day history limit",
  },
  {
    title: "Browser Support",
    content:
      "• Chrome, Firefox, Safari, and Edge (latest versions)\n• Text-to-speech requires Web Speech API support\n• Works on desktop, tablet, and mobile devices",
  },
];

export default function HelpPage() {
  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-2">
          <BookOpen className="size-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Help & Guides</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to make the most of ClarityWeb&apos;s features to simplify
          text and improve content accessibility.
        </p>
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <CardTitle>Quick Start</CardTitle>
          </div>
          <CardDescription>
            New to ClarityWeb? Start here for a quick overview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Navigate to <strong>Simplify Text</strong> or{" "}
              <strong>Simplify URL</strong>
            </li>
            <li>
              Choose your simplification mode (Simple, Accessible, or Summary)
            </li>
            <li>Enter your text or paste a URL</li>
            <li>Click the Simplify button and wait for results</li>
            <li>
              Use accessibility features, export, or share your simplified
              content
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Feature Guides */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Feature Guides</h2>
        <div className="grid gap-6">
          {guides.map((guide) => (
            <Card key={guide.title}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <guide.icon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{guide.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {guide.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {guide.steps.map((step, idx) => (
                    <AccordionItem key={idx} value={`step-${idx}`}>
                      <AccordionTrigger className="text-left">
                        {step.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                          {step.content}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips & Tricks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Tips & Tricks</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline">{idx + 1}</Badge>
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {tip.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Need More Help? */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>
            Can&apos;t find what you&apos;re looking for? We&apos;re here to
            help!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Check the FAQ:</strong> Visit our{" "}
            <a href="/faq" className="text-primary hover:underline">
              Frequently Asked Questions
            </a>{" "}
            page for common issues and solutions.
          </p>
          <p>
            <strong>Report Issues:</strong> Found a bug or have a suggestion?
            Please contact support with detailed information.
          </p>
          <p>
            <strong>About ClarityWeb:</strong> Learn more about our mission on
            the{" "}
            <a href="/about" className="text-primary hover:underline">
              About page
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
