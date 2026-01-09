import Link from "next/link";
import { ROUTES } from "@/lib/utils/constants";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-background via-background to-muted/30">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Simple header with logo */}
      <header className="relative z-10 p-6">
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-primary">Clarity</span>
          <span className="text-muted-foreground">Web</span>
        </Link>
      </header>

      {/* Main content centered */}
      <main
        id="main-content"
        className="relative z-10 flex-1 flex items-center justify-center px-4 py-8"
        tabIndex={-1}
      >
        <div className="w-full max-w-105 animate-scale-in">{children}</div>
      </main>

      {/* Minimal footer */}
      <footer className="relative z-10 py-6 px-4">
        <div className="text-center text-sm text-muted-foreground space-x-4">
          <Link
            href={ROUTES.ABOUT}
            className="hover:text-foreground transition-colors"
          >
            About
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-2">
          © {new Date().getFullYear()} ClarityWeb. Making text accessible for
          everyone.
        </p>
      </footer>
    </div>
  );
}
