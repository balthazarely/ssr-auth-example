import { Suspense } from "react";
import UserCard from "@/app/components/Settings/UserCard/UserCard";
import ProfileForm from "@/app/components/Settings/ProfileForm/ProfileForm";
import { getUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/users/users";
import { Skeleton } from "@/components/ui/skeleton";

async function SettingsContent() {
  const [user, profile] = await Promise.all([getUser(), getUserProfile()]);

  return (
    <div className="flex flex-col gap-6">
      {user && <UserCard user={user} />}
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-xl border">
        <div className="bg-muted/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-6 py-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="rounded-xl border p-6">
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsContent />
        </Suspense>
      </div>
    </div>
  );
}
