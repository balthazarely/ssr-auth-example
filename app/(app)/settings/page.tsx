import UserCard from "@/app/components/user-card";
import { getUser } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await getUser();
  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        {user && <UserCard user={user} />}
      </div>
    </div>
  );
}
