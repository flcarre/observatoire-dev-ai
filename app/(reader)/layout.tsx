import { Sidebar } from "@/components/sidebar";
import { createAppUseCases } from "@/core/infrastructure/container";

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const { getReaderShell } = createAppUseCases();
  const { categoryItems, navItems, resourceItems } = await getReaderShell();

  return (
    <div className="flex min-h-screen">
      <Sidebar modules={navItems} categories={categoryItems} resources={resourceItems} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
