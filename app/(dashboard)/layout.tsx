import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar, Sidebar } from "@/components/layout";
import { ROUTES } from "@/lib/utils/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated userName={session.user.name ?? undefined} />
      <div className="flex">
        <Sidebar
          userName={session.user.name ?? undefined}
          userEmail={session.user.email ?? undefined}
        />
        <main
          id="main-content"
          className="flex-1 ml-16 lg:ml-64 p-6 transition-all duration-300"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
