import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Link as LinkIcon,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";
import { auth } from "@/lib/auth";

// Prevent static generation for this page
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Dashboard - ClarityWeb",
  description: "Your ClarityWeb dashboard",
};

const stats = [
  {
    title: "Total Simplifications",
    value: "0",
    description: "All time",
    icon: FileText,
  },
  {
    title: "Favorites",
    value: "0",
    description: "Saved items",
    icon: Star,
  },
  {
    title: "This Week",
    value: "0",
    description: "Simplifications",
    icon: Clock,
  },
  {
    title: "Reading Time Saved",
    value: "0 min",
    description: "Total",
    icon: TrendingUp,
  },
];

const quickActions = [
  {
    title: "Simplify Text",
    description: "Paste text and simplify it instantly",
    href: ROUTES.SIMPLIFY_TEXT,
    icon: FileText,
  },
  {
    title: "Simplify URL",
    description: "Extract and simplify content from any URL",
    href: ROUTES.SIMPLIFY_URL,
    icon: LinkIcon,
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? "User";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet</p>
              <p className="text-sm">Start by simplifying some text or a URL</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
