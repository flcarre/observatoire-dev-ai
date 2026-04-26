import { Sidebar } from "@/components/sidebar";
import { getAllModules } from "@/lib/modules";

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const modules = await getAllModules();
  const navItems = modules.map((m) => ({
    slug: m.slug,
    number: m.number,
    title: m.title,
    hook: m.hook,
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar modules={navItems} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
