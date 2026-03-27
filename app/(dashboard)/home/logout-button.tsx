"use client";

import { logoutAction } from "@/app/actions/users";
import { startTransition } from "react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => startTransition(async () => { await logoutAction(); })}
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
    >
      Sign out
    </button>
  );
}
