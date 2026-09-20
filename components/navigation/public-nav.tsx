"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicNavProps {
  ownerName?: string;
  professionalTitle?: string;
  profileImageUrl?: string | null;
  calendlyUrl?: string;
}

export function PublicNav({
  ownerName = "Enioluwa Afolalu",
  professionalTitle = "Product Designer · UI/UX Designer",
  profileImageUrl,
  calendlyUrl = "https://calendly.com",
}: PublicNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About Me" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        {/* Left Side: Profile & Title */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 transition-opacity hover:opacity-90"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-surface-border bg-surface">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={ownerName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="40px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wider text-editorial-300">
                EA
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-editorial-50">
              {ownerName}
            </span>
            <span className="text-xs font-medium text-editorial-400">
              {professionalTitle}
            </span>
          </div>
        </Link>

        {/* Right Side: Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-editorial-50",
                      isActive
                        ? "text-editorial-50 font-semibold"
                        : "text-editorial-400"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Book a Call Button */}
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-editorial-200/20 bg-surface px-4 py-2 text-xs font-medium text-editorial-100 transition-all hover:border-editorial-200/40 hover:bg-surface-hover"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-editorial-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-editorial-100" />
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-editorial-100"
          >
            Book a Call
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface text-editorial-300 transition-colors hover:bg-surface-hover hover:text-editorial-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-surface-border bg-background/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col space-y-4 text-base font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block py-1 transition-colors",
                      isActive
                        ? "text-editorial-50 font-semibold"
                        : "text-editorial-400 hover:text-editorial-100"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
