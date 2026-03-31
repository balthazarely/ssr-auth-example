import { Suspense } from "react";
import { getUser } from "@/lib/supabase/server";
import LogoutButton from "@/app/(app)/home/logout-button";
import Link from "next/link";

const navLinks = [
  { href: "/workout", label: "New Workout" },
  { href: "/history", label: "History" },
  { href: "/exercises", label: "Exercises" },
  { href: "/settings", label: "Settings" },
];

async function NavUser() {
  const user = await getUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {user.email?.[0].toUpperCase()}
        </div>
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>
      <LogoutButton />
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 hidden border-b bg-background px-6 py-3 sm:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/home" className="font-semibold">
            MyApp
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <Suspense fallback={<div className="h-8 w-32 rounded-md bg-muted animate-pulse" />}>
          <NavUser />
        </Suspense>
      </div>
    </nav>
  );
}
