import { getUser } from "@/app/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function Dashboard() {
  const user = await getUser();

  const provider = user?.app_metadata?.provider ?? "email";
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        <div className="rounded-xl border  w-32 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl font-semibold text-white">
              {user?.email?.[0].toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-semibold">{user?.email}</p>
              <p className="text-sm capitalize text-gray-500">{provider}</p>
            </div>
          </div>

          <div className="divide-y border-t">
            <Row label="User ID" value={user?.id} mono />
            <Row label="Email" value={user?.email} />
            <Row
              label="Email verified"
              value={user?.email_confirmed_at ? "Yes" : "No"}
            />
            <Row label="Auth provider" value={provider} capitalize />
            <Row label="Member since" value={createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium ${mono ? "font-mono text-xs" : ""} ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
