import UserCard from "@/app/components/user-card";
import ProfileForm from "@/app/components/Settings/ProfileForm/ProfileForm";
import { getUser } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/users/users";

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([getUser(), getUserProfile()]);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <div className="flex flex-col gap-6">
          {user && <UserCard user={user} />}
          {profile && <ProfileForm profile={profile} />}
        </div>
      </div>
    </div>
  );
}
