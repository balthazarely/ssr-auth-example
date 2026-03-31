import Navbar from "@/app/components/Nav/DesktopNav";
import MobileNav from "@/app/components/Nav/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background pb-20 sm:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
