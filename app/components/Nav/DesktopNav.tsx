"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/workout", label: "New Workout" },
  { href: "/history", label: "History" },
  { href: "/exercises", label: "Exercises" },
  { href: "/settings", label: "Settings" },
];

function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 hidden border-b bg-background px-6 py-3 sm:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/home">
          <Image
            src="/lift-logo.png"
            alt="App logo"
            width={48}
            height={48}
            className="h-16 w-auto"
          />
        </Link>
        <NavLinks />
      </div>
    </nav>
  );
}
