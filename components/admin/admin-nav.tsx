"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Wrench,
  Quote,
  User,
  Share2,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/tools", label: "Tools", icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/about", label: "About & Journey", icon: User },
  { href: "/admin/socials", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/messages", label: "Inquiries", icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-surface-border bg-surface flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-surface-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-editorial-100 flex items-center justify-center text-background font-bold text-xs">
              CMS
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-editorial-200">
                Enioluwa CMS
              </div>
              <div className="text-[10px] text-editorial-500">
                Product Design Studio
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "bg-editorial-100 text-background font-semibold"
                    : "text-editorial-400 hover:text-editorial-100 hover:bg-surface-hover"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-background" : "text-editorial-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-surface-border space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-editorial-400 hover:text-editorial-100 hover:bg-surface-hover transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            View Public Site
          </span>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
