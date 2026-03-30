import Navbar from "@/app/components/DesktopNav/DesktopNav";
import MobileNav from "@/app/components/MobileNav/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 pb-20 sm:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
