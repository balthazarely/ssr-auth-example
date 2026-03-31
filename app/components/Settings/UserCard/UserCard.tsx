import { User } from "@supabase/supabase-js";

export default function UserCard({ user }: { user: User }) {
  const provider = user.app_metadata?.provider ?? "email";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const initials = user.email?.[0].toUpperCase() ?? "?";

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 border-b bg-muted/40 px-6 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.email}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
              {provider}
            </span>
            {user.email_confirmed_at && (
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="divide-y px-6">
        <Row label="User ID" value={user.id} mono />
        <Row label="Member since" value={createdAt} />
        <Row label="Last sign in" value={
          user.last_sign_in_at
            ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null
        } />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${mono ? "font-mono text-xs text-muted-foreground" : ""}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
