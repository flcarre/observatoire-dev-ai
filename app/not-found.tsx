import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <div className="text-6xl font-semibold tracking-tight">404</div>
        <p className="mt-2 text-muted-fg">Module introuvable.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
