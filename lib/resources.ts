import {
  computeResourceStats,
  getResourceAnchorId,
  indexResources,
  slugifyResourceTitle,
  type ResourceCategory,
  type WatchSource,
} from "@/core/domain/observatory";

export type {
  Freshness,
  IndexedResource,
  Resource,
  ResourceCategory,
  ResourceKind,
  ResourceStats,
  SourceType,
  WatchSource,
} from "@/core/domain/observatory";

export const watchSources: WatchSource[] = [
  {
    title: "AI Watchtower",
    owner: "Fabien Delbrayelle",
    url: "https://github.com/fdelbrayelle/ai-watchtower",
    importedAt: "2026-04-26",
    description:
      "Radar open source de 203 ressources autour du software engineering augmente par l'IA, avec extraction README vers JSON.",
    resourceCount: 203,
    selectedCount: 16,
    strategy:
      "Selection manuelle des ressources les plus proches de la cible senior: product engineering, harness, contexte, orchestration, observabilite, token economy, securite et limites.",
    categoryIds: [
      "product-engineering-architecture",
      "context-engineering",
      "agentic-coding",
      "long-running-multi-agent",
      "tools-platforms",
      "evals-quality",
      "observability-debugging",
      "inference-economy",
      "security-governance",
      "skepticism-research",
    ],
  },
];

export const resourceCategories: ResourceCategory[] = [
  {
    id: "product-engineering-architecture",
    title: "Product engineering & architecture",
    summary:
      "Comprendre le glissement du developpeur vers un role qui cadre le produit, l'architecture et la qualite des decisions.",
    whyItMatters:
      "Quand l'execution devient moins chere, les mauvaises specs, mauvais arbitrages et mauvaises frontieres systeme coutent plus vite.",
    dossierSlugs: ["00-etat-de-lart-2026", "12-process-equipe-genai"],
    resources: [
      {
        title: "The golden rules of agent-first product engineering",
        publisher: "PostHog",
        author: "PostHog",
        url: "https://posthog.com/newsletter/agent-first-product-engineering",
        date: "2026-04-08",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["ai-watchtower", "product-engineering", "agents", "mcp", "skills"],
        synthesis:
          "Retour terrain PostHog sur la construction de produits utilises par des agents: exposer les capacites au bon niveau d'abstraction, charger le contexte universel et ecrire des skills qui capturent le savoir produit.",
        articleSummary:
          "L'article explique que les agents ne doivent pas etre traites comme une simple fonctionnalite ajoutee au produit, mais comme une nouvelle surface d'interaction. PostHog partage cinq regles issues de la reconstruction de son architecture agent/MCP: donner aux agents les memes capacites que les utilisateurs, exposer le produit au bon niveau d'abstraction, charger le contexte universel des le depart, rediger des skills utiles et tester les agents comme de vrais utilisateurs. Le passage le plus concret concerne la generation controlee d'outils a partir d'endpoints types, avec opt-in explicite par equipe produit. L'article insiste aussi sur la valeur du contexte produit: taxonomie, dialecte SQL, contraintes de requete et savoir metier doivent etre disponibles sans que l'agent les redecouvre. La partie skills rappelle qu'il ne faut pas ecrire des manuels rigides, mais transmettre les conventions et jugements que seul un humain du domaine connait. Pour une equipe senior, c'est surtout un article d'architecture produit: construire pour agents demande API, permissions, traces, evals et empathie utilisateur.",
        seniorTakeaway:
          "Construire pour les agents ressemble a construire une nouvelle surface produit: API, permissions, semantique, contexte et confiance doivent etre designes ensemble.",
        useWhen:
          "Pour cadrer une strategie produit ou plateforme ou des agents doivent agir dans ton produit, pas seulement autour de ton code.",
      },
      {
        title: "What is a product engineer?",
        publisher: "PostHog",
        author: "PostHog",
        url: "https://posthog.com/product-engineer/what-is-a-product-engineer",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "durable",
        tags: ["ai-watchtower", "product-engineering", "role", "ownership"],
        synthesis:
          "Definition du product engineer comme profil qui combine sens produit, execution technique, ownership utilisateur et capacite a shipper sans silo strict.",
        articleSummary:
          "PostHog decrit le product engineer comme un developpeur qui ne se limite pas a livrer du code, mais prend responsabilite sur l'impact produit. Le texte oppose ce role au full-stack classique: le sujet n'est pas de connaitre chaque couche en profondeur, mais de travailler a rebours depuis l'experience utilisateur et le resultat business. Le product engineer parle aux utilisateurs, participe aux decisions roadmap, fait du support, arbitre l'UX et accepte de jeter des features qui ne servent plus. Dans un monde ou l'IA rend la production de code moins rare, l'article soutient que la valeur se deplace vers le choix du bon probleme, la qualite du jugement et la boucle d'apprentissage. Le handbook est presente comme un document vivant pour aider les engineers a adopter ces comportements sans attendre une reorganisation formelle. Pour l'observatoire, l'interet est de cadrer le role senior post-IA: moins specialiste de syntaxe, plus proprietaire du systeme produit.",
        seniorTakeaway:
          "L'IA accelere ce profil: plus le code est delegable, plus la valeur vient de la boucle probleme, decision, livraison, mesure.",
        useWhen:
          "Pour repositionner le role senior dans une equipe ou les frontieres PM/design/dev bougent.",
      },
      {
        title: "AI Codebase Maturity Model",
        publisher: "arXiv",
        author: "arXiv",
        url: "https://arxiv.org/abs/2604.09388",
        date: "2026-04",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "codebase-readiness", "architecture", "automation"],
        synthesis:
          "Propose un cadre pour evaluer la maturite d'un codebase face au developpement assiste par IA: structure, testabilite, documentation, automatisation et lisibilite machine.",
        articleSummary:
          "Le papier propose l'AI Codebase Maturity Model, un modele en cinq niveaux inspire de CMMI pour faire evoluer un codebase depuis l'assistance ponctuelle jusqu'a des boucles de developpement presque auto-entretenues. L'auteur l'ancre dans une experience de quatre mois sur KubeStellar Console, avec Claude Code, Copilot, une CI/CD dense, des suites de tests nocturnes et une couverture annoncee elevee. La these centrale est que la performance d'un systeme de developpement IA ne reside pas seulement dans le modele, mais dans l'infrastructure autour: instructions, tests, metriques, workflows et feedback loops. Chaque niveau debloque le suivant par l'ajout d'un mecanisme de feedback plus fiable. Le papier insiste notamment sur la testabilite comme investissement majeur: sans tests nombreux, rapides et stables, les agents ne peuvent pas progresser sans surveillance excessive. Pour une equipe, c'est un bon support d'audit: avant de vouloir des agents autonomes, il faut mesurer si le repo est observable, executable et comprehensible par machine.",
        seniorTakeaway:
          "Avant de demander plus aux agents, rends le codebase lisible, testable et instrumente; sinon l'IA amplifie la friction existante.",
        useWhen:
          "Pour auditer un repo avant adoption d'agents de code ou avant un programme de modernisation.",
      },
      {
        title: "Everything I Learned About Harness Engineering and AI Factories in San Francisco",
        publisher: "Escape",
        author: "Escape",
        url: "https://escape.tech/blog/everything-i-learned-about-harness-engineering-and-ai-factories-in-san-francisco-april-2026/",
        date: "2026-04-03",
        kind: "case-study",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "harness", "ai-factory", "product-strategy"],
        synthesis:
          "Field report de discussions avec CTO, CPO et leaders engineering a San Francisco sur la montee du harness, des AI factories et du role de builder.",
        articleSummary:
          "Ce retour de terrain synthetise des conversations avec fondateurs, CTO, CPO et builders rencontres a San Francisco fin mars 2026. L'auteur clarifie plusieurs termes souvent melanges: le modele est la couche d'intelligence, le harness rassemble contexte, outils, runtime, permissions et verification, l'agent est une boucle outillee, et l'AI factory est le systeme organisationnel qui transforme l'intention en travail livre. Le texte rapporte un signal fort d'acceleration depuis fin 2025, mais le traite comme un indicateur directionnel plutot qu'une mesure universelle. Il explique que l'avantage ne vient pas seulement de coder plus vite, mais de raccourcir les boucles build-review-ship-learn. Le rapport met aussi en garde contre le vibe coding non structure pour les contextes ou exactitude, repetabilite et regulation comptent. Pour une equipe senior, la lecture sert a separer hype et operating model: les organisations performantes construisent des harness, des boucles de revue et des pratiques produit autour des agents.",
        seniorTakeaway:
          "Le bottleneck se deplace vers strategie produit, revue, orchestration et apprentissage organisationnel; la vitesse d'implementation ne sauve pas une mauvaise direction.",
        useWhen:
          "Pour ouvrir une discussion direction/engineering sur ce qu'une adoption agentique change vraiment dans l'operating model.",
      },
      {
        title: "The Post-Developer Era",
        publisher: "Josh W. Comeau",
        author: "Josh W. Comeau",
        url: "https://www.joshwcomeau.com/blog/the-post-developer-era/",
        date: "2025",
        kind: "community",
        sourceType: "community",
        freshness: "durable",
        tags: ["ai-watchtower", "career", "craft", "developer-role"],
        synthesis:
          "Reflexion de praticien sur ce qui reste du metier quand l'IA genere de plus en plus de code: gout, comprehension, debugging, coherence produit et responsabilite.",
        articleSummary:
          "Josh Comeau revient sur les predictions de disparition des developpeurs et constate que les outils IA ont progresse sans supprimer le besoin de jugement humain. Il distingue code genere et travail logiciel: meme quand une part importante du code commite vient d'une IA, un developpeur qualifie reste au volant pour cadrer, corriger, integrer et assumer le resultat. L'article decrit l'agent comme un regulateur de vitesse utile mais dangereux si l'on lache le volant: les sorties peuvent sembler bonnes tout en derivant lentement hors des contraintes du projet. Il mobilise aussi des retours terrain et l'etude METR pour montrer l'ecart entre sensation de vitesse et productivite mesuree. La partie carriere nuance le marche difficile: les licenciements, la macro et les mythes IA pesent autant que l'automatisation reelle. Le point important pour seniors est la responsabilite de transmission: utiliser l'IA sans comprendre peut eroder les competences necessaires pour reparer les systemes que l'IA produit.",
        seniorTakeaway:
          "Le craft ne disparait pas; il migre vers la capacite a juger, orienter et corriger des systemes qui produisent vite.",
        useWhen:
          "Pour alimenter une conversation de carriere senior sans tomber dans le fatalisme ou le hype pur.",
      },
    ],
  },
  {
    id: "context-engineering",
    title: "Context engineering",
    summary:
      "Concevoir ce que l'agent sait, oublie, retrouve et persiste pendant son travail.",
    whyItMatters:
      "La competence rare n'est plus seulement d'ecrire le bon prompt, mais de concevoir un systeme de contexte qui tient sur des taches longues.",
    dossierSlugs: ["11-context-engineering", "05-rag-moderne"],
    resources: [
      {
        title: "Effective context engineering for AI agents",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        date: "2025-09-29",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["context", "agents", "memory", "retrieval"],
        synthesis:
          "Formalise le passage du prompt engineering vers la gestion du contexte complet: instructions, outils, historique, fichiers, memoire, compaction et recherche just-in-time.",
        articleSummary:
          "Anthropic explique que le prompt engineering ne suffit plus pour les agents capables de travailler sur plusieurs tours et avec des outils. Le vrai probleme devient de choisir quels tokens doivent etre presents au moment de l'inference: instructions systeme, exemples, descriptions d'outils, historique, resultats de recherche, fichiers, notes et memoire. L'article insiste sur le fait que le contexte est une ressource finie: plus on ajoute de contenu, plus l'attention du modele se dilue et plus le risque de confusion augmente. Les bons agents utilisent donc du contexte minimal mais riche, charge au bon moment. Anthropic decrit aussi le just-in-time retrieval, ou l'agent conserve des references legeres puis va chercher les donnees pertinentes par outils, au lieu de tout injecter en amont. Pour les taches longues, l'article met en avant la compaction, les notes structurees et les architectures multi-agents comme moyens de garder la coherence. C'est une lecture centrale pour penser AGENTS.md, CLAUDE.md, skills, retrieval et memoire comme une architecture, pas comme une collection de prompts.",
        seniorTakeaway:
          "Traite le contexte comme une ressource finie: moins de tokens, plus de signal, et des outils qui permettent a l'agent de charger ce dont il a besoin au bon moment.",
        useWhen:
          "Pour concevoir AGENTS.md, CLAUDE.md, skills, notes persistantes, compaction ou strategie de retrieval dans un gros repo.",
      },
      {
        title: "Best Practices for Claude Code",
        publisher: "Anthropic / Claude Code Docs",
        author: "Anthropic",
        url: "https://code.claude.com/docs/en/best-practices",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["claude-code", "context-window", "subagents", "verification"],
        synthesis:
          "Guide operationnel sur l'exploration d'un codebase, la planification, les permissions, les sous-agents, la gestion agressive du contexte et les sessions paralleles.",
        articleSummary:
          "La documentation Claude Code rassemble des pratiques tres concretes pour utiliser un agent CLI dans un vrai repo. Elle recommande de commencer par laisser l'agent explorer le codebase, lire les conventions et proposer un plan avant de modifier des fichiers. Le guide insiste sur la qualite des instructions locales: fichiers de contexte, commandes de test, conventions de style, contraintes de securite et attentes de revue doivent etre visibles pour l'agent. Il couvre aussi les permissions, l'usage des sous-agents, les sessions paralleles et la gestion du contexte quand une conversation devient longue. Le point fort est l'approche workflow: demander des petites etapes verifiables, faire lancer les tests, relire les diffs et recadrer rapidement. La documentation rappelle qu'un agent performant reste dependant de son environnement: scripts fiables, setup reproductible et feedback humain. Pour une equipe, c'est une base pour transformer une utilisation individuelle de Claude Code en discipline collective.",
        seniorTakeaway:
          "Les agents productifs ressemblent a des juniors tres rapides: ils ont besoin d'environnement, de verification et de recadrage tot, pas seulement d'une demande vague.",
        useWhen:
          "Pour definir les pratiques quotidiennes d'une equipe qui utilise Claude Code ou un agent CLI comparable.",
      },
      {
        title: "Equipping agents for the real world with Agent Skills",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
        date: "2025-10-16",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["skills", "progressive-disclosure", "procedural-knowledge"],
        synthesis:
          "Explique comment packager des instructions, scripts et ressources dans des dossiers que l'agent charge seulement quand ils sont pertinents.",
        articleSummary:
          "Anthropic presente les Agent Skills comme des paquets de capacites que l'agent peut charger a la demande. Une skill combine des instructions, des scripts, des fichiers de reference et parfois des ressources annexes dans une structure reutilisable. L'idee cle est la progressive disclosure: au lieu de saturer le contexte avec toutes les procedures possibles, l'agent identifie la skill pertinente puis charge seulement ce qui est necessaire. L'article positionne les skills comme un moyen de rendre les agents plus utiles dans le monde reel, ou les taches exigent des pratiques locales, des formats precis et des outils specifiques. Le contenu d'une bonne skill ressemble moins a un tutoriel exhaustif qu'a une procedure executable avec exemples et contraintes. Pour une organisation, cela permet de transformer du savoir tacite en routines partagees: release, QA, documents, presentations, migrations, design review ou operations. Le message senior est qu'une skill est une interface de connaissance maintenable entre l'equipe et ses agents.",
        seniorTakeaway:
          "Les skills transforment le savoir d'equipe en capacites reutilisables; c'est une forme d'onboarding executable pour agents.",
        useWhen:
          "Pour capturer les pratiques internes de release, QA, docs, design review ou migration dans un format portable.",
      },
      {
        title: "Code execution with MCP: Building more efficient agents",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/code-execution-with-mcp",
        date: "2025-11-04",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["mcp", "tools", "execution", "efficiency"],
        synthesis:
          "Montre l'interet de rapprocher les agents des outils d'execution et de standardiser les interfaces via MCP.",
        articleSummary:
          "L'article explique pourquoi le simple appel d'API depuis un modele ne suffit pas pour construire des agents efficaces. Anthropic montre que donner a l'agent un environnement d'execution proche du travail reel lui permet de tester, inspecter, transformer et verifier au lieu de seulement raisonner sur du texte. MCP sert ici de contrat standardise entre l'agent et ses outils: fichiers, commandes, bases de donnees, services internes ou environnements specialises. Le texte insiste sur le cout du contexte: une bonne interface outil doit renvoyer des resultats exploitables, pas des dumps bruts qui saturent la fenetre. Il met aussi en avant la separation entre le modele, le runtime et les outils, ce qui rend le systeme plus composable et plus gouvernable. Pour une equipe plateforme, la question devient: quelles operations exposer, avec quelles permissions, quelles erreurs et quelles sorties? L'interet est de concevoir les outils internes comme des APIs pour agents autant que pour humains.",
        seniorTakeaway:
          "Un bon agent est autant une question de contrats d'outils que de modele: le design de l'interface outil determine beaucoup de fiabilite.",
        useWhen:
          "Pour connecter des outils internes, environnements de build, bases documentaires ou actions metier a un agent.",
      },
      {
        title: "Fast regex search: indexing text for agent tools",
        publisher: "Cursor",
        author: "Cursor",
        url: "https://cursor.com/blog/fast-regex-search",
        date: "2026-03-23",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["search", "monorepo", "agent-tools", "indexing"],
        synthesis:
          "Cursor explique pourquoi les agents ont encore besoin de recherche texte ultra-rapide, notamment dans les monorepos ou ripgrep devient un goulot.",
        articleSummary:
          "Cursor part d'un constat simple: malgre les index semantiques et les LSP, les agents utilisent encore massivement grep et les recherches regex. Certaines questions ne se resolvent pas par recherche vectorielle: il faut trouver un identifiant exact, un pattern, une chaine de configuration ou une signature precise. Dans les grands monorepos, ripgrep reste tres bon mais doit scanner beaucoup de fichiers, ce qui peut ralentir l'agent et casser l'interaction. L'article explique les bases des index inverses, des trigrams et de la decomposition regex pour prefiltrer les fichiers candidats avant la recherche classique. Le point important est que la recherche texte devient une primitive agentique, pas un outil legacy. Les agents ont besoin de retrouver rapidement du contexte frais, local et exact, en complement des outils semantiques. Pour les equipes qui construisent une plateforme de dev IA, l'article montre que l'infrastructure de recherche bas niveau influence directement la qualite du raisonnement agent.",
        seniorTakeaway:
          "Le contexte n'est pas seulement semantique: les recherches exactes, fraiches et locales restent critiques pour eviter les errances couteuses.",
        useWhen:
          "Pour reflechir a l'outillage des agents dans un grand codebase ou une plateforme interne.",
      },
      {
        title: "Knowledge Priming",
        publisher: "Martin Fowler",
        author: "Martin Fowler",
        url: "https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html",
        date: "2025",
        kind: "engineering",
        sourceType: "independent",
        freshness: "durable",
        tags: ["ai-watchtower", "knowledge-priming", "context", "team-knowledge"],
        synthesis:
          "Montre comment reduire la friction IA en rendant les connaissances implicites disponibles avant que l'agent ne tente de resoudre le probleme.",
        articleSummary:
          "L'article presente le knowledge priming comme une forme de RAG manuel: fournir au modele, avant le travail, le contexte specifique qui doit dominer les patterns generiques appris sur Internet. Rahul Garg part d'un probleme familier: un assistant peut produire du code syntaxiquement correct mais faux pour le codebase, parce qu'il ignore Fastify vs Express, les conventions de services, la gestion des cookies ou les choix d'architecture locaux. Il compare l'agent a un nouveau membre d'equipe: competent, mais inutilisable sans onboarding. Le texte propose une hierarchie du savoir ou les priming documents passent devant la conversation courante et les donnees d'entrainement. Il decrit ensuite le contenu utile d'un document de priming: architecture, versions, sources de connaissance, structure projet, conventions de nommage, exemples et anti-patterns. Le message operationnel est fort: le contexte ne doit pas dependre d'un copier-coller ad hoc, mais devenir une infrastructure versionnee, maintenue et relue.",
        seniorTakeaway:
          "Le contexte utile n'est pas seulement dans le repo: decisions passees, vocabulaire metier et contraintes locales doivent devenir consultables.",
        useWhen:
          "Pour transformer des docs d'equipe, ADR et notes produit en contexte exploitable par agents.",
      },
      {
        title: "Spec-Driven Development: Tools",
        publisher: "Martin Fowler",
        author: "Martin Fowler",
        url: "https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html",
        date: "2026",
        kind: "engineering",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "spec-driven", "tools", "context-engineering"],
        synthesis:
          "Analyse comment les outils de spec-driven development changent le point de depart du travail IA: la spec devient un artefact actif qui pilote generation et verification.",
        articleSummary:
          "Birgitta Bockeler compare trois approches de spec-driven development: Kiro, GitHub spec-kit et Tessl. L'article commence par une reserve importante: evaluer ces outils serieusement est couteux, surtout en brownfield, car il faut tester plusieurs tailles de problemes et relire les artefacts intermediaires avec attention. Kiro est presente comme le plus leger, avec un flux requirements, design, tasks et des fichiers markdown simples. Spec-kit ajoute une constitution, des templates, des checklists et une topologie de fichiers plus riche, ce qui le rend personnalisable mais potentiellement verbeux. Tessl pousse davantage l'idee de synchronisation entre specification et code. Les observations finales sont les plus utiles: le SDD n'est pas une pratique unique, les workflows peuvent etre surdimensionnes pour de petits changements, relire beaucoup de markdown peut etre moins efficace que relire du code, et les agents peuvent ignorer ou sur-appliquer les consignes. La valeur senior est donc de calibrer la granularite et de garder des boucles iteratives.",
        seniorTakeaway:
          "Plus les agents codent vite, plus la qualite de la specification devient un multiplicateur ou un point de casse.",
        useWhen:
          "Pour expliquer pourquoi ce projet utilise Spec Kit comme couche metier et pas seulement comme documentation.",
      },
    ],
  },
  {
    id: "agentic-coding",
    title: "Agentic coding & cloud agents",
    summary:
      "Deleguer du travail de dev a des agents qui lisent, modifient, testent et ouvrent des PR.",
    whyItMatters:
      "Le metier glisse du code ligne a ligne vers la decomposition, l'orchestration, la revue et l'amelioration des environnements.",
    dossierSlugs: ["03-workflow-agents-dev", "04-multi-agents-prod", "10-roadmap-personnelle"],
    resources: [
      {
        title: "Harness engineering: leveraging Codex in an agent-first world",
        publisher: "OpenAI Engineering",
        author: "OpenAI",
        url: "https://openai.com/index/harness-engineering/",
        date: "2026-02-11",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "harness", "agent-first", "prs"],
        synthesis:
          "Retour d'experience OpenAI sur un produit interne construit avec 0 ligne de code manuel, ou les humains pilotent l'environnement, les specs, les boucles de feedback et la lisibilite agent.",
        articleSummary:
          "OpenAI decrit le harness engineering comme le travail qui rend les agents vraiment productifs: environnement, instructions, tests, conventions, feedback et lisibilite future. Le cas raconte un produit interne construit sans ecriture manuelle directe de code, mais pas sans engineering: les humains cadrent le probleme, preparrent les specs, ameliorent le repo et verifient les resultats. L'article montre que le levier n'est pas seulement le modele, mais tout ce qui l'entoure. Un codebase agent-friendly doit etre facile a explorer, tester, modifier et comprendre par un agent qui arrive sans memoire locale. Les auteurs insistent aussi sur la boucle de feedback: chaque run doit laisser des traces et des apprentissages pour le prochain. Le role humain se deplace donc vers la conception du systeme de production de code. Pour des leads, c'est une lecture utile pour expliquer pourquoi CI, tests, structure repo et instructions sont des accelerateurs IA, pas de la bureaucratie.",
        seniorTakeaway:
          "Le levier se deplace vers le harness: templates, CI, conventions, instructions repo, tests et lisibilite future pour agents.",
        useWhen:
          "Pour comprendre ce qui change dans le role d'un staff/tech lead quand plusieurs agents produisent le code.",
      },
      {
        title: "Introducing the Codex app",
        publisher: "OpenAI",
        author: "OpenAI",
        url: "https://openai.com/index/introducing-the-codex-app/",
        date: "2026-02-02",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "desktop", "parallel-agents", "worktrees"],
        synthesis:
          "Positionne Codex comme un centre de commande pour gerer plusieurs agents, threads, worktrees, diffs et taches longues.",
        articleSummary:
          "L'annonce presente l'application Codex comme une interface pour piloter plusieurs agents de developpement plutot qu'un simple assistant de chat. Le produit organise des threads de travail, des diffs, des environnements et des taches paralleles afin qu'un developpeur puisse deleguer, suivre et revoir plusieurs chantiers. L'interet est de rendre visible le travail asynchrone: l'agent peut explorer, modifier, tester et revenir avec un resultat inspectable. L'article marque un changement d'ergonomie: l'outil de developpement devient un tableau de supervision ou l'humain gere des travaux en cours, pas seulement un editeur de fichiers. Cela implique aussi de nouvelles pratiques: bien nommer les taches, isoler les worktrees, comparer les propositions et garder une discipline de revue. Pour une equipe senior, la question n'est pas seulement d'adopter Codex, mais de definir comment ce mode multi-agent s'insere dans Git, CI, review et priorisation.",
        seniorTakeaway:
          "L'IDE n'est plus seulement un editeur: il devient un poste de supervision de travaux paralleles.",
        useWhen:
          "Pour evaluer comment organiser le travail multi-agent en local et dans le cloud.",
      },
      {
        title: "Codex for (almost) everything",
        publisher: "OpenAI",
        author: "OpenAI",
        url: "https://openai.com/index/codex-for-almost-everything/",
        date: "2026-04-16",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "computer-use", "automations", "memory"],
        synthesis:
          "Expose l'extension de Codex au-dela du code: navigateur integre, computer use, plugins, memoire et automations qui reprennent du contexte dans le temps.",
        articleSummary:
          "OpenAI presente Codex comme un agent de travail plus large que le coding pur. L'article met en avant le navigateur integre, l'usage de l'ordinateur, les plugins, la memoire et les automations capables de reprendre du contexte dans le temps. Cela deplace Codex vers des workflows ou l'agent peut verifier une UI, naviguer dans des outils, preparer des documents, suivre des PRs ou executer des taches recurrentes. Le signal important est l'extension de la surface d'action: l'agent n'est plus limite au repo, il peut traverser plusieurs applications de la chaine logicielle. Cette puissance augmente aussi le besoin de cadrage: permissions, traces, criteres de succes et limites de responsabilite doivent etre explicites. Pour des seniors, la ressource sert a anticiper la convergence entre coding agents, browser agents et assistants d'operations. Les equipes devront penser l'agent comme participant au cycle de vie logiciel complet, pas comme generateur de fonctions.",
        seniorTakeaway:
          "Les agents de dev deviennent des agents de cycle de vie logiciel: design, verification UI, docs, suivi de PR et taches recurrentes.",
        useWhen:
          "Pour suivre l'etat actuel des capacites Codex en avril 2026.",
      },
      {
        title: "The third era of AI software development",
        publisher: "Cursor",
        author: "Cursor",
        url: "https://cursor.com/blog/third-era",
        date: "2026-02-26",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["cursor", "cloud-agents", "autonomy", "artifacts"],
        synthesis:
          "Cursor decrit le passage de l'autocomplete aux agents synchrones, puis aux agents cloud autonomes sur des taches plus longues avec artefacts de revue.",
        articleSummary:
          "Cursor propose une lecture en trois periodes de l'IA pour developpeurs. La premiere est l'autocomplete, utile pour les taches repetitives et locales. La deuxieme est celle des agents synchrones, ou le developpeur dialogue avec un assistant capable de modifier plusieurs fichiers et d'utiliser des outils. La troisieme, selon Cursor, est celle des agents cloud qui travaillent plus longtemps, sur leurs propres machines, puis reviennent avec des artefacts de revue: logs, previews, enregistrements, resultats de tests. L'article explique que cela change le role humain: moins guider chaque action, davantage definir le probleme, fournir les outils et evaluer le resultat. Cursor partage aussi son usage interne, avec une part importante de PRs creees par des agents autonomes. Le texte reste promotionnel, mais utile comme signal de direction produit. Pour une equipe, il force a penser l'environnement, les artefacts de revue et la parallelisation avant de multiplier les agents.",
        seniorTakeaway:
          "La valeur senior devient de definir le probleme et les criteres de revue plutot que de surveiller chaque action.",
        useWhen:
          "Pour expliquer a une equipe pourquoi les workflows agents ne sont pas juste une version plus rapide de l'autocomplete.",
      },
      {
        title: "Run cloud agents in your own infrastructure",
        publisher: "Cursor",
        author: "Cursor",
        url: "https://cursor.com/blog/self-hosted-cloud-agents",
        date: "2026-03-25",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["self-hosted", "enterprise", "security", "cloud-agents"],
        synthesis:
          "Annonce les agents cloud self-hosted: les executions restent dans l'infrastructure client tandis que Cursor orchestre l'experience.",
        articleSummary:
          "Cursor annonce une option pour faire tourner les agents cloud dans l'infrastructure du client. Le probleme vise est typiquement enterprise: les agents distants sont attractifs pour la parallelisation et les taches longues, mais ils posent des questions de securite, secrets, acces reseau, donnees internes et conformite. Le modele self-hosted separe l'orchestration produit de l'execution: Cursor fournit l'experience utilisateur, tandis que le code et les runs restent dans un environnement controle par l'organisation. L'article est important parce qu'il montre que l'adoption agentique ne se joue pas seulement dans l'IDE ou le modele. Elle depend du runtime, des politiques d'acces, du reseau, de la reproductibilite et de l'audit. Pour les grandes organisations, c'est le type de fonctionnalite qui rend possible un passage de pilote individuel a usage equipe. Le bon sujet de discussion est l'architecture de confiance, pas seulement la qualite des suggestions.",
        seniorTakeaway:
          "Pour les entreprises, l'adoption agentique depend souvent plus de l'environnement, des secrets et de la conformite que du modele.",
        useWhen:
          "Pour discuter architecture d'adoption dans une organisation regulee ou gros monorepo interne.",
      },
      {
        title: "Background Agents",
        publisher: "Cursor Docs",
        author: "Cursor",
        url: "https://docs.cursor.com/en/background-agents",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["cursor", "background-agents", "remote-env", "security"],
        synthesis:
          "Documente les agents asynchrones Cursor: environnements distants, snapshots, commandes d'installation, terminaux, branches et risques de securite.",
        articleSummary:
          "La documentation des Background Agents de Cursor decrit comment lancer des agents asynchrones dans des environnements distants. Elle couvre les prerequis pratiques: creation d'environnement, installation des dependances, commandes de setup, snapshots, acces au terminal, branches et integration GitHub. Le point important est que l'agent travaille dans un espace separe du poste local, ce qui permet de deleguer des taches sans bloquer l'utilisateur. Mais cette autonomie introduit des risques: permissions, secrets, acces reseau, dependances non reproductibles et erreurs de branche peuvent transformer un run utile en dette de revue. La documentation rend visible le fait qu'un background agent est un systeme d'execution, pas une simple conversation. Pour une equipe, elle sert de checklist pour preparer un repo: setup deterministic, scripts fiables, CI, politiques d'acces et conventions de delegation. Sans cela, l'agent asynchrone risque surtout de produire des PRs difficiles a comprendre.",
        seniorTakeaway:
          "Un agent autonome a besoin d'un environnement reproductible et d'une politique de risque differente d'un assistant foreground.",
        useWhen:
          "Pour mettre en place des agents background sans sous-estimer setup, droits GitHub et exfiltration.",
      },
      {
        title: "Building Effective Agents",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        date: "2024-12-19",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["ai-watchtower", "agents", "workflow", "orchestration"],
        synthesis:
          "Cadre durable pour concevoir des workflows agents simples: commencer par des patterns controles avant de complexifier l'autonomie.",
        articleSummary:
          "Anthropic propose un cadre pragmatique pour construire des systemes agentiques sans commencer par l'autonomie maximale. L'article distingue les workflows, ou le LLM et les outils suivent des chemins de code predetermines, des agents, ou le modele decide dynamiquement quelles actions mener. Le conseil central est de partir de la solution la plus simple possible: souvent un appel LLM enrichi par retrieval ou exemples suffit. Quand la complexite est justifiee, les workflows apportent predictibilite pour des taches bien definies, tandis que les agents conviennent mieux aux problemes ouverts qui exigent adaptation et usage d'outils. Anthropic met aussi en garde contre les frameworks qui cachent prompts, reponses et erreurs sous trop d'abstraction. Le reste de l'article decompose des patterns utiles comme prompt chaining, routing, parallelisation, orchestrator-workers et evaluator-optimizer. Pour une equipe, c'est une grille de decision: ajouter de l'autonomie seulement quand le gain compense latence, cout et debuggage plus difficile.",
        seniorTakeaway:
          "La bonne architecture agentique est souvent sobre: workflow explicite, outils clairs, observation et escalation humaine avant autonomie totale.",
        useWhen:
          "Pour eviter de surconcevoir un systeme multi-agent alors qu'un workflow outille suffit.",
      },
      {
        title: "Agentic SDLC Handbook",
        publisher: "Daniel Meppiel",
        author: "Daniel Meppiel",
        url: "https://danielmeppiel.github.io/agentic-sdlc-handbook/",
        date: "rolling",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "sdlc", "agents", "delivery"],
        synthesis:
          "Handbook pratique pour appliquer les agents a tout le cycle de vie logiciel: ideation, specs, code, tests, review, release et operations.",
        articleSummary:
          "Ce handbook propose une methodologie complete pour passer d'une adoption opportuniste des assistants IA a un SDLC pense pour les agents. Il s'adresse a la fois aux leaders, qui doivent raisonner strategie, gouvernance, business case et structures d'equipe, et aux praticiens, qui cherchent des techniques concretes pour specifier, instrumenter, orchestrer et verifier. Le coeur du livre est le framework PROSE, presente comme un ensemble de contraintes architecturales pour rendre les sorties d'agents fiables, verifiables et maintenables. Le texte couvre l'instrumentation du codebase, la specification, le context engineering, l'orchestration multi-agent, le meta-process d'execution et les anti-patterns. Il inclut aussi des case studies tires de projets reels et assume que la methode elle-meme a servi a produire le handbook. Pour une equipe senior, ce n'est pas un tutoriel d'outil: c'est une cartographie des changements de process necessaires quand l'IA touche tout le cycle de livraison.",
        seniorTakeaway:
          "Le sujet n'est pas l'outil de coding isole, mais la reconfiguration du SDLC autour de points de controle humains.",
        useWhen:
          "Pour structurer une roadmap d'adoption IA dans une equipe produit/engineering.",
      },
    ],
  },
  {
    id: "team-process",
    title: "Travail d'equipe & operating model",
    summary:
      "Comment les agents entrent dans les tickets, PR, reviews, specs, Slack et responsabilites humaines.",
    whyItMatters:
      "L'IA change moins les ceremonies que les flux de responsabilite: qui delegue, qui valide, qui garde le contexte et qui reste accountable.",
    dossierSlugs: ["12-process-equipe-genai", "06-evals-observability"],
    resources: [
      {
        title: "Agent Interaction Guidelines",
        publisher: "Linear Developers",
        author: "Linear",
        url: "https://linear.app/developers/aig",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear", "agents", "ux", "accountability"],
        synthesis:
          "Principes pour integrer les agents comme acteurs visibles dans les workflows: identite claire, etat transparent, feedback immediat et responsabilite humaine finale.",
        articleSummary:
          "Les Agent Interaction Guidelines de Linear formalisent comment un agent doit apparaitre dans un outil de travail collaboratif. Le document insiste sur l'identite explicite de l'agent: les humains doivent savoir quand ils interagissent avec une personne, une integration ou un agent autonome. Les recommandations couvrent aussi l'etat du travail, les feedbacks de progression, les erreurs et la responsabilite finale. Un agent utile ne doit pas disparaitre dans un chat lateral; il doit etre representable dans les tickets, mentions, assignations, commentaires et historiques. La valeur de ces guidelines est de traiter l'agent comme un acteur de workflow soumis aux memes besoins de lisibilite que les humains: qui fait quoi, pourquoi, avec quel niveau de confiance et sous quelle supervision. Pour une equipe produit, c'est une ressource UX autant qu'architecture. Elle aide a eviter les agents magiques mais opaques qui creent de la confusion organisationnelle.",
        seniorTakeaway:
          "Un agent ne doit pas etre un acteur invisible: l'interface doit rendre delegation, etat et accountability impossibles a confondre.",
        useWhen:
          "Pour designer une integration agent dans Linear, Jira, GitHub, Slack ou un outil interne.",
      },
      {
        title: "How we use Linear Agent at Linear",
        publisher: "Linear",
        author: "Linear",
        url: "https://linear.app/now/how-we-use-linear-agent-at-linear",
        date: "2026-04-10",
        kind: "case-study",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear", "customer-feedback", "prd", "coding-agent"],
        synthesis:
          "Cas concret: un email client devient issue, triage, contexte produit, delegation a un coding agent, PR revue humainement, puis boucle de retour client.",
        articleSummary:
          "Linear montre trois workflows internes ou l'agent relie support, produit et engineering. Le premier transforme un email client en issue contextualisee, puis en triage, analyse de demandes similaires, delegation a un coding agent, PR revue par un humain et retour client. Le deuxieme part d'un thread Slack ambigu et utilise l'agent pour ramener du contexte produit, creer ou mettre a jour une issue, puis notifier le canal quand le bug est corrige. Le troisieme montre un PM qui remarque un manque produit, cree une issue et fait generer une premiere PR. L'article est fort parce qu'il ne vend pas seulement un agent qui code; il montre une boucle complete de travail, de la voix client jusqu'au follow-up. Linear insiste aussi sur l'autonomie progressive: commencer par suggestions et petits pas, puis deleguer davantage quand la fiabilite est prouvee. Pour une equipe senior, c'est un exemple concret d'operating model agentique.",
        seniorTakeaway:
          "Le workflow fort n'est pas 'agent ecrit du code', mais 'contexte client -> decision produit -> implementation -> feedback loop'.",
        useWhen:
          "Pour imaginer des process agents qui traversent CX, produit et engineering.",
      },
      {
        title: "AI Agents in Linear",
        publisher: "Linear Docs",
        author: "Linear",
        url: "https://linear.app/docs/agents-in-linear",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear", "delegation", "guidance", "agents"],
        synthesis:
          "Explique les agents comme app users: assignation, mentions, guidance d'organisation, vues de suivi et responsabilite humaine conservee.",
        articleSummary:
          "La documentation Linear explique comment les agents deviennent des utilisateurs applicatifs dans le systeme de travail. Ils peuvent etre assignes, mentionnes, suivre des issues, agir dans des workflows et recevoir de la guidance d'organisation. Le point important est la normalisation: l'agent n'est pas une boite noire externe, il apparait dans les memes objets que les humains et laisse des traces dans l'historique. Linear conserve cependant la responsabilite humaine: l'agent execute ou propose, mais les equipes doivent garder un proprietaire clair pour les decisions et la validation. La documentation couvre aussi les conventions d'usage qui rendent la delegation praticable: quand mentionner l'agent, comment cadrer une demande, comment suivre l'etat et comment relier son travail aux issues. Pour les leads, c'est un modele d'integration socio-technique: les agents doivent entrer dans le systeme de coordination existant, pas creer un second workflow parallele.",
        seniorTakeaway:
          "La delegation a un agent doit etre observable dans le systeme de travail, pas cachee dans un chat separe.",
        useWhen:
          "Pour definir les conventions d'assignation, de suivi et de guidance d'equipe.",
      },
      {
        title: "Introducing Linear Agent",
        publisher: "Linear Changelog",
        author: "Linear",
        url: "https://linear.app/changelog/2026-03-24-introducing-linear-agent",
        date: "2026-03-24",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear-agent", "skills", "automations", "code-intelligence"],
        synthesis:
          "Linear introduit un agent integre au produit, des skills reutilisables, automations de triage et code intelligence.",
        articleSummary:
          "Le changelog presente Linear Agent comme une evolution native de l'outil de product development. L'agent peut aider a creer, trier, enrichir ou manipuler des issues et projets dans Linear, en s'appuyant sur le contexte du workspace. La ressource mentionne les skills reutilisables, les automatisations de triage et la code intelligence comme briques pour relier intention produit et execution. L'interet n'est pas seulement une fonctionnalite d'IA dans l'interface: Linear positionne l'agent comme une couche d'orchestration qui vit dans le flux de travail. Cela permet de transformer des demandes floues, feedbacks ou discussions en artefacts plus exploitables. Pour une equipe senior, le point a retenir est la direction prise par les outils de planning: ils deviennent des lieux ou des agents lisent le contexte, proposent des actions et declenchent du travail dans d'autres systemes. Il faut donc penser droits, audit, conventions et responsabilite.",
        seniorTakeaway:
          "Les outils de product development deviennent eux-memes des surfaces d'orchestration d'agents.",
        useWhen:
          "Pour suivre l'evolution des outils de planning vers des systemes agents natifs.",
      },
      {
        title: "Linear for Agents",
        publisher: "Linear Changelog",
        author: "Linear",
        url: "https://linear.app/changelog/2025-05-20-linear-for-agents",
        date: "2025-05-20",
        kind: "product",
        sourceType: "primary",
        freshness: "durable",
        tags: ["agent-api", "teammates", "issues", "pr"],
        synthesis:
          "Lancement du modele ou les agents deviennent des utilisateurs applicatifs assignables et mentionnables comme des teammates.",
        articleSummary:
          "Linear for Agents introduit l'idee que les agents doivent etre traites comme des coequipiers applicatifs, avec identite, assignation, mentions et participation aux workflows. Le changelog signale un passage important: au lieu de rester dans des interfaces de chat separees, les agents peuvent interagir avec les issues, commentaires et objets de travail de Linear. Cela rend leur contribution plus visible et plus gouvernable. La ressource sert aussi de signal produit: les outils de gestion du travail s'adaptent aux agents en leur donnant des primitives sociales et operationnelles proches de celles des humains. Pour une organisation, cela pose les bonnes questions: comment nommer les agents, quels droits leur donner, qui approuve leurs actions, comment eviter les doublons et comment conserver l'audit trail. C'est une brique de design de workflow plus qu'une simple integration API.",
        seniorTakeaway:
          "Le 'travail avec IA' devient un probleme de systeme socio-technique: statuts, profils, droits et audit trail.",
        useWhen:
          "Pour concevoir une plateforme interne ou un agent est acteur explicite du workflow.",
      },
    ],
  },
  {
    id: "evals-quality",
    title: "Evals, qualite & revue",
    summary:
      "Mesurer les agents sur des taches reelles, pas seulement sur des benchmarks flatteurs.",
    whyItMatters:
      "Quand la production de code augmente, la contrainte se deplace vers la verification, la revue, les tests et la confiance.",
    dossierSlugs: ["06-evals-observability", "07-cout-securite-perf"],
    resources: [
      {
        title: "How we compare model quality in Cursor",
        publisher: "Cursor",
        author: "Cursor",
        url: "https://cursor.com/blog/cursorbench",
        date: "2026-03-11",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["evals", "cursorbench", "online-offline", "quality"],
        synthesis:
          "Cursor decrit un processus hybride d'evals offline et online pour garder les mesures alignees avec les vrais usages developpeurs.",
        articleSummary:
          "Cursor explique pourquoi les benchmarks publics deviennent insuffisants pour comparer des agents de code. Les taches reelles sont longues, ambiguës, multi-fichiers et dependantes du contexte produit, alors que beaucoup de benchmarks restent centres sur des bugs publics ou des problemes trop fermes. CursorBench est leur suite interne d'evals construite a partir de vraies sessions Cursor, avec des dimensions comme correction, qualite de code, efficience et comportement interactif. L'article insiste sur la separation entre evals offline et evals online: une suite interne peut classer les modeles, mais les experiences en production capturent les regressions de ressenti et d'usage. Il pointe aussi les problemes de contamination, d'underspecification et de saturation des benchmarks publics. Pour une equipe senior, c'est un modele de programme d'evaluation: partir des vrais workflows, mesurer plusieurs axes, et relier les scores a des signaux produit. Evaluer un agent, ce n'est pas seulement verifier une solution finale.",
        seniorTakeaway:
          "Les benchmarks publics ne suffisent pas: il faut mesurer correction, qualite, efficience et comportement interactif dans son contexte.",
        useWhen:
          "Pour creer un programme d'evaluation interne des modeles et agents.",
      },
      {
        title: "Demystifying evals for AI agents",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
        date: "2026-01-09",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["evals", "agents", "quality-gates"],
        synthesis:
          "Cadre pour penser les evals agents: objectifs, traces, criteres de succes et ecarts entre demos et fiabilite.",
        articleSummary:
          "Anthropic propose une methode pour construire des evals d'agents au-dela des demos impressionnantes. L'article recommande de definir clairement le comportement attendu, les criteres de succes et les types d'erreurs a capturer. Pour les agents, l'evaluation ne peut pas se limiter a la sortie finale: il faut regarder les traces, les appels outils, les decisions intermediaires, les recuperations d'erreur et la capacite a terminer une tache sans deriver. Le texte insiste aussi sur l'importance d'evals proches des usages reels, car un agent peut bien performer sur des cas synthetiques et echouer dans l'environnement de production. Les evals doivent donc etre iteratives: partir d'erreurs observees, les transformer en cas reproductibles, puis suivre les regressions. Pour les equipes, la lecon est de construire une boucle d'apprentissage, pas un score unique. C'est particulierement utile avant d'autoriser un agent a toucher a du code critique ou a des donnees sensibles.",
        seniorTakeaway:
          "Les evals doivent capturer le workflow et les erreurs observees, pas seulement une sortie finale jolie.",
        useWhen:
          "Pour formaliser des gates avant de laisser un agent toucher au code critique.",
      },
      {
        title: "Quantifying infrastructure noise in agentic coding evals",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/infrastructure-noise",
        date: "2026-02-05",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["evals", "infrastructure", "noise", "coding-agents"],
        synthesis:
          "Analyse comment l'environnement d'execution, les tests et l'infrastructure peuvent polluer l'interpretation des performances agents.",
        articleSummary:
          "Anthropic montre que les evals de coding agents mesurent souvent autant l'infrastructure que le modele. Un agent peut echouer a cause d'un environnement mal prepare, de dependances instables, de tests flaky, de reseau indisponible ou d'erreurs CI non liees a la qualite de sa solution. L'article explique que ce bruit fausse la comparaison entre modeles et peut pousser une equipe a optimiser le mauvais probleme. Pour fiabiliser une evaluation, il faut controler le setup, isoler les causes d'echec, rendre les runs reproductibles et collecter des traces suffisantes. Le texte rappelle aussi que les agents interagissent avec des systemes complexes: shell, package managers, tests, fichiers, services externes. Chaque couche peut introduire de la variance. Pour des leads, c'est une mise en garde importante: avant de conclure qu'un agent est mauvais, il faut verifier que le harness d'evaluation est sain. Sinon la mesure devient un miroir de la dette d'infrastructure.",
        seniorTakeaway:
          "Une eval agent mesure aussi ton harness. Si l'environnement est flaky, tu mesures le bruit autant que le modele.",
        useWhen:
          "Pour fiabiliser une suite de benchmarks internes ou une CI pilotee par agents.",
      },
      {
        title: "Copilot coding agent validates code security and quality",
        publisher: "GitHub Changelog",
        author: "GitHub",
        url: "https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/",
        date: "2025-10-28",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["copilot", "security", "quality", "validation"],
        synthesis:
          "GitHub ajoute des validations securite et qualite automatiques sur le code genere par Copilot coding agent.",
        articleSummary:
          "Le changelog GitHub annonce que Copilot coding agent valide automatiquement certains aspects de securite et de qualite du code qu'il produit. La ressource est courte, mais importante comme signal de plateforme: les fournisseurs integrent des garde-fous directement dans les workflows agentiques, car les PRs generees par agents augmentent le volume a relire. L'idee est de detecter plus tot des problemes qui ne devraient pas dependre uniquement d'une revue humaine manuelle. Cela s'inscrit dans une tendance plus large: les agents de code doivent arriver avec tests, scans, checks et explications, pas seulement un diff. Pour une equipe, le point a retenir est que la revue humaine ne disparait pas, mais doit etre completee par des validations automatiques specialisees. La question devient alors de comparer ce que la plateforme fournit par defaut avec les controles internes: SAST, dependances, politiques de repo, tests et quality gates.",
        seniorTakeaway:
          "Les plateformes commencent a integrer des garde-fous automatiques parce que la revue humaine seule ne scale pas.",
        useWhen:
          "Pour comparer ce que les plateformes de code review agentique fournissent nativement.",
      },
      {
        title: "Where Do AI Coding Agents Fail?",
        publisher: "arXiv / MSR 2026",
        author: "arXiv",
        url: "https://arxiv.org/abs/2601.15195",
        date: "2026-01-21",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["failed-prs", "github", "agents", "research"],
        synthesis:
          "Etude empirique de 33k PRs agent-authored pour comprendre les facteurs de merge, CI, review et echecs.",
        articleSummary:
          "Ce papier etudie 33 000 pull requests produites par cinq agents de code sur GitHub afin de comprendre pourquoi certaines sont mergees et d'autres non. Les auteurs comparent les resultats selon les types de taches, les changements de code, les resultats CI et les dynamiques de review. Les taches de documentation, CI et build updates semblent mieux reussir, alors que les taches de performance et bug fix sont plus difficiles. Les PRs non mergees tendent a toucher plus de fichiers, contenir des changements plus larges et echouer davantage en CI. L'analyse qualitative de 600 PRs fait ressortir des motifs que les metriques brutes ne capturent pas: manque d'engagement reviewer, doublons, features non desirees ou mauvais alignement avec l'intention du projet. Le papier montre donc que l'echec agentique est socio-technique. Pour une equipe senior, il aide a definir quelles taches deleguer, comment limiter la taille des PRs et quels signaux de review surveiller.",
        seniorTakeaway:
          "Les agents echouent dans des dynamiques socio-techniques, pas seulement par mauvaise generation de code.",
        useWhen:
          "Pour argumenter sur les risques de revue, CI et integration de PRs agents.",
      },
    ],
  },
  {
    id: "long-running-multi-agent",
    title: "Taches longues & multi-agents",
    summary:
      "Faire progresser plusieurs agents sur des travaux qui depassent une fenetre de contexte.",
    whyItMatters:
      "Les gains majeurs viennent de travaux longs, paralleles et verifiables, mais ils exigent structure, locks, logs et etat persistant.",
    dossierSlugs: ["04-multi-agents-prod", "11-context-engineering"],
    resources: [
      {
        title: "Effective harnesses for long-running agents",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
        date: "2025-11-26",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["long-running", "harness", "progress", "state"],
        synthesis:
          "Propose un pattern initializer agent + coding agent pour laisser un etat propre, incrementer et documenter le travail entre sessions.",
        articleSummary:
          "Anthropic analyse pourquoi les agents ont encore du mal avec des taches qui depassent une fenetre de contexte. Meme avec compaction, un agent peut essayer de tout faire d'un coup, laisser un chantier incomplet, puis repartir dans une nouvelle session sans comprendre l'etat precedent. L'article propose un harness en deux roles: un initializer agent prepare l'environnement, les scripts et les artefacts de suivi; les coding agents suivants font des progres incrementaux et laissent un etat propre. Le fichier de progression et l'historique Git deviennent des mecanismes de passage de relais. Le texte emprunte explicitement aux pratiques humaines: travailler par increments, documenter ce qui a ete fait, laisser un repo mergable et preparer le prochain intervenant. Pour une equipe, c'est une reference utile pour migrations, refontes et projets longs. Le message est clair: l'autonomie longue n'est pas magique, elle exige protocole, checkpoints et hygiene de repo.",
        seniorTakeaway:
          "La tache longue exige un protocole de passage de relais. Sans journal, checkpoints et objectifs incrementaux, l'agent recommence ou declare victoire trop tot.",
        useWhen:
          "Pour automatiser migrations, refontes ou projets qui se poursuivent sur plusieurs sessions.",
      },
      {
        title: "Building a C compiler with a team of parallel Claudes",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/building-c-compiler",
        date: "2026-02-05",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["parallel-agents", "compiler", "locks", "tests"],
        synthesis:
          "Experience de 16 agents construisant un compilateur C en Rust, avec locks de taches, conteneurs, tests et synchronisation Git.",
        articleSummary:
          "Anthropic raconte une experience ou seize instances de Claude travaillent en parallele pour construire un compilateur C en Rust. L'article est moins interessant pour le compilateur lui-meme que pour le systeme de coordination: decomposition des taches, locks, conteneurs, tests, synchronisation Git et arbitrage humain. Le projet montre que le multi-agent peut produire du travail substantiel quand les frontieres sont claires et que les conflits sont geres explicitement. Il montre aussi les limites: plus il y a d'agents, plus le cout d'integration, de coordination et de verification augmente. Les agents doivent pouvoir savoir quoi prendre, quoi ne pas toucher et comment valider leur contribution. Pour une equipe senior, c'est une experience de laboratoire qui donne des principes pratiques: decouper finement, isoler les environnements, rendre les tests rapides et definir des artefacts de synchronisation simples. Le multi-agent est un probleme d'architecture de travail autant que de modele.",
        seniorTakeaway:
          "Le multi-agent n'est utile que si le travail est decomposable, testable et synchronise par des artefacts simples.",
        useWhen:
          "Pour reflechir a la parallelisation d'un gros chantier technique.",
      },
      {
        title: "How we built our multi-agent research system",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/multi-agent-research-system",
        date: "2025-06-13",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["multi-agent", "research", "orchestrator", "workers"],
        synthesis:
          "Decrit une architecture de recherche multi-agent avec un orchestrateur qui distribue des sous-taches et synthetise les retours.",
        articleSummary:
          "Anthropic decrit son systeme de recherche multi-agent, construit autour d'un orchestrateur qui decompose une question, lance des agents travailleurs et consolide leurs resultats. L'article montre pourquoi un seul agent peut manquer de largeur d'exploration sur des problemes complexes: chaque sous-agent peut poursuivre une piste, accumuler du contexte specialise et produire un retour plus cible. L'orchestrateur sert a definir les sous-taches, eviter les doublons, combiner les evidences et produire une synthese finale. La ressource insiste aussi sur les couts: les systemes multi-agents consomment plus de tokens et demandent des taches qui justifient cette depense. Le pattern est particulierement adapte a la recherche ouverte, la veille, l'investigation technique et certains diagnostics codebase. Pour une equipe, c'est un modele durable d'orchestration: separer exploration, synthese et verification, plutot que faire porter toute la charge cognitive a une seule conversation longue.",
        seniorTakeaway:
          "Le pattern orchestrator-worker reste une brique durable pour isoler les contextes et paralleliser l'exploration.",
        useWhen:
          "Pour concevoir des agents de recherche technique, veille ou investigation codebase.",
      },
      {
        title: "Multi-Agents: What's Actually Working",
        publisher: "Cognition",
        author: "Cognition",
        url: "https://cognition.ai/",
        date: "2026-04-22",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["devin", "multi-agent", "cloud-agents"],
        synthesis:
          "Article recent signale par Cognition sur les patterns multi-agents qui marchent dans la pratique de Devin.",
        articleSummary:
          "La page Cognition reference un article recent intitule Multi-Agents: What's Actually Working, publie dans le contexte de Devin et des cloud agents. Meme si la page catalogue expose peu de contenu detaille, le signal est utile: Cognition met explicitement en avant les apprentissages pratiques autour de la gestion de plusieurs agents logiciels. Le contexte de l'entreprise est important: Devin est positionne comme un agent software engineer, et Cognition publie plusieurs notes rapprochées sur cloud agents, management de Devins et workflows multi-agents. Pour la Watchtower, cette entree sert donc de veille sur un acteur specialise dans l'autonomie logicielle. Elle doit etre lue comme un pointeur a suivre, pas comme une preuve independante. Le sujet a surveiller est la convergence entre acteurs: decomposition du travail, agents geres comme ressources, orchestration plus sobre, artefacts de revue et limites de parallelisation. Pour une equipe senior, l'interet est de comparer ces signaux avec les retours Anthropic, Cursor et OpenAI.",
        seniorTakeaway:
          "A suivre comme signal terrain: les labs d'agents convergent vers des formes d'orchestration plus sobres et verifiables.",
        useWhen:
          "Pour completer les retours Anthropic/OpenAI avec un acteur specialise agent logiciel.",
      },
      {
        title: "Spec Kit Agents: Context-Grounded Agentic Workflows",
        publisher: "arXiv",
        author: "arXiv",
        url: "https://arxiv.org/abs/2604.05278",
        date: "2026-04-07",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["spec-kit", "context-grounding", "sdd", "agents"],
        synthesis:
          "Propose d'ajouter des hooks de grounding et validation a chaque phase Spec Kit pour eviter hallucinations et violations d'architecture.",
        articleSummary:
          "Ce papier propose une extension de Spec Kit pour reduire le probleme des agents context-blind dans les grands repositories. Les auteurs ajoutent des hooks de grounding a chaque phase du workflow SDD: Specify, Plan, Tasks et Implement. Ces hooks forcent l'agent a sonder le repo en lecture seule, a ancrer ses artefacts dans des preuves existantes, puis a valider les resultats intermediaires contre l'environnement reel. Le pipeline introduit aussi des roles type PM et developpeur pour separer intention, planification et implementation. L'evaluation couvre 128 runs, 32 features et cinq repositories, avec une amelioration modeste mais mesurable de la qualite jugee, tout en conservant une compatibilite tres elevee avec les tests repo. L'idee importante est que la spec seule ne suffit pas: elle doit rester connectee au code vivant. Pour une equipe Spec Kit, c'est une piste pour eviter les APIs hallucinees et les violations d'architecture.",
        seniorTakeaway:
          "Spec-driven ne suffit pas: les specs doivent etre reconnectees au repo reel a chaque phase.",
        useWhen:
          "Pour renforcer un workflow Spec Kit dans un codebase brownfield.",
      },
    ],
  },
  {
    id: "observability-debugging",
    title: "Observabilite & debug black-box",
    summary:
      "Rendre visibles les traces, couts, decisions et echecs des agents qui manipulent du code et des donnees.",
    whyItMatters:
      "On ne peut pas operer un workflow agentique serieux avec seulement le dernier message du modele: il faut traces, replay, couts, evals et audit.",
    dossierSlugs: ["06-evals-observability", "07-cout-securite-perf"],
    resources: [
      {
        title: "AI Agent Observability",
        publisher: "Weights & Biases",
        author: "Weights & Biases",
        url: "https://wandb.ai/site/articles/ai-agent-observability/",
        date: "2025",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["ai-watchtower", "observability", "traces", "agents"],
        synthesis:
          "Cadre pour instrumenter les agents: traces, appels outils, couts, latence, qualite et comparaison entre runs.",
        articleSummary:
          "Weights & Biases explique pourquoi l'observabilite agentique depasse largement le monitoring applicatif classique. Un service traditionnel se surveille avec latence, erreurs et ressources; un agent peut repondre techniquement avec succes tout en prenant une mauvaise decision, en halluciant une contrainte ou en appelant le mauvais outil. L'article definit donc l'observabilite agent comme la collecte et l'analyse des raisonnements, appels outils, decisions, couts, latences, versions de prompts, modeles et configurations. Il insiste particulierement sur les systemes multi-agents, ou l'erreur visible dans un agent peut venir d'une derive de contexte ou de donnees plusieurs etapes plus tot. Les cinq piliers couvrent traces, metriques, evaluations, gouvernance et boucle d'amelioration. L'interet pour une equipe de dev est direct: avant de confier des workflows sensibles a un agent, il faut pouvoir rejouer, comparer, attribuer et auditer ce qui s'est passe.",
        seniorTakeaway:
          "Les agents doivent etre debuggables comme un systeme distribue: chaque decision importante doit laisser une trace exploitable.",
        useWhen:
          "Pour definir les signaux minimaux avant de deployer un agent dans un flux d'equipe.",
      },
      {
        title: "Langfuse",
        publisher: "Langfuse",
        author: "Langfuse",
        url: "https://langfuse.com/",
        date: "rolling",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["ai-watchtower", "llmops", "observability", "evals"],
        synthesis:
          "Plateforme open source de LLM observability: traces, prompts, scores, evals et couts pour applications et agents.",
        articleSummary:
          "La page presente Langfuse comme une plateforme open source d'LLM engineering qui couvre tracing, prompt management, evals, experiments, annotations humaines, couts et dashboards. Le positionnement important est l'integration du cycle complet: partir du prototype, observer la production, annoter ou scorer les traces, puis ameliorer prompts et agents avec des donnees reelles. Langfuse met en avant une compatibilite large avec frameworks, providers et langages via OpenTelemetry et de nombreuses integrations. Le produit insiste aussi sur le self-hosting, la licence MIT, les exports API et la capacite a traiter de gros volumes d'observations. Pour les agents de code, la page ajoute un signal interessant: CLI, MCP et skills permettent aux agents eux-memes de gerer une partie de l'instrumentation. C'est moins un article de doctrine qu'une reference outillage pour evaluer ce qu'une stack d'observabilite LLM doit couvrir en production.",
        seniorTakeaway:
          "Une stack agentique sans traces et evals finit vite en boite noire non gouvernable.",
        useWhen:
          "Pour choisir une base d'observabilite LLM/agent compatible open source.",
      },
      {
        title: "Entire",
        publisher: "Entire",
        author: "Entire",
        url: "https://entire.io/",
        date: "rolling",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["ai-watchtower", "session-recorder", "git", "agent-runs"],
        synthesis:
          "Enregistre les sessions agents via Git hooks afin de conserver transcript, prompts, outils, couts, fichiers modifies et checkpoints.",
        articleSummary:
          "Entire part d'une idee simple: un commit ne suffit plus a raconter comment du code a ete produit quand un agent a participe au travail. L'outil CLI s'accroche au workflow Git pour capturer les sessions d'agents a chaque push et les indexer a cote des commits. La page met l'accent sur l'absence de nouveau lieu de travail: les developpeurs restent dans leur terminal et leurs outils existants, tandis que les conversations, checkpoints et intentions deviennent consultables. Les integrations citees couvrent Claude Code, Gemini CLI, Cursor, OpenCode, GitHub Copilot CLI, avec Codex en preview. Pour les equipes, l'interet est l'audit trail: retrouver pourquoi un changement a ete fait, quel agent etait implique, quel contexte a guide la modification et comment partager cette memoire. C'est une brique utile pour les workflows ou review, compliance et passation de contexte comptent autant que le diff final.",
        seniorTakeaway:
          "Pour les agents de code, l'audit trail doit suivre le diff et le contexte de generation, pas seulement le commit final.",
        useWhen:
          "Pour evaluer comment archiver et revoir des runs agents dans un workflow Git.",
      },
    ],
  },
  {
    id: "inference-economy",
    title: "Economie du contexte & tokens",
    summary:
      "Reduire cout, latence et pollution du contexte avec des outils sobres, recherches precises et modeles adaptes.",
    whyItMatters:
      "A l'echelle d'une equipe, le contexte devient une ressource d'infrastructure: il se budgete, se route, se compresse et se debuggue.",
    dossierSlugs: ["07-cout-securite-perf", "11-context-engineering"],
    resources: [
      {
        title: "MCP is Dead, Long Live the CLI",
        publisher: "Eric Holmes",
        author: "Eric Holmes",
        url: "https://ejholmes.github.io/2026/02/28/mcp-is-dead-long-live-the-cli.html",
        date: "2026-02-28",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "mcp", "cli", "debuggability", "tokens"],
        synthesis:
          "Position critique: beaucoup de cas MCP seraient mieux servis par des CLI composables, debuggables et deja comprises par humains et agents.",
        articleSummary:
          "Eric Holmes remet en question l'enthousiasme automatique autour de MCP pour connecter les agents aux outils. Son argument n'est pas que les protocoles sont inutiles, mais que beaucoup de cas d'usage peuvent etre mieux servis par des interfaces CLI deja robustes, composees, observables et faciles a debugguer. Une CLI fonctionne pour les humains comme pour les agents, s'integre aux shells, logs, permissions et pipelines existants, et n'ajoute pas forcement une couche de serveur ou de schema a maintenir. L'article invite a regarder le cout complet de l'interface outil: auth, distribution, compatibilite, sorties verbeuses, experience de debug et charge cognitive. Pour une equipe senior, c'est un bon antidote au reflexe 'nouveau protocole = meilleure architecture'. Le vrai critere est la qualite du contrat entre agent et systeme: predictibilite, composabilite, moindre pollution du contexte et capacite a diagnostiquer les erreurs.",
        seniorTakeaway:
          "La meilleure interface outil n'est pas toujours le protocole le plus neuf; debuggabilite, auth, composition et cout contexte comptent.",
        useWhen:
          "Pour arbitrer entre MCP, CLI, API interne ou skill dans un environnement agentique.",
      },
      {
        title: "RTK",
        publisher: "rtk-ai",
        author: "rtk-ai",
        url: "https://github.com/rtk-ai/rtk",
        date: "rolling",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "token-reduction", "claude-code", "tool-output"],
        synthesis:
          "Outil Rust qui filtre et compresse les sorties d'outils avant qu'elles ne reviennent dans le contexte de Claude Code.",
        articleSummary:
          "RTK est un proxy CLI qui s'intercale entre l'agent et des commandes de developpement courantes pour reduire la consommation de tokens. Le README montre le principe: au lieu de renvoyer a Claude une sortie brute de git, grep, diff ou logs, RTK execute la commande puis applique filtrage intelligent, regroupement, troncature et deduplication. L'objectif annonce est de garder le signal utile tout en supprimant commentaires, bruit, repetitions et details non pertinents. Les commandes couvrent lecture de fichiers, arbres de repertoire, recherche, grep, diff et resumes de code. Pour les agents, ce type d'outil traite une cause concrete de degradation: ce ne sont pas seulement les prompts qui saturent le contexte, mais les sorties d'outils trop longues. Pour une equipe, RTK sert de rappel architectural: optimiser le canal outil-agent peut etre aussi rentable que changer de modele.",
        seniorTakeaway:
          "La pollution du contexte vient souvent des sorties brutes, pas seulement des prompts; optimiser les tool outputs est un levier concret.",
        useWhen:
          "Pour des repos ou commandes tres verbeuses qui degradent la qualite et le cout des sessions agents.",
      },
      {
        title: "Serena",
        publisher: "oraios",
        author: "oraios",
        url: "https://github.com/oraios/serena",
        date: "rolling",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "code-intelligence", "mcp", "language-server"],
        synthesis:
          "Serveur outille par language servers pour donner aux agents une comprehension symbolique du code au lieu de tout charger en texte.",
        articleSummary:
          "Serena se presente comme un IDE pour agents de code, expose via MCP, qui donne acces a des operations semantiques plutot qu'a de simples recherches texte. L'outil s'appuie notamment sur les language servers pour fournir navigation par symboles, references, refactorings, edition symbolique et debuggage selon le backend utilise. Le README insiste sur le fait que les agents sont les vrais utilisateurs finaux: ils gagnent en fiabilite quand ils peuvent demander une operation de haut niveau au lieu de manipuler des numeros de lignes fragiles. Serena ajoute aussi une memoire de projet configurable et des outils de base, mais recommande de desactiver ce qui ferait doublon avec le harness existant. Pour les grands codebases, le point cle est la reduction de contexte inutile: definitions, references et operations atomiques valent mieux que de gros blocs de fichiers. C'est une piste d'outillage pour passer du 'copier-coller de code' a une vraie code intelligence agentique.",
        seniorTakeaway:
          "Le contexte efficace est souvent structurel: symboles, references et definitions valent mieux qu'un gros copier-coller de fichiers.",
        useWhen:
          "Pour ameliorer navigation et modification dans un codebase de taille moyenne ou grande.",
      },
    ],
  },
  {
    id: "tools-platforms",
    title: "Outils & plateformes",
    summary:
      "Panorama des outils d'agents de dev, code intelligence, review, orchestration et plateformes.",
    whyItMatters:
      "Le choix d'outil devient un choix d'operating model: local vs cloud, self-hosted, droits, integration tickets, review et observabilite.",
    dossierSlugs: ["00-etat-de-lart-2026", "03-workflow-agents-dev"],
    resources: [
      {
        title: "Codex is now generally available",
        publisher: "OpenAI",
        author: "OpenAI",
        url: "https://openai.com/index/codex-now-generally-available/",
        date: "2025-10-06",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "sdk", "slack", "admin"],
        synthesis:
          "GA de Codex avec Slack, SDK, controles admin, usage en editeur/terminal/cloud et exemples entreprise.",
        articleSummary:
          "L'annonce de disponibilite generale de Codex marque le passage d'un outil de preview a une plateforme plus complete pour equipes. OpenAI met en avant plusieurs surfaces: editeur, terminal, cloud, Slack, SDK et controles administrateur. Le message produit est que Codex n'est plus seulement une experience individuelle de coding assistant, mais une infrastructure de delegation et d'orchestration pour organisations. Les exemples entreprise servent a montrer des usages au-dela de la generation de code: tests, review, comprehension de grands repos, incidents et automatisations. Pour les seniors, la ressource est utile comme photographie de la surface produit: quels controles existent, quelles integrations deviennent natives, et comment le fournisseur parle d'adoption equipe. Elle aide aussi a distinguer capacites reelles, promesses marketing et prerequis internes. La question a poser n'est pas seulement 'Codex marche-t-il?', mais 'quels workflows, politiques et metrics devons-nous mettre autour?'.",
        seniorTakeaway:
          "Les agents de dev sortent du mode individuel: admin, analytics, Slack et SDK deviennent des criteres d'achat.",
        useWhen:
          "Pour comprendre la surface Codex equipe/entreprise.",
      },
      {
        title: "How OpenAI uses Codex",
        publisher: "OpenAI",
        author: "OpenAI",
        url: "https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf",
        date: "2025",
        kind: "case-study",
        sourceType: "primary",
        freshness: "durable",
        tags: ["codex", "use-cases", "refactoring", "tests"],
        synthesis:
          "PDF de cas d'usage internes OpenAI: comprehension de code, refactoring, migrations, performance, tests, flow et ideation.",
        articleSummary:
          "Ce PDF compile des usages internes de Codex chez OpenAI a partir d'entretiens et de donnees d'usage. Les cas couvrent la comprehension de code, les refactorings multi-fichiers, les migrations, l'optimisation de performance, l'amelioration de couverture de tests, la velocite de developpement, le maintien du flow et l'ideation. Le document est interessant car il montre que les usages les plus rentables ne sont pas uniquement la creation de features. Codex sert aussi a cartographier un systeme, trouver des chemins de donnees, detecter des patterns repetes, proposer des tests d'edge cases ou preparer des PRs pendant qu'un engineer reste concentre sur autre chose. Les bonnes pratiques encouragent a donner du contexte, demander des plans, verifier, iterer et utiliser l'agent sur des taches bien bornees. Pour une equipe, c'est une base pour construire une matrice de cas d'usage, avec des categories plus nuancees que 'ecrire du code plus vite'.",
        seniorTakeaway:
          "Les meilleurs cas ne sont pas seulement generation de features: comprendre, migrer, couvrir, optimiser et investiguer comptent autant.",
        useWhen:
          "Pour construire une matrice de cas d'usage IA dans une equipe existante.",
      },
      {
        title: "About GitHub Copilot coding agent",
        publisher: "GitHub Docs",
        author: "GitHub",
        url: "https://docs.github.com/copilot/concepts/coding-agent/about-copilot-coding-agent",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["github", "copilot", "coding-agent", "prs"],
        synthesis:
          "Documentation du coding agent Copilot: assignation, plans payants, integration GitHub et comportement de PR.",
        articleSummary:
          "La documentation GitHub decrit Copilot cloud agent comme un agent qui peut etre assigne a des issues ou demandes dans GitHub et travailler jusqu'a produire une pull request. Le contenu couvre le positionnement du cloud agent, les prerequis de plan, les permissions, les integrations GitHub et la maniere dont l'agent opere dans le contexte du repo. L'interet est que GitHub transforme la plateforme de code review elle-meme en surface de delegation. Les agents peuvent etre rattaches a des objets existants, ouvrir des branches, proposer des changements et s'inserer dans le workflow PR. Pour une equipe deja GitHub-first, cela reduit la distance entre planification, execution et review, mais augmente aussi le besoin de regles: quels tickets assigner, qui relit, quels checks bloquent et comment limiter les droits. La ressource sert a comparer l'approche native GitHub avec les agents plus independants comme Codex, Cursor ou Claude Code.",
        seniorTakeaway:
          "GitHub devient une surface native pour assigner du travail a des agents, pas seulement pour heberger leurs PRs.",
        useWhen:
          "Pour comparer les workflows GitHub-first avec Codex, Cursor ou Claude Code.",
      },
      {
        title: "A new era for Sourcegraph",
        publisher: "Sourcegraph",
        author: "Sourcegraph",
        url: "https://sourcegraph.com/blog/a-new-era-for-sourcegraph-the-intelligence-layer-for-ai-coding-agents-and-developers",
        date: "2026-02-25",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["code-intelligence", "enterprise", "monorepo", "agents"],
        synthesis:
          "Positionne Sourcegraph comme couche d'intelligence pour humains et agents sur grands codebases.",
        articleSummary:
          "Sourcegraph presente sa version 7.0 comme un repositionnement vers une couche d'intelligence partagee pour developpeurs et agents. L'article part du probleme des grands codebases: dependances cross-repo, historique, decisions architecturales anciennes et contexte implicite rendent les suggestions agents fragiles. Sourcegraph propose que les agents aient acces au meme contexte profond que les meilleurs developpeurs, notamment via Deep Search et MCP. La promesse n'est pas que l'agent ecrive du code parfait, mais qu'il dispose d'un socle de comprehension plus fiable pour poser des questions semantiques, historiques ou architecturales. Le texte est utile parce qu'il reformule le code search comme infrastructure agentique. Pour les equipes enterprise, cela deplace le debat buy vs build: la qualite de l'agent depend de la qualite du graphe de connaissance code, des permissions, de la fraicheur et de l'integration dans les workflows.",
        seniorTakeaway:
          "L'agent a besoin de code intelligence d'entreprise: dependances cross-repo, historique, conventions et architecture.",
        useWhen:
          "Pour reflechir buy vs build autour du code search et de l'indexation agentique.",
      },
      {
        title: "What it actually takes to run code intelligence in-house",
        publisher: "Sourcegraph",
        author: "Sourcegraph",
        url: "https://sourcegraph.com/blog/what-it-actually-takes-to-run-code-intelligence-in-house",
        date: "2026-04-21",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["code-intelligence", "build-vs-buy", "enterprise"],
        synthesis:
          "Analyse les exigences et couts de construire une plateforme de code intelligence interne.",
        articleSummary:
          "Sourcegraph detaille ce qu'il faut vraiment construire pour disposer d'une plateforme de code intelligence interne. L'article montre que la partie visible, une barre de recherche et des resultats, n'est qu'une petite fraction du travail. Le reste inclut indexation, recherche exacte et regex, graphe de references, synchronisation de repos, Git serving, permissions, authentification, stockage, jobs de fond, observabilite et support des environnements enterprise. La these est que les briques open source comme Zoekt ou SCIP sont utiles mais ne remplacent pas l'infrastructure autour: planification de requetes, ranking, controles d'acces, re-indexation, compatibilite multi-host et gestion des acquisitions. Le lien avec les agents est direct: sans contexte fiable, un agent travaille sur une vue incomplete ou obsolete du code. Pour des leaders plateforme, la ressource aide a chiffrer le cout cache d'un build interne et a separer moteur technique, experience developpeur et exigences de gouvernance.",
        seniorTakeaway:
          "Avant de construire ton propre contexte agentique, chiffre les besoins: multi-repo, langages, permissions, fraicheur, compliance et maintenance.",
        useWhen:
          "Pour preparer une decision plateforme dans une organisation de taille significative.",
      },
    ],
  },
  {
    id: "security-governance",
    title: "Securite, gouvernance & controle",
    summary:
      "Permissions, exfiltration, prompt injection, admin controls, self-hosting et responsabilite.",
    whyItMatters:
      "Un agent qui peut lire le repo, executer des commandes et pousser du code est une surface de risque operationnelle.",
    dossierSlugs: ["07-cout-securite-perf", "12-process-equipe-genai"],
    resources: [
      {
        title: "Beyond permission prompts: making Claude Code more secure and autonomous",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/claude-code-sandboxing",
        date: "2025-10-20",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["permissions", "autonomy", "security", "claude-code"],
        synthesis:
          "Explore comment depasser les prompts de permission repetitifs pour obtenir plus d'autonomie sans perdre le controle securite.",
        articleSummary:
          "Anthropic analyse le compromis entre securite et autonomie dans Claude Code. Les confirmations manuelles protegeaient l'utilisateur, mais elles deviennent vite un frein quand l'agent doit executer beaucoup d'actions repetitives. L'article propose de deplacer le controle vers l'environnement et les politiques plutot que de multiplier les prompts. Le sandboxing permet d'autoriser davantage d'actions dans un perimetre limite, observable et reversible. La ressource insiste sur la conception des permissions: quelles commandes sont sûres, quelles sorties peuvent exfiltrer des donnees, quels acces reseau sont acceptables, et comment garder l'utilisateur en controle sans le fatiguer. Le message est que la securite agentique n'est pas un interrupteur binaire. Elle demande des modes, des boundaries et des garanties techniques. Pour une equipe senior, c'est une base pour definir des profils d'autonomie par repo, tache et niveau de risque.",
        seniorTakeaway:
          "La securite agentique est un design de politique et d'environnement, pas une pile de confirmations manuelles.",
        useWhen:
          "Pour definir modes de permission, commandes autorisees et limites d'autonomie.",
      },
      {
        title: "Claude Code auto mode",
        publisher: "Anthropic Engineering",
        author: "Anthropic",
        url: "https://www.anthropic.com/engineering/claude-code-auto-mode",
        date: "2026-03-25",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["auto-mode", "permissions", "sandbox"],
        synthesis:
          "Presente un mode plus autonome pour Claude Code avec garde-fous et skip de permissions plus sur.",
        articleSummary:
          "Claude Code auto mode vise a reduire la friction des permissions tout en gardant des garde-fous. L'article explique que demander confirmation pour chaque commande ou modification peut rendre les agents trop lents, surtout sur des taches longues ou repetitives. Le mode auto cherche a distinguer les actions sûres des actions plus sensibles, afin d'autoriser les premieres sans interrompre constamment l'utilisateur. Le sujet central est la calibration de confiance: l'agent doit pouvoir avancer, mais pas obtenir un acces illimite au systeme. Anthropic met donc l'accent sur les classifiers de risque, les limites d'environnement et la possibilite de reprendre la main. Pour une equipe, cette ressource aide a penser des politiques d'usage: quand accepter l'auto mode, sur quels repos, avec quels secrets, et pour quelles categories de commandes. C'est un signal que les outils vont vers plus d'autonomie encadree, pas vers l'absence de controle.",
        seniorTakeaway:
          "L'autonomie n'est acceptable que si l'environnement, les commandes et les sorties restent auditablement controles.",
        useWhen:
          "Pour evaluer si une equipe peut passer d'un agent accompagne a un agent plus autonome.",
      },
      {
        title: "Addendum to GPT-5 system card: GPT-5-Codex",
        publisher: "OpenAI",
        author: "OpenAI",
        url: "https://cdn.openai.com/pdf/97cc5669-7a25-4e63-b15f-5fd5bdc4d149/gpt-5-codex-system-card.pdf",
        date: "2025-09-15",
        kind: "report",
        sourceType: "primary",
        freshness: "durable",
        tags: ["system-card", "codex", "safety", "sandboxing"],
        synthesis:
          "Documente les considerations de securite et mitigations produit pour GPT-5-Codex, dont sandboxing et acces reseau configurable.",
        articleSummary:
          "L'addendum system card GPT-5-Codex documente les risques et mitigations propres a un modele specialise pour le coding agentique. Le document couvre les dimensions de securite produit: execution de code, acces fichiers, sandboxing, controle reseau, interactions avec outils et risques de comportements non souhaites. L'interet pour une equipe n'est pas de lire la system card comme une garantie absolue, mais comme une liste de menaces que le fournisseur a juge suffisamment importantes pour les tester et mitiguer. Elle montre aussi que le modele ne peut pas etre separe de son runtime: la securite depend de la configuration du sandbox, des permissions, des donnees disponibles et de la supervision humaine. Pour les responsables plateforme, c'est une source utile pour construire une grille de risques interne. Elle aide a poser des questions concretes avant adoption: secrets, reseau, commandes autorisees, audit des actions, revue et rollback.",
        seniorTakeaway:
          "Les system cards donnent des indices utiles pour les politiques internes: sandbox, reseau, secrets et review humaine.",
        useWhen:
          "Pour construire une grille de risques avant de deploiement d'agents de code.",
      },
      {
        title: "Claude Code product page",
        publisher: "Anthropic",
        author: "Anthropic",
        url: "https://www.anthropic.com/product/claude-code",
        date: "rolling",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["claude-code", "enterprise", "security", "product"],
        synthesis:
          "Page produit utile pour suivre les capacites, integrations et positionnement entreprise de Claude Code.",
        articleSummary:
          "La page produit Claude Code presente le systeme comme un agent de coding capable de lire un codebase, modifier plusieurs fichiers, lancer des tests et livrer du code committe. Elle insiste sur le passage d'un outil d'autocomplete a un agent qui agit au niveau projet. Les cas d'usage mis en avant couvrent navigation dans un code inconnu, developpement multi-fichiers, execution d'outils CLI, correction de tests et gestion de CI. La page met aussi en avant des exemples clients: migrations, incident response, reduction de delais et parallelisation de sessions. Comme toute page produit, elle doit etre lue avec distance, mais elle donne un bon signal de positionnement enterprise et des workflows que le fournisseur veut normaliser. Pour une equipe senior, l'interet est de traduire ces claims en criteres de proof of concept: quel setup, quelles permissions, quels tests, quelle supervision et quelle mesure de gain.",
        seniorTakeaway:
          "Les claims produit doivent etre lus comme signaux de direction, puis verifies dans le workflow reel de l'equipe.",
        useWhen:
          "Pour maintenir une veille outillage sans confondre marketing et pratiques prouvees.",
      },
      {
        title: "Constitutional Spec-Driven Development",
        publisher: "arXiv",
        author: "arXiv",
        url: "https://arxiv.org/abs/2602.02584",
        date: "2026-01-31",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["spec-driven", "security", "constitution", "governance"],
        synthesis:
          "Recherche sur l'integration de principes securite non negociables directement dans la couche de specifications.",
        articleSummary:
          "Ce papier propose le Constitutional Spec-Driven Development, une methode qui encode des contraintes securite non negociables dans la specification avant generation de code. L'auteur part du constat que le vibe coding accelere le developpement mais peut privilegier la correction fonctionnelle au detriment de la securite. La constitution devient un document versionne et lisible par machine, derive de references comme CWE/MITRE Top 25 et de cadres reglementaires. Le cas d'etude porte sur une application bancaire en microservices, avec traçabilite des principes vers les emplacements de code. Le papier annonce une reduction importante des defauts securite par rapport a une generation non contrainte. Meme si le resultat doit etre lu comme recherche appliquee, la logique est precieuse: mettre les invariants de securite en amont de l'agent, puis verifier leur application. Pour une equipe, c'est une justification forte pour maintenir une constitution projet et des gates avant implementation.",
        seniorTakeaway:
          "La gouvernance doit etre en amont de la generation: les specs sont un levier de securite by construction.",
        useWhen:
          "Pour justifier une constitution Spec Kit stricte dans un projet open source ou entreprise.",
      },
      {
        title: "OWASP Top 10 for Large Language Model Applications",
        publisher: "OWASP",
        author: "OWASP",
        url: "https://genai.owasp.org/llm-top-10/",
        date: "rolling",
        kind: "docs",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "owasp", "llm-security", "prompt-injection"],
        synthesis:
          "Referentiel de risques pour applications LLM: prompt injection, donnees sensibles, supply chain, excessive agency, sorties non fiables et gouvernance.",
        articleSummary:
          "L'OWASP Top 10 for LLM Applications fournit une taxonomie de risques pour les systemes generatifs et agentiques. La version 2025 couvre notamment prompt injection, divulgation de donnees sensibles, supply chain, empoisonnement de donnees ou modeles, mauvaise gestion des sorties, agency excessive, fuite de system prompt, faiblesses des embeddings, desinformation et consommation non bornee. L'interet est de traduire les inquietudes generales sur les LLM en categories auditables et discutables avec securite, plateforme et produit. Pour les agents de developpement, plusieurs risques se combinent: un agent peut lire du code, recevoir des instructions indirectes, appeler des outils, exposer des secrets ou produire une dependance vulnerable. La ressource sert donc de checklist de gouvernance plus que de guide d'implementation detaille. Elle aide a poser les questions minimales avant d'ouvrir des permissions, brancher des donnees internes ou automatiser des changements de code.",
        seniorTakeaway:
          "Un agent de dev traverse plusieurs surfaces OWASP LLM a la fois: acces outil, secrets, code genere, dependances et validation humaine.",
        useWhen:
          "Pour cadrer une checklist securite avant de connecter des agents a des repos, outils internes ou donnees sensibles.",
      },
    ],
  },
  {
    id: "enterprise-metrics",
    title: "Adoption entreprise & metriques",
    summary:
      "Mesurer l'effet de l'IA sur throughput, qualite, adoption, DX et organisation.",
    whyItMatters:
      "Les gains individuels ne deviennent gains d'equipe que si le systeme de delivery, review et plateforme suit.",
    dossierSlugs: ["00-etat-de-lart-2026", "12-process-equipe-genai"],
    resources: [
      {
        title: "State of AI-assisted Software Development 2025",
        publisher: "DORA / Google Cloud",
        author: "DORA / Google Cloud",
        url: "https://dora.dev/research/2025/dora-report/",
        date: "2025",
        kind: "report",
        sourceType: "independent",
        freshness: "durable",
        tags: ["dora", "metrics", "delivery", "ai-adoption"],
        synthesis:
          "Rapport DORA sur l'IA comme amplificateur des forces et faiblesses organisationnelles, avec focus sur systemes et capacites.",
        articleSummary:
          "Le rapport DORA 2025 analyse l'IA assistee dans le developpement logiciel sous l'angle des capacites organisationnelles, pas seulement des gains individuels. Il replace l'IA dans les fondamentaux DORA: delivery performance, qualite, fiabilite, culture, plateforme, flux de travail et feedback. Le message utile est que l'IA amplifie ce qui existe deja: une organisation avec tests, CI, architecture claire et bonnes boucles de feedback peut transformer l'assistance IA en levier, tandis qu'une organisation fragile risque d'accelerer le chaos. Le rapport aide aussi a deplacer la discussion ROI depuis les anecdotes de productivite vers des mesures systemiques: throughput, stabilite, experience developpeur, qualite et apprentissage. Pour les leaders engineering, c'est une base plus solide que les claims vendeurs. La bonne lecture est: quels prerequis organisationnels rendent l'IA utile, et quels dysfonctionnements seront amplifies si on deploie des agents trop vite?",
        seniorTakeaway:
          "L'IA n'annule pas les fondamentaux DevOps; elle amplifie la qualite ou le chaos de ton systeme existant.",
        useWhen:
          "Pour cadrer une discussion direction/engineering sur ROI, throughput et instabilite.",
      },
      {
        title: "Octoverse 2025",
        publisher: "GitHub Blog",
        author: "GitHub",
        url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/",
        date: "2025-10",
        kind: "report",
        sourceType: "primary",
        freshness: "durable",
        tags: ["github", "octoverse", "ai-projects", "prs"],
        synthesis:
          "GitHub observe l'explosion des projets IA, des PRs et de TypeScript, avec contexte sur agents et code review.",
        articleSummary:
          "L'Octoverse 2025 de GitHub donne une photographie macro de l'activite developpeur sur la plateforme. Le rapport met en avant la croissance des projets IA, l'adoption massive d'outils IA et le fait que TypeScript devient un langage dominant dans ce contexte. Il mentionne aussi l'evolution des PRs, de la collaboration et du role des agents dans les workflows GitHub. Pour l'observatoire, l'interet n'est pas de conclure directement a un gain de productivite, car les donnees de plateforme mesurent surtout l'activite et l'adoption. En revanche, elles indiquent ou les pratiques se normalisent: les developpeurs utilisent davantage les modeles, les outils agentiques et les plateformes de review integrees. Le rapport aide a distinguer tendance ecosysteme et preuve de qualite. Pour une equipe senior, c'est une source de contexte pour calibrer veille, recrutement, choix d'outils et attentes des contributeurs open source.",
        seniorTakeaway:
          "Les signaux d'adoption de plateforme montrent ou les pratiques se normalisent, meme si elles ne prouvent pas la productivite.",
        useWhen:
          "Pour suivre les tendances ecosysteme au niveau GitHub.",
      },
      {
        title: "Scaling Codex to enterprises worldwide",
        publisher: "OpenAI",
        author: "OpenAI",
        url: "https://openai.com/index/scaling-codex-to-enterprises-worldwide/",
        date: "2026-04-21",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "enterprise", "adoption", "gsi"],
        synthesis:
          "OpenAI annonce Codex Labs, des partenaires integrateurs et des usages entreprise sur tests, review, features, incidents et grands repos.",
        articleSummary:
          "OpenAI annonce Codex Labs et des partenariats avec de grands integrateurs pour aider les entreprises a deployer Codex a grande echelle. L'article cite une croissance rapide de l'usage developpeur et presente des cas enterprise sur tests, code review, nouvelles features, comprehension de grands repos et incident response. Le message important est le passage du pilote individuel a l'industrialisation: workshops, accompagnement, integration aux workflows existants et identification de cas d'usage repetables. OpenAI positionne aussi Codex au-dela de l'engineering strict, vers des taches de synthese, planification et actions entre outils. Pour une equipe senior, cette ressource sert surtout a comprendre le go-to-market et les attentes que les directions vont avoir. Elle invite a preparer une reponse structuree: quels cas d'usage sont mûrs, quels controles sont necessaires, comment mesurer la valeur et comment eviter une adoption uniquement poussee par le fournisseur.",
        seniorTakeaway:
          "Le marche passe du pilote individuel a l'industrialisation: formation, integration, gouvernance et use cases repetables.",
        useWhen:
          "Pour comprendre comment les fournisseurs vendent l'adoption Codex en entreprise.",
      },
      {
        title: "Stack Overflow Developer Survey 2025",
        publisher: "Stack Overflow",
        author: "Stack Overflow",
        url: "https://survey.stackoverflow.co/2025",
        date: "2025",
        kind: "report",
        sourceType: "independent",
        freshness: "durable",
        tags: ["survey", "trust", "developers", "ai-tools"],
        synthesis:
          "Donnees de perception et adoption IA chez les developpeurs, utiles pour comprendre confiance, usage et scepticisme.",
        articleSummary:
          "Le Developer Survey 2025 de Stack Overflow fournit des donnees de perception sur les developpeurs, leurs outils et leur rapport a l'IA. Le rapport indique une forte exposition aux LLMs et aux agents, avec une majorite d'utilisateurs d'agents declarant un gain de productivite, mais aussi des nuances sur confiance, collaboration et qualite de code. Il montre que l'adoption est large, y compris chez des developpeurs experimentes, mais que l'usage ne signifie pas automatiquement satisfaction totale ou delegation aveugle. Pour l'observatoire, cette source est utile comme contrepoint aux annonces fournisseurs: elle capture ce que les praticiens disent utiliser, apprendre et ressentir. Elle aide aussi a anticiper les tensions dans les equipes: productivite percue, scepticisme, besoin de verification et changement des outils de collaboration. Pour des managers hands-on, c'est une base pour discuter adoption avec des donnees de terrain plutot qu'avec des impressions individuelles.",
        seniorTakeaway:
          "L'adoption massive ne signifie pas confiance massive; la qualite percue et la verification restent centrales.",
        useWhen:
          "Pour equilibrer les claims vendeurs avec le ressenti des praticiens.",
      },
      {
        title: "We are Changing our Developer Productivity Experiment Design",
        publisher: "METR",
        author: "METR",
        url: "https://metr.org/blog/2026-02-24-uplift-update/",
        date: "2026-02-24",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["productivity", "measurement", "selection-effects", "agents"],
        synthesis:
          "METR explique pourquoi mesurer la productivite IA devient plus difficile: adoption accrue, selection des taches, parallelisme agents et biais de participation.",
        articleSummary:
          "METR explique pourquoi son design experimental de mesure de productivite developpeur doit evoluer. Les outils IA sont plus largement adoptes, les developpeurs apprennent a choisir les taches qui conviennent aux agents, et les workflows deviennent paralleles plutot que strictement sequentiels. Cela rend moins pertinente une mesure simple du temps gagne sur une tache isolee. L'article discute aussi les biais de participation et les effets de selection: les personnes qui acceptent de participer, les taches choisies et l'experience prealable avec l'IA influencent fortement les resultats. Pour les equipes, le point important est que la productivite IA n'est pas une variable stable a mesurer une fois. Elle depend du niveau de maturite, du type de travail, de l'outillage et de l'organisation du flux. Cette ressource aide a concevoir des metriques plus realistes: parallelisme, qualite, rework, throughput equipe et capacite a apprendre.",
        seniorTakeaway:
          "Les anciennes mesures de temps par tache se cassent quand les devs orchestrent plusieurs agents en parallele.",
        useWhen:
          "Pour concevoir des metriques d'equipe qui ne reduisent pas l'IA a 'minutes gagnees'.",
      },
    ],
  },
  {
    id: "skepticism-research",
    title: "Recherche critique & limites",
    summary:
      "Lire les resultats qui contredisent le narratif 'tout va plus vite' et clarifient les limites.",
    whyItMatters:
      "Un senior doit savoir ou les agents echouent, quand ils ralentissent, et quelles hypotheses ne generalisent pas.",
    dossierSlugs: ["00-etat-de-lart-2026", "06-evals-observability"],
    resources: [
      {
        title: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity",
        publisher: "METR",
        author: "METR",
        url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/",
        date: "2025-07-10",
        kind: "research",
        sourceType: "independent",
        freshness: "historical",
        tags: ["productivity", "experienced-devs", "rct", "slowdown"],
        synthesis:
          "RCT sur 16 developpeurs open source experimentes travaillant sur leurs repos; dans ce cadre early-2025, l'IA les ralentit de 19%.",
        articleSummary:
          "L'etude METR mesure l'impact des outils IA early-2025 sur des developpeurs open source experimentes travaillant sur leurs propres repositories. Le resultat le plus cite est contre-intuitif: dans ce contexte, l'usage de l'IA a ralenti les participants d'environ 19%, alors qu'ils pensaient avoir ete acceleres. L'etude est importante parce qu'elle porte sur des taches reelles et des codebases connus, pas uniquement sur des benchmarks artificiels. Elle doit toutefois etre lue avec ses limites: petit echantillon, outils et modeles de debut 2025, niveau d'experience IA variable, et un participant tres experimente qui obtient des gains. Le message senior n'est donc pas 'l'IA ralentit toujours', mais 'les gains dependent fortement du contexte'. Revue, correction, mauvaise comprehension du codebase et confiance excessive peuvent annuler le temps gagne en generation. C'est une ressource utile pour temperer les promesses simplistes et parler de conditions d'usage.",
        seniorTakeaway:
          "Les gains dependent du contexte: codebase connu, taches matures, cout de revue et qualite de l'outillage peuvent inverser le benefice.",
        useWhen:
          "Pour temperer les promesses de productivite et parler de conditions d'usage.",
      },
      {
        title: "AIDev: Studying AI Coding Agents on GitHub",
        publisher: "arXiv",
        author: "arXiv",
        url: "https://arxiv.org/abs/2602.09185",
        date: "2026-02",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["aidev", "github", "agentic-prs", "dataset"],
        synthesis:
          "Dataset de 932 791 PRs agentiques produites par Codex, Devin, Copilot, Cursor et Claude Code.",
        articleSummary:
          "AIDev introduit un grand dataset de pull requests agentiques observees sur GitHub. Les auteurs agregeraient plus de 932 000 PRs produites par cinq agents: Codex, Devin, Copilot, Cursor et Claude Code, couvrant plus de 116 000 repositories et 72 000 developpeurs. Le dataset inclut aussi un sous-ensemble plus riche de PRs issues de repositories avec plus de 100 stars, comprenant commentaires, reviews, commits et issues liees. L'interet principal est de fournir une base empirique pour etudier l'adoption des agents dans le monde reel. Au lieu de s'appuyer sur anecdotes ou benchmarks fermes, les chercheurs peuvent analyser comment les agents sont utilises, dans quels projets, avec quels types de changements et quelles interactions humaines. Pour une equipe senior, ce n'est pas directement un guide pratique, mais une source a suivre pour comprendre les patterns d'adoption, les risques de review et les formes de collaboration humain-agent.",
        seniorTakeaway:
          "On commence a pouvoir etudier les agents dans le monde reel a grande echelle, pas seulement via anecdotes.",
        useWhen:
          "Pour alimenter une veille recherche sur adoption et integration de PRs agents.",
      },
      {
        title: "How AI Coding Agents Modify Code",
        publisher: "arXiv / MSR 2026",
        author: "arXiv",
        url: "https://arxiv.org/abs/2601.17581",
        date: "2026-01",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["agentic-prs", "code-changes", "github", "msr"],
        synthesis:
          "Compare des PRs agentiques mergees et humaines pour analyser comment les agents modifient le code et decrivent leurs changements.",
        articleSummary:
          "Ce papier compare des pull requests mergees produites par agents avec des PRs humaines, a partir du dataset AIDev. Les auteurs analysent le nombre de commits, les fichiers touches, les additions, suppressions et la similarite entre description de PR et diff effectif. Les resultats indiquent que les PRs agentiques different notamment par le nombre de commits et certains aspects de taille ou de forme du changement. Elles presentent aussi une similarite description-diff legerement plus elevee, ce qui peut refleter une tendance a decrire plus directement ce qui a ete modifie. L'interet de l'etude est de donner des signaux observables pour la review: forme de PR, taille, granularite, coherence entre texte et code. Pour les equipes, cela ouvre la voie a des heuristiques de triage et de controle qualite specifiques aux PRs agentiques. Un agent ne se juge pas seulement au fait que la CI passe; la structure du changement compte aussi.",
        seniorTakeaway:
          "La qualite d'un agent doit se lire dans la taille, la forme, la description et l'integration des changements.",
        useWhen:
          "Pour construire des heuristiques de review de PRs generees par agents.",
      },
      {
        title: "AgenticFlict",
        publisher: "arXiv",
        author: "arXiv",
        url: "https://arxiv.org/abs/2604.03551",
        date: "2026-04-04",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["merge-conflicts", "agent-prs", "github", "dataset"],
        synthesis:
          "Dataset sur les conflits de merge dans les PRs d'agents de code sur GitHub.",
        articleSummary:
          "AgenticFlict se concentre sur les conflits de merge dans les pull requests produites par agents de code. La ressource est importante car le parallelisme agentique promet de multiplier les chantiers simultanes, mais cette multiplication augmente aussi les risques d'integration. Les conflits ne sont pas seulement des accidents Git: ils revelent des problemes de coordination, de decoupage des taches, de duree de branche et de chevauchement fonctionnel. Le dataset permet d'etudier a grande echelle quand et comment ces conflits apparaissent dans des PRs agentiques. Pour une equipe senior, le takeaway pratique est clair: si plusieurs agents travaillent en parallele, il faut des strategies de petits lots, de worktrees, de locks, de rebase frequent, de tests rapides et de proprietaires humains. L'autonomie de production de code doit etre accompagnee d'une architecture d'integration. Sinon le gain apparent se transforme en cout de merge et de review.",
        seniorTakeaway:
          "Plus d'agents en parallele signifie plus de risques d'integration; la coordination devient un probleme produit.",
        useWhen:
          "Pour definir des strategies worktree, locking, petits lots et integration continue.",
      },
      {
        title: "Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants",
        publisher: "OpenReview / AIWare 2026",
        author: "OpenReview",
        url: "https://openreview.net/pdf?id=bw5mNj75h9",
        date: "2026",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["spec-driven", "contracts", "ai-coding", "sdd"],
        synthesis:
          "Situe le spec-driven development comme passage du code source de verite vers le contrat/specification maintenu.",
        articleSummary:
          "Ce papier positionne le spec-driven development comme une reponse au changement apporte par les assistants de code IA. Quand le code peut etre genere ou modifie rapidement, le contrat qui guide le systeme devient plus important que la saisie manuelle du code lui-meme. L'article defend l'idee que la specification doit devenir un artefact maintenu, verifiable et connecte a l'implementation, plutot qu'un document ponctuel ecrit avant le developpement. Cette approche aide a clarifier les exigences, les contraintes et les criteres d'acceptation avant de demander a un agent de produire des changements. Elle peut aussi servir de base a la verification et a la traçabilite. Pour une equipe senior, l'interet est de cadrer le role de la spec dans les workflows IA: elle ne remplace pas le jugement technique, mais elle rend l'intention explicite et revisable. La limite a garder en tete est le cout de maintenance: une spec obsolete peut guider l'agent dans la mauvaise direction.",
        seniorTakeaway:
          "Les specs ne sont plus des docs mortes: elles deviennent des artefacts de pilotage et verification pour agents.",
        useWhen:
          "Pour justifier un workflow Spec Kit dans un projet open source ou entreprise.",
      },
    ],
  },
];

export function getAllResources() {
  return indexResources(resourceCategories);
}

export { getResourceAnchorId, slugifyResourceTitle };

export function getResourceStats() {
  return computeResourceStats(resourceCategories, watchSources);
}
