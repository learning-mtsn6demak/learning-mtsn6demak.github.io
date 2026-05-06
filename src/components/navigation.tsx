"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  PenTool,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

const navItems = [
  {
    label: "Beranda",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Materi",
    href: "/materi",
    icon: BookOpen,
  },
  {
    label: "Latihan",
    href: "/latihan",
    icon: PenTool,
  },
  {
    label: "Tugas",
    href: "/tugas",
    icon: ClipboardList,
  },
  {
    label: "Nilai",
    href: "/nilai",
    icon: GraduationCap,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 glass md:hidden"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 min-w-[56px]",
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative p-1.5 rounded-xl transition-all duration-300",
                  isActive && "gradient-teal shadow-md shadow-primary/25"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "text-white"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-all",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const userName = session?.user?.name ?? "User";
  const userRole = (session?.user as any)?.role ?? "siswa";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <aside
      id="side-nav"
      className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-border/40 glass z-40"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/30">
        <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center shadow-md shadow-primary/20">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">BelajarOnline</h1>
          <p className="text-[10px] text-muted-foreground">
            Platform Belajar Interaktif
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`sidenav-${item.label.toLowerCase()}`}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group",
                isActive
                  ? "gradient-teal text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-all",
                  !isActive && "group-hover:scale-110"
                )}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {isPending ? "..." : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {isPending ? "Memuat..." : userName}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {userRole}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Keluar"
            id="btn-signout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
