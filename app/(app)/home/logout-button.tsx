"use client";

import { logoutAction } from "@/actions/users";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="lg"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await logoutAction();
        })
      }
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
