"use client";

import Link from "next/link";
import { Check, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/utils/constants";

const tiers = [
  {
    name: "Free",
    price: "€0",
    period: "/month",
    description: "Perfect for getting started",
    popular: false,
    icon: null,
    gradient: "from-slate-50 to-slate-100/50",
    features: [
      "10 simplifications per day",
      "All 3 simplification modes",
      "30-day history",
      "TXT export only",
      "Text-to-speech (TTS)",
      "Basic accessibility options",
      "Auto-save",
      "Community support",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    href: ROUTES.REGISTER,
  },
  {
    name: "Premium",
    price: "€9.99",
    period: "/month",
    description: "For power users",
    popular: true,
    icon: Crown,
    gradient: "from-primary/5 to-primary/10",
    features: [
      "100 simplifications per day",
      "All 3 simplification modes",
      "Unlimited history",
      "Multi-format export (TXT, PDF, HTML, Markdown)",
      "Advanced text-to-speech",
      "Premium accessibility options",
      "Unlimited sharing",
      "Cloud backup",
      "Priority email support",
      "Advanced text analytics",
      "Detailed statistics",
    ],
    cta: "Upgrade to Premium",
    ctaVariant: "default" as const,
    href: "/pricing",
  },
];

export function PricingTable() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                tier.popular
                  ? "border-primary border-2 shadow-md"
                  : "border shadow-sm"
              )}
            >
              {/* Gradient background */}
              <div
                className={cn(
                  "absolute inset-0 bg-linear-to-br opacity-50 pointer-events-none",
                  tier.gradient
                )}
              />

              {tier.popular && (
                <Badge
                  variant="default"
                  className="absolute top-0 right-4 rounded-t-none gap-1 px-4 py-1"
                >
                  <Star className="h-3 w-3 fill-current" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="relative pt-8 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {tier.icon && <tier.icon className="h-5 w-5 text-primary" />}
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground text-lg">
                    {tier.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <Link href={tier.href}>
                  <Button
                    size="lg"
                    variant={tier.ctaVariant}
                    className={cn(
                      "w-full mb-6",
                      tier.popular && "btn-hover-lift"
                    )}
                  >
                    {tier.popular && <Zap className="h-4 w-4 mr-2" />}
                    {tier.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="rounded-full p-0.5 bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            🎓 50% student discount available with valid student ID
          </p>
          <p className="text-xs text-muted-foreground">
            Cancel anytime • No hidden fees • 14-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
