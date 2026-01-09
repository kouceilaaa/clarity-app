import { Metadata } from "next";
import { HelpCircle, MessageCircle, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - ClarityWeb",
  description:
    "Find answers to common questions about ClarityWeb's text simplification features, pricing, and accessibility.",
};

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is ClarityWeb?",
        answer:
          "ClarityWeb is a text simplification tool that uses AI to make complex content more accessible and easier to understand. It's designed to help people with reading difficulties, non-native speakers, students, and anyone who wants clearer communication.",
      },
      {
        question: "Do I need an account to use ClarityWeb?",
        answer:
          "You can try basic text simplification without an account. However, creating a free account unlocks features like history, favorites, sharing, and personalized accessibility settings. Accounts are free and take less than a minute to set up.",
      },
      {
        question: "How do I simplify text?",
        answer:
          "Navigate to 'Simplify Text', paste your content, choose a mode (Simple, Accessible, or Summary), and click 'Simplify'. The AI will process your text in seconds. You can also simplify content from URLs using the 'Simplify URL' feature.",
      },
      {
        question: "What are the different simplification modes?",
        answer:
          "• Simple: Very basic language for elementary reading level (Grade 3-5)\n• Accessible: Balanced simplification for general audience (Grade 6-8)\n• Summary: Condensed version with only key points and main ideas",
      },
    ],
  },
  {
    category: "Features & Usage",
    questions: [
      {
        question: "How accurate is the text simplification?",
        answer:
          "ClarityWeb uses advanced AI models trained on millions of texts. While accuracy is generally high (85-95%), AI can occasionally make mistakes. Always review simplified content for critical use cases. We recommend using it as a starting point and making adjustments as needed.",
      },
      {
        question: "Can I simplify content from websites?",
        answer:
          "Yes! Use the 'Simplify URL' feature to extract and simplify articles, blog posts, and web pages. The tool removes ads and navigation, keeping only the main content. Note: Some sites may block extraction, and paywalled content cannot be accessed.",
      },
      {
        question: "What file formats can I export to?",
        answer:
          "You can export simplified content as Plain Text (.txt), Markdown (.md), JSON (.json), HTML (.html), or print to PDF. Each format has different use cases - JSON includes full metadata, while PDF is great for sharing or printing.",
      },
      {
        question: "How does the text-to-speech feature work?",
        answer:
          "ClarityWeb uses your browser's built-in Web Speech API to read simplified text aloud. You can adjust the speech rate (0.5x to 2x) and the text highlights as it's read. This feature works in Chrome, Edge, and Safari. Firefox has limited support.",
      },
      {
        question: "Can I save my simplified texts?",
        answer:
          "Yes! When logged in, all simplifications are automatically saved to your history. You can favorite important items, search through past simplifications, and filter by mode. History is kept for 30 days for free accounts and 90 days for premium users.",
      },
    ],
  },
  {
    category: "Accessibility",
    questions: [
      {
        question: "What accessibility features are available?",
        answer:
          "ClarityWeb offers:\n• Adjustable font size (12-32px)\n• OpenDyslexic font for dyslexia\n• Multiple contrast themes (Normal, High Contrast, Dark, Cream)\n• Text-to-speech with adjustable speed\n• Full keyboard navigation\n• Screen reader support\nAll preferences sync to your account.",
      },
      {
        question: "Is ClarityWeb compatible with screen readers?",
        answer:
          "Yes! ClarityWeb is built with WCAG 2.1 AA standards in mind. We use semantic HTML, proper ARIA labels, and support keyboard navigation. The site works with NVDA, JAWS, VoiceOver, and other major screen readers.",
      },
      {
        question: "Can I use ClarityWeb on mobile devices?",
        answer:
          "Absolutely! ClarityWeb is fully responsive and works on phones and tablets. The mobile interface is optimized for touch with larger tap targets and simplified layouts. Text-to-speech works on iOS Safari and Android Chrome.",
      },
      {
        question: "What is dyslexia mode?",
        answer:
          "Dyslexia mode enables the OpenDyslexic font, which features weighted bottoms and unique character shapes designed to reduce letter confusion. Many users with dyslexia find this font easier to read, though preferences vary. Try it to see if it helps!",
      },
    ],
  },
  {
    category: "Pricing & Limits",
    questions: [
      {
        question: "Is ClarityWeb free?",
        answer:
          "Yes! ClarityWeb offers a free tier with 10 simplifications per day. This is perfect for casual use, students, and trying out the service. Premium plans with higher limits and additional features are available for power users and organizations.",
      },
      {
        question: "What are the daily limits?",
        answer:
          "Free accounts: 10 simplifications per day\nPremium accounts: 100 simplifications per day\nQuota resets at midnight UTC. Each simplification (whether text or URL) counts as one use.",
      },
      {
        question: "What does Premium offer?",
        answer:
          "Premium users get:\n• 100 simplifications per day (10x more)\n• Extended 90-day history (vs 30 days)\n• Priority processing for faster results\n• Advanced export options\n• Email support\n• No ads",
      },
      {
        question: "Can I use ClarityWeb for commercial purposes?",
        answer:
          "Free accounts are for personal use only. Commercial use requires a Premium or Business plan. Business plans offer team accounts, API access, custom integrations, and volume discounts. Contact us for enterprise pricing.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        question: "What data does ClarityWeb collect?",
        answer:
          "We collect:\n• Account info (email, name) if you register\n• Simplified texts (stored encrypted)\n• Usage statistics for improving the service\n• No tracking cookies or third-party analytics\nWe never sell your data. See our Privacy Policy for details.",
      },
      {
        question: "Is my data encrypted?",
        answer:
          "Yes! All data is encrypted in transit (TLS/SSL) and at rest (AES-256). Passwords are hashed using bcrypt. Database connections use encrypted connections. We follow industry-standard security practices.",
      },
      {
        question: "Can I delete my data?",
        answer:
          "Absolutely. You can delete individual simplifications from your history anytime. To delete your entire account and all associated data, go to Settings > Account > Delete Account. This action is permanent and cannot be undone.",
      },
      {
        question: "Who can see my shared links?",
        answer:
          "Share links are public - anyone with the link can view the content without logging in. Links expire after 7 days by default (30 days for Premium). You can delete share links anytime. Don't share sensitive information via public links.",
      },
    ],
  },
  {
    category: "Technical Questions",
    questions: [
      {
        question: "Which browsers are supported?",
        answer:
          "ClarityWeb works best on:\n• Chrome/Edge 90+ (recommended)\n• Firefox 88+\n• Safari 14+\n• Mobile browsers (iOS Safari, Chrome Android)\nText-to-speech requires Web Speech API support (Chrome, Edge, Safari).",
      },
      {
        question: "Why isn't text-to-speech working?",
        answer:
          "Possible causes:\n• Your browser doesn't support Web Speech API (try Chrome)\n• No voices installed on your device\n• Microphone permissions issue\n• Browser needs to be updated\nCheck browser compatibility and enable microphone access if prompted.",
      },
      {
        question: "Can I use ClarityWeb offline?",
        answer:
          "Currently, no. ClarityWeb requires an internet connection because AI simplification happens on our servers. We're exploring offline PWA (Progressive Web App) capabilities for saved content in the future.",
      },
      {
        question: "Is there an API available?",
        answer:
          "API access is available for Business and Enterprise plans. The API allows you to integrate ClarityWeb's simplification engine into your own applications. Rate limits and pricing vary by plan. Contact sales for API documentation.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        question: "Why is my text not simplifying?",
        answer:
          "Common issues:\n• Text is too short (minimum 50 characters)\n• Text exceeds 10,000 character limit\n• You've reached your daily quota\n• Temporary server issue\nTry shortening your text, waiting a few minutes, or checking your quota in settings.",
      },
      {
        question: "URL extraction failed - what now?",
        answer:
          "Some sites block automated extraction or require login:\n• Try copying and pasting the article text manually\n• Check if the URL is accessible (not behind paywall)\n• Some news sites and PDFs can't be extracted\n• Make sure the URL is correct and publicly accessible",
      },
      {
        question: "My preferences aren't saving",
        answer:
          "Possible solutions:\n• Make sure you're logged in (preferences require an account)\n• Check browser cookies are enabled\n• Try logging out and back in\n• Clear browser cache and reload\n• Check if browser extensions are blocking saves",
      },
      {
        question: "How do I report a bug?",
        answer:
          "We appreciate bug reports! Include:\n• What you were trying to do\n• What happened vs what you expected\n• Browser and device info\n• Screenshots if applicable\nContact us via the feedback form or email support with these details.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-2">
          <HelpCircle className="size-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about ClarityWeb. Can&apos;t find
          what you&apos;re looking for? Check our{" "}
          <a href="/help" className="text-primary hover:underline">
            Help Center
          </a>
          .
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="size-4" />
              {faqs.reduce((acc, cat) => acc + cat.questions.length, 0)}{" "}
              Questions
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HelpCircle className="size-4" />
              {faqs.length} Categories
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="size-4" />
              Updated Weekly
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqs.map((category, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-base">
                {category.category}
              </Badge>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Accordion type="single" collapsible className="w-full">
              {category.questions.map((faq, qIdx) => (
                <AccordionItem
                  key={qIdx}
                  value={`${catIdx}-${qIdx}`}
                  className="border rounded-lg px-4 mb-2"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed pt-2">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Still Need Help */}
      <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            Still need help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            If you couldn&apos;t find an answer to your question, we&apos;re
            here to help:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              Visit our{" "}
              <a href="/help" className="text-primary hover:underline">
                Help Center
              </a>{" "}
              for detailed guides
            </li>
            <li>
              Check the{" "}
              <a href="/about" className="text-primary hover:underline">
                About page
              </a>{" "}
              to learn more about ClarityWeb
            </li>
            <li>Contact support with your specific question or issue</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
