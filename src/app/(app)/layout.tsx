import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { BottomNav, SideNav } from "@/components/navigation";
import { auth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <SideNav />
      <main className="md:ml-64 pb-20 md:pb-6">{children}</main>
      <BottomNav />
    </div>
  );
}
