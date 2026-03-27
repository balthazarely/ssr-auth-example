import { getUser } from "@/lib/supabase/server";
import UserCard from "@/app/components/user-card";

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">Home</h1>
        {user && <UserCard user={user} />}
      </div>
    </div>
  );
}
