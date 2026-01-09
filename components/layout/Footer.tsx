import Link from "next/link";
import { Heart, Github, Twitter, Linkedin } from "lucide-react";
import { APP_CONFIG, ROUTES } from "@/lib/utils/constants";
import { Button } from "@/components/ui/button";

const footerLinks = {
  product: [
    { label: "Simplify Text", href: ROUTES.SIMPLIFY_TEXT },
    { label: "Simplify URL", href: ROUTES.SIMPLIFY_URL },
    { label: "About", href: ROUTES.ABOUT },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
};

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/clarityweb",
    icon: Github,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/clarityweb",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/clarityweb",
    icon: Linkedin,
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="font-bold text-xl">
              <span className="text-primary">Clarity</span>
              <span className="text-muted-foreground">Web</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {APP_CONFIG.DESCRIPTION}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 text-muted-foreground hover:text-primary"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
            for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}
