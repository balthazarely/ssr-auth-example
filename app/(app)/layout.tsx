import Navbar from "@/app/components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
