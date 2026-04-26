export type DossierMeta = {
  slug: string;
  number: string;
  title: string;
  hook: string;
  href: string;
  readingTimeMin: number;
};

export type Dossier = DossierMeta & {
  content: string;
  raw: string;
};

export type DossierNavigationItem = Pick<DossierMeta, "slug" | "title" | "number"> | null;
