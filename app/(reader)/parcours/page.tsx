import { getAllModules } from "@/lib/modules";
import { ParcoursClient } from "./parcours-client";

export const metadata = {
  title: "Mon parcours",
  description: "Suivez votre progression à travers la formation. Stocké localement.",
};

export default async function ParcoursPage() {
  const modules = await getAllModules();
  const items = modules.map((m) => ({
    slug: m.slug,
    number: m.number,
    title: m.title,
    hook: m.hook,
    readingTimeMin: m.readingTimeMin,
  }));
  return <ParcoursClient modules={items} />;
}
