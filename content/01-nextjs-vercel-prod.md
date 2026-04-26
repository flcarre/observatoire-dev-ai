# Module 01 — Next.js 16 + React 19.2 + Vercel Fluid (Avril 2026)

> Versions de référence : **Next.js 16.2.4** (avril 2026), **React 19.2** (octobre 2025), **Turbopack stable**, **Vercel Fluid Compute** par défaut.

## 1. Cache Components — le nouveau modèle mental

Next.js 16 (octobre 2025) a remplacé l'implicite `fetch` cache par les **Cache Components** : tout est dynamique par défaut, on opte explicitement pour le cache. Les flags `experimental.ppr` et `experimental.dynamicIO` ont été supprimés et fusionnés dans `cacheComponents`.

```ts
// next.config.ts
import type { NextConfig } from 'next'
const config: NextConfig = { cacheComponents: true }
export default config
```

### La directive `'use cache'`

Applicable au niveau fichier, composant ou fonction. Le compilateur dérive la clé de cache à partir de : `BuildID + FunctionID (hash de la signature) + arguments sérialisés + variables capturées`.

```tsx
// Niveau fonction — la closure devient partie de la clé
async function getOrders(filter: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`orders:${filter}`)
  return db.orders.findMany({ where: { status: filter } })
}

// Niveau composant — les props deviennent la clé
async function ProductCard({ id, locale }: { id: string; locale: string }) {
  'use cache'
  cacheTag(`product:${id}`)
  const p = await db.products.findUnique({ where: { id } })
  return <article lang={locale}>{p.title}</article>
}
```

### Règles dures (pièges qu'on connait après s'être brûlé)

- **Les arguments doivent être RSC-sérialisables** : primitives, plain objects, `Map`, `Set`, `Date`, `TypedArray`, JSX en pass-through. Les instances de classes, fonctions, `URL`, `Symbol`, `WeakMap`/`WeakSet` sont rejetés.
- **Pas de `cookies()` / `headers()` / `searchParams` à l'intérieur d'un scope `'use cache'`**. Lisez-les en dehors et passez les valeurs en argument. L'appel direct fail immédiatement ; une promise qui résout vers de la donnée dynamique cause un hang de 50 s avant l'erreur "Filling a cache during prerender timed out".
- **`React.cache` est isolé** dans `'use cache'`. Ne tentez pas de smuggler des valeurs.
- **Composition pass-through OK** : on peut accepter `children` ou un Server Action en prop sans casser la clé, tant qu'on n'introspecte pas dedans.

```tsx
// Pattern : children dynamiques, shell caché
export default async function Page() {
  const dynamic = await getCookies()
  return (
    <CachedShell header={<h1>Home</h1>}>
      <Dynamic data={dynamic} />
    </CachedShell>
  )
}
async function CachedShell({ header, children }: Props) {
  'use cache'
  const meta = await fetch('/api/meta')
  return <div>{header}{await meta.text()}{children}</div>
}
```

### `cacheLife`, `cacheTag`, `revalidateTag`, `updateTag`, `refresh`

Trois propriétés temporelles : **stale** (TTL client, minimum 30 s appliqué peu importe la config), **revalidate** (rafraichissement d'arrière-plan côté serveur), **expire** (TTL dur sans requête). Profils built-in : `default`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`.

L'API de mutation est la décision architecturale clef de Next 16 :

```ts
'use server'
import { revalidateTag, updateTag, refresh } from 'next/cache'

// SWR — eventual consistency, pour du contenu peu critique
revalidateTag('blog-posts', 'max')
revalidateTag('products', { expire: 3600 })

// Read-your-writes — pour les forms / settings, lecture fraiche immédiate
export async function saveProfile(id: string, data: Profile) {
  await db.users.update(id, data)
  updateTag(`user:${id}`)  // expire + force la prochaine lecture
}

// Refresh des composants non cachés uniquement (compteurs, métriques live)
export async function markRead(id: string) {
  await db.notifications.markRead(id)
  refresh()
}
```

### Variantes : `'use cache: remote'` et `'use cache: private'`

- **`'use cache: remote'`** : pour la donnée runtime partagée entre instances. Vercel KV, Redis. Roundtrip réseau ; coûts plateforme.
- **`'use cache: private'`** : pour la conformité (RGPD, etc.) où l'on doit appeler les API request-time depuis un cache scope. Per-user, dernière option.

> **Production warning** : sur serverless, le cache runtime ne persiste pas entre requêtes — différentes invocations peuvent toucher différentes instances. Le cache de build fonctionne normalement. En self-hosted, contrôlez via `cacheMaxMemorySize`.

## 2. PPR : shippé, mais comme une implémentation interne

PPR (Partial Prerendering) est désormais le détail d'implémentation sous Cache Components. Le modèle mental : les `<Suspense>` boundaries sont la couture entre le shell statique (prérendu) et les trous dynamiques (streamés à la requête). Si la route a au moins un segment `'use cache'`, le shell est build ; le reste streame.

```tsx
export default function Dashboard() {
  return (
    <>
      <CachedNav />                              {/* prérendu */}
      <Suspense fallback={<Skeleton/>}>
        <UserStats />                            {/* per-request */}
      </Suspense>
    </>
  )
}
async function UserStats() {
  const c = await cookies()
  const stats = await fetchStats(c.get('uid')!.value)
  return <Stats data={stats}/>
}
```

L'export de route `experimental_ppr` et le flag `experimental.ppr` ont été **supprimés** en v16. Codemod : `npx @next/codemod@canary upgrade latest`.

## 3. `after()` — post-response work, stable

Stable depuis **Next.js 15.1**. Dispo dans Server Components, `generateMetadata`, Server Functions, Route Handlers, et `proxy.ts` (renommé depuis `middleware.ts`).

```ts
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'

export async function POST(req: Request) {
  const order = await processOrder(req)
  // Dans Route Handlers + Server Functions, on PEUT lire cookies()/headers() dans after()
  after(async () => {
    const ua = (await headers()).get('user-agent')
    await analytics.track({ orderId: order.id, ua })
  })
  return Response.json({ id: order.id })
}
```

**Piège critique en Server Component** : `cookies()`/`headers()` ne sont pas appelables dans `after()` à l'intérieur d'une Page ou d'un Layout. Lisez-les avant et capturez par closure :

```tsx
async function DynamicChunk() {
  const session = (await cookies()).get('sid')?.value
  after(() => log({ session }))
  return <div>...</div>
}
```

Sous le capot, `after` utilise `waitUntil(promise)` du request context. Sur Vercel Pro, durée par défaut 300 s, max 800 s sous Fluid Compute.

## 4. `forbidden()` / `unauthorized()`

Arrivés en **15.1.0** derrière `experimental.authInterrupts: true` (toujours expérimental en 16.2 selon la doc, mais widely adopted). Lèvent des error boundaries qui rendent `forbidden.js` (403) ou `unauthorized.js` (401).

```ts
// next.config.ts
export default { experimental: { authInterrupts: true } }
```

```ts
// app/admin/page.tsx
import { forbidden, unauthorized } from 'next/navigation'
import { verifySession } from '@/lib/dal'

export default async function AdminPage() {
  const session = await verifySession()
  if (!session) unauthorized()
  if (session.role !== 'admin') forbidden()
  return <Admin />
}
```

Pas appelable dans le root layout. À pairer avec un Data Access Layer (cf. §7) pour centraliser l'authz.

## 5. Server Actions — modèle de sécurité 2026

Le modèle s'est stabilisé mais a subi une vraie pression CVE en 2025 :

- **CVE-2025-29927** (mars 2025) : bypass d'authz via middleware.
- **CVE-2025-55182 / CVE-2025-66478** ("React2Shell", oct. 2025) : RCE par déserialization de Server Functions.

Leçons opérationnelles :

1. **Ne reposez jamais sur le seul middleware pour l'authz**. Le middleware doit être un filtre allowlist ; faites la *vraie* authz dans l'action ou la page après re-lecture du cookie / de la session.
2. **Traitez chaque action comme un endpoint POST public**. Un attaquant qui possède l'ID d'action peut l'appeler avec n'importe quels arguments — les types TypeScript sont *effacés*.

### Encrypted closures

Les variables de closure sont chiffrées avec une clé privée par build avant aller/retour client. Chaque build rotate la clé — à pairer avec **Skew Protection** pendant les déploys. Override avec `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` pour multi-instance.

```ts
export default async function Page() {
  const publishVersion = await getLatestVersion()
  async function publish() {
    'use server'
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('version skew')
    }
    await doPublish()
  }
  return <button formAction={publish}>Publish</button>
}
```

`.bind(null, arg)` est l'**opt-out** : les arguments bound ne sont *pas* chiffrés. À utiliser uniquement pour la perf et avec des valeurs non sensibles.

### Checklist authz d'action

```ts
'use server'
import { z } from 'zod'
import { verifySession } from '@/lib/dal'

const Input = z.object({ id: z.string().uuid() })

export async function deletePost(raw: unknown) {
  const { id } = Input.parse(raw)              // les types TS sont des mensonges
  const user = await verifySession()           // ré-auth à chaque action
  if (!user) throw new Error('unauthenticated')
  if (!await canDeletePost(user, id)) throw new Error('forbidden')
  await db.posts.delete({ where: { id } })
  updateTag(`posts:${user.id}`)
}
```

### CSRF : built-in mais minimal

- Actions POST-only ; le runtime rejette les autres méthodes.
- Comparaison Origin / Host pour rejeter le cross-origin (avec support `X-Forwarded-Host` derrière proxy).
- Pas de tokens CSRF — la sanitization HTML reste votre responsabilité.

## 6. React 19.2 dans Next.js — patterns

### `use()` pour les promises

```tsx
import { use, Suspense } from 'react'

function Comments({ promise }: { promise: Promise<Comment[]> }) {
  'use client'
  const comments = use(promise)              // suspend jusqu'à résolution
  return <ul>{comments.map(c => <li key={c.id}>{c.body}</li>)}</ul>
}

export default function Post({ id }: { id: string }) {
  const promise = fetchComments(id)          // ne pas await — passer la promise
  return <Suspense fallback={<Skel/>}><Comments promise={promise}/></Suspense>
}
```

### Stack Actions

```tsx
'use client'
import { useActionState, useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'
import { addTodo } from './actions'

function Submit() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? '…' : 'Add'}</button>
}

export function TodoForm({ todos }: { todos: Todo[] }) {
  const [optimistic, addOptimistic] = useOptimistic(
    todos,
    (state, next: Todo) => [...state, { ...next, pending: true }]
  )
  const [state, action, pending] = useActionState(
    async (_prev: State, fd: FormData) => {
      const text = fd.get('text') as string
      addOptimistic({ id: crypto.randomUUID(), text })
      return await addTodo(text)
    },
    { error: null }
  )
  return (
    <form action={action}>
      {optimistic.map(t => <li key={t.id}>{t.text}{t.pending && '…'}</li>)}
      <input name="text" required/>
      <Submit/>
    </form>
  )
}
```

`useFormStatus` ne marche que dans un descendant d'un `<form>` réel ; placé ailleurs, retourne toujours `pending: false`. Les rollbacks `useOptimistic` sont automatiques au reject de l'action.

### View Transitions (React 19.2)

```ts
// next.config.ts
export default { experimental: { viewTransition: true } }
```

```tsx
import { ViewTransition } from 'react'

export function Card({ id }: { id: string }) {
  return (
    <ViewTransition name={`product-${id}`}>
      <Link href={`/p/${id}`}><img src={`/img/${id}.jpg`}/></Link>
    </ViewTransition>
  )
}
// dans /p/[id]/page.tsx
<ViewTransition name={`product-${params.id}`}>
  <img src={`/img/${params.id}.jpg`} className="hero"/>
</ViewTransition>
```

Support navigateurs ~78 % en mars 2026 ; Firefox derrière flag. Fallback en navigation instantanée ailleurs — safe à shipper.

### Décision Server vs Client Component

- Default Server. `'use client'` uniquement quand on a besoin de : state/effects, browser APIs, event handlers (sauf form actions), libs client-only, contexte qui varie par render.
- Pousser `'use client'` aussi profond que possible — feuilles, pas pages entières.
- Pour la donnée, préférer le DAL (§7) ; la frontière devient "où je rends ?" et non "où je fetch ?".

## 7. Data Access Layer (DAL) — pattern standard 2026

Le pattern recommandé par Vercel pour les nouveaux projets. Un module possède l'auth + l'access control ; les Server Components consomment des DTO.

```ts
// lib/dal.ts
import 'server-only'                          // build fail si importé côté client
import { cache } from 'react'
import { cookies } from 'next/headers'

export const verifySession = cache(async () => {
  const token = (await cookies()).get('AUTH_TOKEN')?.value
  if (!token) return null
  return await decryptAndValidate(token)      // retourne une instance User
})

export async function getProfileDTO(slug: string) {
  const viewer = await verifySession()
  const [row] = await sql`SELECT * FROM users WHERE slug = ${slug}`
  return {
    username: row.username,
    phone: viewer?.isAdmin || viewer?.team === row.team ? row.phone : null,
  }
}
```

Les Server Components ne voient que des DTO. Utiliser des `class` pour les rows raw — la sérialization RSC rejette les instances de classe, vous obtenez une erreur de build si vous passez accidentellement à un Client Component.

`experimental_taintObjectReference` et `experimental_taintUniqueValue` (`experimental.taint`) sont une defense-in-depth, mais ne couvrent pas les champs déstructurés — ne reposez pas dessus seul.

## 8. Plateforme Vercel 2026

### Fluid Compute (par défaut depuis avril 2025)

Remplace le serverless classique. Plusieurs invocations partagent une instance (Node.js, Python, Edge, Bun, Rust). Changements clefs :

- **In-function concurrency** : le travail I/O bound (streaming LLM, queries DB) ne bloque pas les instances ; le temps idle est réutilisé entre requêtes.
- **Bytecode caching** (Node 20+) coupe les cold starts après la première invocation.
- **Failover cross-AZ + cross-région** automatique.
- **Isolation d'erreur** : une exception non rattrapée drain les requêtes en cours sur l'instance puis redémarre le process ; ne crashe pas les co-tenants.

Durée par défaut : 300 s. Max : 300 s (Hobby), 800 s ≈ 13 min (Pro / Enterprise).

### Active CPU pricing (depuis juin 2025)

Le modèle qui rend les workloads IA enfin abordables :

| Métrique | Tarif |
|---|---|
| Active CPU (facturé seulement quand le CPU exécute) | 0,128 $/h |
| Provisioned Memory (disponibilité de l'instance) | 0,0106 $/GB-h |
| Invocations | par appel |

Les appels LLM/IA étant principalement de l'attente I/O, vous ne payez pas l'attente. Vercel cite ~90 % d'économies supplémentaires sur les workloads idle-heavy par-dessus les ~85 % déjà obtenus avec Fluid. Machine standard : 0,149 $/h utilisation pleine vs 0,318 $/h legacy.

### Vercel Sandbox (GA)

Primitive de compute pour exécuter du code non-trusté (output d'agent IA, scripts user). Microvms Firecracker, FS + réseau isolés, runtimes **node24 / node22 / python3.13**, démarrage sub-seconde. Remplace ou complète E2B pour beaucoup de cas.

```ts
import { Sandbox } from '@vercel/sandbox'

const sandbox = await Sandbox.create({ runtime: 'node24', timeout: 60_000 })
const result = await sandbox.runCommand({
  cmd: 'node',
  args: ['-e', userGeneratedCode],
})
console.log(result.stdout, result.exitCode)
await sandbox.stop()
```

### AI Gateway

Endpoint unique, centaines de modèles, compatible OpenAI Chat Completions / OpenAI Responses / Anthropic Messages, AI SDK v5/v6 native.

```ts
import { generateText } from 'ai'

const { text } = await generateText({
  model: 'anthropic/claude-opus-4.6',
  prompt: 'Summarize this PR',
  providerOptions: {
    gateway: {
      // BYOK — zéro markup, vos creds provider
      byok: { anthropic: { apiKey: process.env.ANTHROPIC_KEY } },
      // Routing + fallback automatique
      order: ['anthropic', 'bedrock', 'gcp-vertex'],
    },
  },
})
```

Observabilité built-in : traces de requêtes, tokens, TTFT, latence, dépense par provider/model/team. BYOK = zéro markup ; clés gérées Vercel = prix provider sans markup non plus.

### Edge vs Node — matrice de décision 2026

| Choisir Edge quand… | Choisir Node quand… |
|---|---|
| Latence critique au plus près de l'utilisateur (auth checks, A/B routing, rewrites) | N'importe quel API Node : `fs`, `crypto.createCipheriv` (la nouvelle Web Crypto en Edge couvre déjà beaucoup), `child_process`, `worker_threads` |
| Bundle ≤ 1–4 MB imports compris | Libs tierces lourdes (Prisma, la plupart des ORM, libs image) |
| Streaming HTML pour shell statique | Compute long (>10 s soutenu), travail Sandbox-style |
| Contenu personnalisé géographiquement | Auto-instrumentation OpenTelemetry, modules natifs |

> **Default 2026 : Node + Fluid Compute** sauf bénéfice edge mesuré. Fluid a largement comblé l'écart de cold start qui poussait historiquement vers l'edge.

### Cron, Queues, Functions

Vercel Cron déclaré dans `vercel.json` ; Hobby = 1/jour, Pro = 1/min. Pattern pour jobs : enqueue dans une action, `after()` pour traitement immédiat, Cron comme filet pour drainer la queue.

```json
// vercel.json
{ "crons": [{ "path": "/api/jobs/drain", "schedule": "*/5 * * * *" }] }
```

```ts
// app/api/jobs/drain/route.ts
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
    return new Response('Unauthorized', { status: 401 })
  await drainQueue()
  return Response.json({ ok: true })
}
```

## 9. Patterns de prod à grande échelle

### Couches de cache (modèle mental)

1. **Full route cache** (build-time prerender) — segments sans data dynamique + shell `'use cache'`.
2. **Data cache** (`'use cache'` avec `cacheLife`/`cacheTag`) — par fonction, par clé.
3. **Router cache** (client) — minimum 30 s stale ; le header `x-nextjs-stale-time` le communique.
4. **Remote cache** (`'use cache: remote'`) — handler plateforme, optionnel.

Layout déduplication (nouveauté v16) : une page avec 50 product links télécharge le layout partagé une seule fois sur tous les prefetch, pas 50 fois. Trade-off : plus de prefetch individuels, total de bytes plus petit.

### Streaming SSR avec Suspense — forme de prod

```tsx
export default function Page() {
  return (
    <>
      <CachedHeader/>                            {/* dans le shell statique */}
      <Suspense fallback={<Skel/>}>
        <AboveTheFold/>                          {/* stream high-priority */}
      </Suspense>
      <Suspense fallback={null}>
        <BelowTheFold/>                          {/* stream low-priority */}
      </Suspense>
    </>
  )
}
```

Évitez les waterfalls en hoistant les fetchs hors du await :

```tsx
// bon — parallèle
const userP = fetchUser(id)
const ordersP = fetchOrders(id)
return <><User promise={userP}/><Orders promise={ordersP}/></>
```

### `proxy.ts` (ex `middleware.ts`)

Renommé en v16 pour clarifier qu'il s'agit d'une primitive de réseau, pas de framework middleware. Tourne en **runtime Node.js uniquement**. Le filename `middleware.ts` marche toujours en Edge mais est déprécié.

```ts
// proxy.ts
import { NextResponse, type NextRequest } from 'next/server'

export default function proxy(req: NextRequest) {
  // allowlist routing seulement — JAMAIS comme authz
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!req.cookies.get('sid')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

> Leçon CVE-2025-29927 : **ne reposez jamais sur `proxy.ts` pour la sécurité**. Re-vérifiez en pages/actions.

### Monorepo : Turborepo 2.9 (2026)

Standard pour les orgs. La 2.9 reporte jusqu'à 96 % de gains de perf via combinaison de remote caching + agent IA + optimisation Sandbox. Structure type :

```
apps/
  web/                  # Next.js 16
  admin/                # Next.js 16
packages/
  ui/                   # shadcn primitives
  db/                   # drizzle schema + queries
  ai/                   # AI SDK wrapper, prompts
  config-eslint/
  config-tsconfig/
  config-tailwind/
turbo.json
```

### Image / Font

Defaults `next/image` modifiés en v16 : `minimumCacheTTL` 60 s → **4 h (14 400 s)**, `qualities` `[1..100]` → **`[75]`**, `imageSizes` retire `16`, `dangerouslyAllowLocalIP` bloque l'optimisation d'IP locales (mitigation SSRF), `maximumRedirects` capé à 3. `images.domains` est déprécié — utilisez `images.remotePatterns`.

```ts
// next.config.ts
export default {
  images: {
    qualities: [50, 75, 90],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }],
    minimumCacheTTL: 86400,
  },
}
```

`next/font/google` et `next/font/local` sont stables ; self-hostez les fonts critiques pour éviter le DNS tiers, utilisez `display: 'swap'` et `preload: true` au-dessus de la ligne de flottaison.

## 10. Build tooling — Turbopack production

Stable en **Next.js 16** (oct. 2025). Adoption : > 50 % dev / > 20 % prod sur 15.3+ au moment de la sortie v16. **Next.js 16.2** (mars 2026) reporte 400–900 % d'amélioration sur la compile avec le filesystem caching.

```ts
// next.config.ts
export default {
  experimental: { turbopackFileSystemCacheForDev: true },  // beta en 16.0, stable 16.1
}
```

Pour opt-out : `next dev --webpack` / `next build --webpack`. Babel auto-activé si une config babel est trouvée (n'erreur plus dur).

### Autres breaking changes v16 à retenir

- Node 20.9+ minimum, TS 5.1+ minimum.
- AMP entièrement supprimé.
- `next lint` supprimé — utilisez Biome ou ESLint directement. Codemod : `npx @next/codemod@canary next-lint-to-eslint-cli .`
- Accès sync à `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` retiré — il faut `await`.
- Les routes parallèles requièrent un `default.js` explicite ; build fail sans.
- React Compiler stable mais pas activé par défaut (coût de compile élevé). Activable via `reactCompiler: true`.

## Visualiser la stack complète

Le diagramme interactif [Stack Next.js + Vercel](/diagrammes#vercel-stack) montre les liens entre Fluid Compute, Server Components, Server Actions, AI Gateway, Sandbox, et les jobs durables.

## Ce qu'il faut emporter de ce module

1. **Cache Components inverse le défaut** : tout est dynamique, on opte explicitement pour le cache. Pensez en **shell statique + îlots dynamiques**, pas en "everything is static unless".
2. **Server Actions sont des endpoints publics**. Validez avec Zod, ré-authentifiez à chaque appel, n'utilisez jamais le middleware seul comme couche d'authz.
3. **DAL est le pattern data 2026** : un module qui possède auth + DTO ; les Server Components ne voient que des DTO.
4. **Fluid Compute + Active CPU rendent les workloads IA serverless économiquement viables** ; le default architectural a basculé du "Edge first" au "Node + Fluid".
5. **Vercel Sandbox** est l'execution primitive pour le code généré par agent — connaissez-le, c'est l'alternative à E2B.
6. **AI Gateway centralise** routing, fallback, observabilité, BYOK — adoptez-le tôt, vous ne reviendrez pas en arrière.

Sur cette plateforme, on va construire la couche IA dans le module suivant : [02-ai-sdk-6.md](./02-ai-sdk-6.md).
