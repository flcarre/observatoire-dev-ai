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
        url: "https://posthog.com/newsletter/agent-first-product-engineering",
        date: "2026-04-08",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["ai-watchtower", "product-engineering", "agents", "mcp", "skills"],
        synthesis:
          "Retour terrain PostHog sur la construction de produits utilises par des agents: exposer les capacites au bon niveau d'abstraction, charger le contexte universel et ecrire des skills qui capturent le savoir produit.",
        seniorTakeaway:
          "Construire pour les agents ressemble a construire une nouvelle surface produit: API, permissions, semantique, contexte et confiance doivent etre designes ensemble.",
        useWhen:
          "Pour cadrer une strategie produit ou plateforme ou des agents doivent agir dans ton produit, pas seulement autour de ton code.",
      },
      {
        title: "What is a product engineer?",
        publisher: "PostHog",
        url: "https://posthog.com/product-engineer/what-is-a-product-engineer",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "durable",
        tags: ["ai-watchtower", "product-engineering", "role", "ownership"],
        synthesis:
          "Definition du product engineer comme profil qui combine sens produit, execution technique, ownership utilisateur et capacite a shipper sans silo strict.",
        seniorTakeaway:
          "L'IA accelere ce profil: plus le code est delegable, plus la valeur vient de la boucle probleme, decision, livraison, mesure.",
        useWhen:
          "Pour repositionner le role senior dans une equipe ou les frontieres PM/design/dev bougent.",
      },
      {
        title: "AI Codebase Maturity Model",
        publisher: "arXiv",
        url: "https://arxiv.org/abs/2604.09388",
        date: "2026-04",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "codebase-readiness", "architecture", "automation"],
        synthesis:
          "Propose un cadre pour evaluer la maturite d'un codebase face au developpement assiste par IA: structure, testabilite, documentation, automatisation et lisibilite machine.",
        seniorTakeaway:
          "Avant de demander plus aux agents, rends le codebase lisible, testable et instrumente; sinon l'IA amplifie la friction existante.",
        useWhen:
          "Pour auditer un repo avant adoption d'agents de code ou avant un programme de modernisation.",
      },
      {
        title: "Everything I Learned About Harness Engineering and AI Factories in San Francisco",
        publisher: "Escape",
        url: "https://escape.tech/blog/everything-i-learned-about-harness-engineering-and-ai-factories-in-san-francisco-april-2026/",
        date: "2026-04-03",
        kind: "case-study",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "harness", "ai-factory", "product-strategy"],
        synthesis:
          "Field report de discussions avec CTO, CPO et leaders engineering a San Francisco sur la montee du harness, des AI factories et du role de builder.",
        seniorTakeaway:
          "Le bottleneck se deplace vers strategie produit, revue, orchestration et apprentissage organisationnel; la vitesse d'implementation ne sauve pas une mauvaise direction.",
        useWhen:
          "Pour ouvrir une discussion direction/engineering sur ce qu'une adoption agentique change vraiment dans l'operating model.",
      },
      {
        title: "The Post-Developer Era",
        publisher: "Josh W. Comeau",
        url: "https://www.joshwcomeau.com/blog/the-post-developer-era/",
        date: "2025",
        kind: "community",
        sourceType: "community",
        freshness: "durable",
        tags: ["ai-watchtower", "career", "craft", "developer-role"],
        synthesis:
          "Reflexion de praticien sur ce qui reste du metier quand l'IA genere de plus en plus de code: gout, comprehension, debugging, coherence produit et responsabilite.",
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
        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        date: "2025-09-29",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["context", "agents", "memory", "retrieval"],
        synthesis:
          "Formalise le passage du prompt engineering vers la gestion du contexte complet: instructions, outils, historique, fichiers, memoire, compaction et recherche just-in-time.",
        seniorTakeaway:
          "Traite le contexte comme une ressource finie: moins de tokens, plus de signal, et des outils qui permettent a l'agent de charger ce dont il a besoin au bon moment.",
        useWhen:
          "Pour concevoir AGENTS.md, CLAUDE.md, skills, notes persistantes, compaction ou strategie de retrieval dans un gros repo.",
      },
      {
        title: "Best Practices for Claude Code",
        publisher: "Anthropic / Claude Code Docs",
        url: "https://code.claude.com/docs/en/best-practices",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["claude-code", "context-window", "subagents", "verification"],
        synthesis:
          "Guide operationnel sur l'exploration d'un codebase, la planification, les permissions, les sous-agents, la gestion agressive du contexte et les sessions paralleles.",
        seniorTakeaway:
          "Les agents productifs ressemblent a des juniors tres rapides: ils ont besoin d'environnement, de verification et de recadrage tot, pas seulement d'une demande vague.",
        useWhen:
          "Pour definir les pratiques quotidiennes d'une equipe qui utilise Claude Code ou un agent CLI comparable.",
      },
      {
        title: "Equipping agents for the real world with Agent Skills",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
        date: "2025-10-16",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["skills", "progressive-disclosure", "procedural-knowledge"],
        synthesis:
          "Explique comment packager des instructions, scripts et ressources dans des dossiers que l'agent charge seulement quand ils sont pertinents.",
        seniorTakeaway:
          "Les skills transforment le savoir d'equipe en capacites reutilisables; c'est une forme d'onboarding executable pour agents.",
        useWhen:
          "Pour capturer les pratiques internes de release, QA, docs, design review ou migration dans un format portable.",
      },
      {
        title: "Code execution with MCP: Building more efficient agents",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/code-execution-with-mcp",
        date: "2025-11-04",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["mcp", "tools", "execution", "efficiency"],
        synthesis:
          "Montre l'interet de rapprocher les agents des outils d'execution et de standardiser les interfaces via MCP.",
        seniorTakeaway:
          "Un bon agent est autant une question de contrats d'outils que de modele: le design de l'interface outil determine beaucoup de fiabilite.",
        useWhen:
          "Pour connecter des outils internes, environnements de build, bases documentaires ou actions metier a un agent.",
      },
      {
        title: "Fast regex search: indexing text for agent tools",
        publisher: "Cursor",
        url: "https://cursor.com/blog/fast-regex-search",
        date: "2026-03-23",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["search", "monorepo", "agent-tools", "indexing"],
        synthesis:
          "Cursor explique pourquoi les agents ont encore besoin de recherche texte ultra-rapide, notamment dans les monorepos ou ripgrep devient un goulot.",
        seniorTakeaway:
          "Le contexte n'est pas seulement semantique: les recherches exactes, fraiches et locales restent critiques pour eviter les errances couteuses.",
        useWhen:
          "Pour reflechir a l'outillage des agents dans un grand codebase ou une plateforme interne.",
      },
      {
        title: "Knowledge Priming",
        publisher: "Martin Fowler",
        url: "https://martinfowler.com/articles/reduce-friction-ai/knowledge-priming.html",
        date: "2025",
        kind: "engineering",
        sourceType: "independent",
        freshness: "durable",
        tags: ["ai-watchtower", "knowledge-priming", "context", "team-knowledge"],
        synthesis:
          "Montre comment reduire la friction IA en rendant les connaissances implicites disponibles avant que l'agent ne tente de resoudre le probleme.",
        seniorTakeaway:
          "Le contexte utile n'est pas seulement dans le repo: decisions passees, vocabulaire metier et contraintes locales doivent devenir consultables.",
        useWhen:
          "Pour transformer des docs d'equipe, ADR et notes produit en contexte exploitable par agents.",
      },
      {
        title: "Spec-Driven Development: Tools",
        publisher: "Martin Fowler",
        url: "https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html",
        date: "2026",
        kind: "engineering",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "spec-driven", "tools", "context-engineering"],
        synthesis:
          "Analyse comment les outils de spec-driven development changent le point de depart du travail IA: la spec devient un artefact actif qui pilote generation et verification.",
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
        url: "https://openai.com/index/harness-engineering/",
        date: "2026-02-11",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "harness", "agent-first", "prs"],
        synthesis:
          "Retour d'experience OpenAI sur un produit interne construit avec 0 ligne de code manuel, ou les humains pilotent l'environnement, les specs, les boucles de feedback et la lisibilite agent.",
        seniorTakeaway:
          "Le levier se deplace vers le harness: templates, CI, conventions, instructions repo, tests et lisibilite future pour agents.",
        useWhen:
          "Pour comprendre ce qui change dans le role d'un staff/tech lead quand plusieurs agents produisent le code.",
      },
      {
        title: "Introducing the Codex app",
        publisher: "OpenAI",
        url: "https://openai.com/index/introducing-the-codex-app/",
        date: "2026-02-02",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "desktop", "parallel-agents", "worktrees"],
        synthesis:
          "Positionne Codex comme un centre de commande pour gerer plusieurs agents, threads, worktrees, diffs et taches longues.",
        seniorTakeaway:
          "L'IDE n'est plus seulement un editeur: il devient un poste de supervision de travaux paralleles.",
        useWhen:
          "Pour evaluer comment organiser le travail multi-agent en local et dans le cloud.",
      },
      {
        title: "Codex for (almost) everything",
        publisher: "OpenAI",
        url: "https://openai.com/index/codex-for-almost-everything/",
        date: "2026-04-16",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "computer-use", "automations", "memory"],
        synthesis:
          "Expose l'extension de Codex au-dela du code: navigateur integre, computer use, plugins, memoire et automations qui reprennent du contexte dans le temps.",
        seniorTakeaway:
          "Les agents de dev deviennent des agents de cycle de vie logiciel: design, verification UI, docs, suivi de PR et taches recurrentes.",
        useWhen:
          "Pour suivre l'etat actuel des capacites Codex en avril 2026.",
      },
      {
        title: "The third era of AI software development",
        publisher: "Cursor",
        url: "https://cursor.com/blog/third-era",
        date: "2026-02-26",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["cursor", "cloud-agents", "autonomy", "artifacts"],
        synthesis:
          "Cursor decrit le passage de l'autocomplete aux agents synchrones, puis aux agents cloud autonomes sur des taches plus longues avec artefacts de revue.",
        seniorTakeaway:
          "La valeur senior devient de definir le probleme et les criteres de revue plutot que de surveiller chaque action.",
        useWhen:
          "Pour expliquer a une equipe pourquoi les workflows agents ne sont pas juste une version plus rapide de l'autocomplete.",
      },
      {
        title: "Run cloud agents in your own infrastructure",
        publisher: "Cursor",
        url: "https://cursor.com/blog/self-hosted-cloud-agents",
        date: "2026-03-25",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["self-hosted", "enterprise", "security", "cloud-agents"],
        synthesis:
          "Annonce les agents cloud self-hosted: les executions restent dans l'infrastructure client tandis que Cursor orchestre l'experience.",
        seniorTakeaway:
          "Pour les entreprises, l'adoption agentique depend souvent plus de l'environnement, des secrets et de la conformite que du modele.",
        useWhen:
          "Pour discuter architecture d'adoption dans une organisation regulee ou gros monorepo interne.",
      },
      {
        title: "Background Agents",
        publisher: "Cursor Docs",
        url: "https://docs.cursor.com/en/background-agents",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["cursor", "background-agents", "remote-env", "security"],
        synthesis:
          "Documente les agents asynchrones Cursor: environnements distants, snapshots, commandes d'installation, terminaux, branches et risques de securite.",
        seniorTakeaway:
          "Un agent autonome a besoin d'un environnement reproductible et d'une politique de risque differente d'un assistant foreground.",
        useWhen:
          "Pour mettre en place des agents background sans sous-estimer setup, droits GitHub et exfiltration.",
      },
      {
        title: "Building Effective Agents",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        date: "2024-12-19",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["ai-watchtower", "agents", "workflow", "orchestration"],
        synthesis:
          "Cadre durable pour concevoir des workflows agents simples: commencer par des patterns controles avant de complexifier l'autonomie.",
        seniorTakeaway:
          "La bonne architecture agentique est souvent sobre: workflow explicite, outils clairs, observation et escalation humaine avant autonomie totale.",
        useWhen:
          "Pour eviter de surconcevoir un systeme multi-agent alors qu'un workflow outille suffit.",
      },
      {
        title: "Agentic SDLC Handbook",
        publisher: "Daniel Meppiel",
        url: "https://danielmeppiel.github.io/agentic-sdlc-handbook/",
        date: "rolling",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "sdlc", "agents", "delivery"],
        synthesis:
          "Handbook pratique pour appliquer les agents a tout le cycle de vie logiciel: ideation, specs, code, tests, review, release et operations.",
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
        url: "https://linear.app/developers/aig",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear", "agents", "ux", "accountability"],
        synthesis:
          "Principes pour integrer les agents comme acteurs visibles dans les workflows: identite claire, etat transparent, feedback immediat et responsabilite humaine finale.",
        seniorTakeaway:
          "Un agent ne doit pas etre un acteur invisible: l'interface doit rendre delegation, etat et accountability impossibles a confondre.",
        useWhen:
          "Pour designer une integration agent dans Linear, Jira, GitHub, Slack ou un outil interne.",
      },
      {
        title: "How we use Linear Agent at Linear",
        publisher: "Linear",
        url: "https://linear.app/now/how-we-use-linear-agent-at-linear",
        date: "2026-04-10",
        kind: "case-study",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear", "customer-feedback", "prd", "coding-agent"],
        synthesis:
          "Cas concret: un email client devient issue, triage, contexte produit, delegation a un coding agent, PR revue humainement, puis boucle de retour client.",
        seniorTakeaway:
          "Le workflow fort n'est pas 'agent ecrit du code', mais 'contexte client -> decision produit -> implementation -> feedback loop'.",
        useWhen:
          "Pour imaginer des process agents qui traversent CX, produit et engineering.",
      },
      {
        title: "AI Agents in Linear",
        publisher: "Linear Docs",
        url: "https://linear.app/docs/agents-in-linear",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear", "delegation", "guidance", "agents"],
        synthesis:
          "Explique les agents comme app users: assignation, mentions, guidance d'organisation, vues de suivi et responsabilite humaine conservee.",
        seniorTakeaway:
          "La delegation a un agent doit etre observable dans le systeme de travail, pas cachee dans un chat separe.",
        useWhen:
          "Pour definir les conventions d'assignation, de suivi et de guidance d'equipe.",
      },
      {
        title: "Introducing Linear Agent",
        publisher: "Linear Changelog",
        url: "https://linear.app/changelog/2026-03-24-introducing-linear-agent",
        date: "2026-03-24",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["linear-agent", "skills", "automations", "code-intelligence"],
        synthesis:
          "Linear introduit un agent integre au produit, des skills reutilisables, automations de triage et code intelligence.",
        seniorTakeaway:
          "Les outils de product development deviennent eux-memes des surfaces d'orchestration d'agents.",
        useWhen:
          "Pour suivre l'evolution des outils de planning vers des systemes agents natifs.",
      },
      {
        title: "Linear for Agents",
        publisher: "Linear Changelog",
        url: "https://linear.app/changelog/2025-05-20-linear-for-agents",
        date: "2025-05-20",
        kind: "product",
        sourceType: "primary",
        freshness: "durable",
        tags: ["agent-api", "teammates", "issues", "pr"],
        synthesis:
          "Lancement du modele ou les agents deviennent des utilisateurs applicatifs assignables et mentionnables comme des teammates.",
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
        url: "https://cursor.com/blog/cursorbench",
        date: "2026-03-11",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["evals", "cursorbench", "online-offline", "quality"],
        synthesis:
          "Cursor decrit un processus hybride d'evals offline et online pour garder les mesures alignees avec les vrais usages developpeurs.",
        seniorTakeaway:
          "Les benchmarks publics ne suffisent pas: il faut mesurer correction, qualite, efficience et comportement interactif dans son contexte.",
        useWhen:
          "Pour creer un programme d'evaluation interne des modeles et agents.",
      },
      {
        title: "Demystifying evals for AI agents",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
        date: "2026-01-09",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["evals", "agents", "quality-gates"],
        synthesis:
          "Cadre pour penser les evals agents: objectifs, traces, criteres de succes et ecarts entre demos et fiabilite.",
        seniorTakeaway:
          "Les evals doivent capturer le workflow et les erreurs observees, pas seulement une sortie finale jolie.",
        useWhen:
          "Pour formaliser des gates avant de laisser un agent toucher au code critique.",
      },
      {
        title: "Quantifying infrastructure noise in agentic coding evals",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/infrastructure-noise",
        date: "2026-02-05",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["evals", "infrastructure", "noise", "coding-agents"],
        synthesis:
          "Analyse comment l'environnement d'execution, les tests et l'infrastructure peuvent polluer l'interpretation des performances agents.",
        seniorTakeaway:
          "Une eval agent mesure aussi ton harness. Si l'environnement est flaky, tu mesures le bruit autant que le modele.",
        useWhen:
          "Pour fiabiliser une suite de benchmarks internes ou une CI pilotee par agents.",
      },
      {
        title: "Copilot coding agent validates code security and quality",
        publisher: "GitHub Changelog",
        url: "https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/",
        date: "2025-10-28",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["copilot", "security", "quality", "validation"],
        synthesis:
          "GitHub ajoute des validations securite et qualite automatiques sur le code genere par Copilot coding agent.",
        seniorTakeaway:
          "Les plateformes commencent a integrer des garde-fous automatiques parce que la revue humaine seule ne scale pas.",
        useWhen:
          "Pour comparer ce que les plateformes de code review agentique fournissent nativement.",
      },
      {
        title: "Where Do AI Coding Agents Fail?",
        publisher: "arXiv / MSR 2026",
        url: "https://arxiv.org/abs/2601.15195",
        date: "2026-01-21",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["failed-prs", "github", "agents", "research"],
        synthesis:
          "Etude empirique de 33k PRs agent-authored pour comprendre les facteurs de merge, CI, review et echecs.",
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
        url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
        date: "2025-11-26",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["long-running", "harness", "progress", "state"],
        synthesis:
          "Propose un pattern initializer agent + coding agent pour laisser un etat propre, incrementer et documenter le travail entre sessions.",
        seniorTakeaway:
          "La tache longue exige un protocole de passage de relais. Sans journal, checkpoints et objectifs incrementaux, l'agent recommence ou declare victoire trop tot.",
        useWhen:
          "Pour automatiser migrations, refontes ou projets qui se poursuivent sur plusieurs sessions.",
      },
      {
        title: "Building a C compiler with a team of parallel Claudes",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/building-c-compiler",
        date: "2026-02-05",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["parallel-agents", "compiler", "locks", "tests"],
        synthesis:
          "Experience de 16 agents construisant un compilateur C en Rust, avec locks de taches, conteneurs, tests et synchronisation Git.",
        seniorTakeaway:
          "Le multi-agent n'est utile que si le travail est decomposable, testable et synchronise par des artefacts simples.",
        useWhen:
          "Pour reflechir a la parallelisation d'un gros chantier technique.",
      },
      {
        title: "How we built our multi-agent research system",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/multi-agent-research-system",
        date: "2025-06-13",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["multi-agent", "research", "orchestrator", "workers"],
        synthesis:
          "Decrit une architecture de recherche multi-agent avec un orchestrateur qui distribue des sous-taches et synthetise les retours.",
        seniorTakeaway:
          "Le pattern orchestrator-worker reste une brique durable pour isoler les contextes et paralleliser l'exploration.",
        useWhen:
          "Pour concevoir des agents de recherche technique, veille ou investigation codebase.",
      },
      {
        title: "Multi-Agents: What's Actually Working",
        publisher: "Cognition",
        url: "https://cognition.ai/",
        date: "2026-04-22",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["devin", "multi-agent", "cloud-agents"],
        synthesis:
          "Article recent signale par Cognition sur les patterns multi-agents qui marchent dans la pratique de Devin.",
        seniorTakeaway:
          "A suivre comme signal terrain: les labs d'agents convergent vers des formes d'orchestration plus sobres et verifiables.",
        useWhen:
          "Pour completer les retours Anthropic/OpenAI avec un acteur specialise agent logiciel.",
      },
      {
        title: "Spec Kit Agents: Context-Grounded Agentic Workflows",
        publisher: "arXiv",
        url: "https://arxiv.org/abs/2604.05278",
        date: "2026-04-07",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["spec-kit", "context-grounding", "sdd", "agents"],
        synthesis:
          "Propose d'ajouter des hooks de grounding et validation a chaque phase Spec Kit pour eviter hallucinations et violations d'architecture.",
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
        url: "https://wandb.ai/site/articles/ai-agent-observability/",
        date: "2025",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["ai-watchtower", "observability", "traces", "agents"],
        synthesis:
          "Cadre pour instrumenter les agents: traces, appels outils, couts, latence, qualite et comparaison entre runs.",
        seniorTakeaway:
          "Les agents doivent etre debuggables comme un systeme distribue: chaque decision importante doit laisser une trace exploitable.",
        useWhen:
          "Pour definir les signaux minimaux avant de deployer un agent dans un flux d'equipe.",
      },
      {
        title: "Langfuse",
        publisher: "Langfuse",
        url: "https://langfuse.com/",
        date: "rolling",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["ai-watchtower", "llmops", "observability", "evals"],
        synthesis:
          "Plateforme open source de LLM observability: traces, prompts, scores, evals et couts pour applications et agents.",
        seniorTakeaway:
          "Une stack agentique sans traces et evals finit vite en boite noire non gouvernable.",
        useWhen:
          "Pour choisir une base d'observabilite LLM/agent compatible open source.",
      },
      {
        title: "Entire",
        publisher: "Entire",
        url: "https://entire.io/",
        date: "rolling",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["ai-watchtower", "session-recorder", "git", "agent-runs"],
        synthesis:
          "Enregistre les sessions agents via Git hooks afin de conserver transcript, prompts, outils, couts, fichiers modifies et checkpoints.",
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
        url: "https://ejholmes.github.io/2026/02/28/mcp-is-dead-long-live-the-cli.html",
        date: "2026-02-28",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "mcp", "cli", "debuggability", "tokens"],
        synthesis:
          "Position critique: beaucoup de cas MCP seraient mieux servis par des CLI composables, debuggables et deja comprises par humains et agents.",
        seniorTakeaway:
          "La meilleure interface outil n'est pas toujours le protocole le plus neuf; debuggabilite, auth, composition et cout contexte comptent.",
        useWhen:
          "Pour arbitrer entre MCP, CLI, API interne ou skill dans un environnement agentique.",
      },
      {
        title: "RTK",
        publisher: "rtk-ai",
        url: "https://github.com/rtk-ai/rtk",
        date: "rolling",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "token-reduction", "claude-code", "tool-output"],
        synthesis:
          "Outil Rust qui filtre et compresse les sorties d'outils avant qu'elles ne reviennent dans le contexte de Claude Code.",
        seniorTakeaway:
          "La pollution du contexte vient souvent des sorties brutes, pas seulement des prompts; optimiser les tool outputs est un levier concret.",
        useWhen:
          "Pour des repos ou commandes tres verbeuses qui degradent la qualite et le cout des sessions agents.",
      },
      {
        title: "Serena",
        publisher: "oraios",
        url: "https://github.com/oraios/serena",
        date: "rolling",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["ai-watchtower", "code-intelligence", "mcp", "language-server"],
        synthesis:
          "Serveur outille par language servers pour donner aux agents une comprehension symbolique du code au lieu de tout charger en texte.",
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
        url: "https://openai.com/index/codex-now-generally-available/",
        date: "2025-10-06",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "sdk", "slack", "admin"],
        synthesis:
          "GA de Codex avec Slack, SDK, controles admin, usage en editeur/terminal/cloud et exemples entreprise.",
        seniorTakeaway:
          "Les agents de dev sortent du mode individuel: admin, analytics, Slack et SDK deviennent des criteres d'achat.",
        useWhen:
          "Pour comprendre la surface Codex equipe/entreprise.",
      },
      {
        title: "How OpenAI uses Codex",
        publisher: "OpenAI",
        url: "https://cdn.openai.com/pdf/6a2631dc-783e-479b-b1a4-af0cfbd38630/how-openai-uses-codex.pdf",
        date: "2025",
        kind: "case-study",
        sourceType: "primary",
        freshness: "durable",
        tags: ["codex", "use-cases", "refactoring", "tests"],
        synthesis:
          "PDF de cas d'usage internes OpenAI: comprehension de code, refactoring, migrations, performance, tests, flow et ideation.",
        seniorTakeaway:
          "Les meilleurs cas ne sont pas seulement generation de features: comprendre, migrer, couvrir, optimiser et investiguer comptent autant.",
        useWhen:
          "Pour construire une matrice de cas d'usage IA dans une equipe existante.",
      },
      {
        title: "About GitHub Copilot coding agent",
        publisher: "GitHub Docs",
        url: "https://docs.github.com/copilot/concepts/coding-agent/about-copilot-coding-agent",
        date: "rolling",
        kind: "docs",
        sourceType: "primary",
        freshness: "recent",
        tags: ["github", "copilot", "coding-agent", "prs"],
        synthesis:
          "Documentation du coding agent Copilot: assignation, plans payants, integration GitHub et comportement de PR.",
        seniorTakeaway:
          "GitHub devient une surface native pour assigner du travail a des agents, pas seulement pour heberger leurs PRs.",
        useWhen:
          "Pour comparer les workflows GitHub-first avec Codex, Cursor ou Claude Code.",
      },
      {
        title: "A new era for Sourcegraph",
        publisher: "Sourcegraph",
        url: "https://sourcegraph.com/blog/a-new-era-for-sourcegraph-the-intelligence-layer-for-ai-coding-agents-and-developers",
        date: "2026-02-25",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["code-intelligence", "enterprise", "monorepo", "agents"],
        synthesis:
          "Positionne Sourcegraph comme couche d'intelligence pour humains et agents sur grands codebases.",
        seniorTakeaway:
          "L'agent a besoin de code intelligence d'entreprise: dependances cross-repo, historique, conventions et architecture.",
        useWhen:
          "Pour reflechir buy vs build autour du code search et de l'indexation agentique.",
      },
      {
        title: "What it actually takes to run code intelligence in-house",
        publisher: "Sourcegraph",
        url: "https://sourcegraph.com/blog/what-it-actually-takes-to-run-code-intelligence-in-house",
        date: "2026-04-21",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["code-intelligence", "build-vs-buy", "enterprise"],
        synthesis:
          "Analyse les exigences et couts de construire une plateforme de code intelligence interne.",
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
        url: "https://www.anthropic.com/engineering/claude-code-sandboxing",
        date: "2025-10-20",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["permissions", "autonomy", "security", "claude-code"],
        synthesis:
          "Explore comment depasser les prompts de permission repetitifs pour obtenir plus d'autonomie sans perdre le controle securite.",
        seniorTakeaway:
          "La securite agentique est un design de politique et d'environnement, pas une pile de confirmations manuelles.",
        useWhen:
          "Pour definir modes de permission, commandes autorisees et limites d'autonomie.",
      },
      {
        title: "Claude Code auto mode",
        publisher: "Anthropic Engineering",
        url: "https://www.anthropic.com/engineering/claude-code-auto-mode",
        date: "2026-03-25",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["auto-mode", "permissions", "sandbox"],
        synthesis:
          "Presente un mode plus autonome pour Claude Code avec garde-fous et skip de permissions plus sur.",
        seniorTakeaway:
          "L'autonomie n'est acceptable que si l'environnement, les commandes et les sorties restent auditablement controles.",
        useWhen:
          "Pour evaluer si une equipe peut passer d'un agent accompagne a un agent plus autonome.",
      },
      {
        title: "Addendum to GPT-5 system card: GPT-5-Codex",
        publisher: "OpenAI",
        url: "https://cdn.openai.com/pdf/97cc5669-7a25-4e63-b15f-5fd5bdc4d149/gpt-5-codex-system-card.pdf",
        date: "2025-09-15",
        kind: "report",
        sourceType: "primary",
        freshness: "durable",
        tags: ["system-card", "codex", "safety", "sandboxing"],
        synthesis:
          "Documente les considerations de securite et mitigations produit pour GPT-5-Codex, dont sandboxing et acces reseau configurable.",
        seniorTakeaway:
          "Les system cards donnent des indices utiles pour les politiques internes: sandbox, reseau, secrets et review humaine.",
        useWhen:
          "Pour construire une grille de risques avant de deploiement d'agents de code.",
      },
      {
        title: "Claude Code product page",
        publisher: "Anthropic",
        url: "https://www.anthropic.com/product/claude-code",
        date: "rolling",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["claude-code", "enterprise", "security", "product"],
        synthesis:
          "Page produit utile pour suivre les capacites, integrations et positionnement entreprise de Claude Code.",
        seniorTakeaway:
          "Les claims produit doivent etre lus comme signaux de direction, puis verifies dans le workflow reel de l'equipe.",
        useWhen:
          "Pour maintenir une veille outillage sans confondre marketing et pratiques prouvees.",
      },
      {
        title: "Constitutional Spec-Driven Development",
        publisher: "arXiv",
        url: "https://arxiv.org/abs/2602.02584",
        date: "2026-01-31",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["spec-driven", "security", "constitution", "governance"],
        synthesis:
          "Recherche sur l'integration de principes securite non negociables directement dans la couche de specifications.",
        seniorTakeaway:
          "La gouvernance doit etre en amont de la generation: les specs sont un levier de securite by construction.",
        useWhen:
          "Pour justifier une constitution Spec Kit stricte dans un projet open source ou entreprise.",
      },
      {
        title: "OWASP Top 10 for Large Language Model Applications",
        publisher: "OWASP",
        url: "https://genai.owasp.org/llm-top-10/",
        date: "rolling",
        kind: "docs",
        sourceType: "independent",
        freshness: "recent",
        tags: ["ai-watchtower", "owasp", "llm-security", "prompt-injection"],
        synthesis:
          "Referentiel de risques pour applications LLM: prompt injection, donnees sensibles, supply chain, excessive agency, sorties non fiables et gouvernance.",
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
        url: "https://dora.dev/research/2025/dora-report/",
        date: "2025",
        kind: "report",
        sourceType: "independent",
        freshness: "durable",
        tags: ["dora", "metrics", "delivery", "ai-adoption"],
        synthesis:
          "Rapport DORA sur l'IA comme amplificateur des forces et faiblesses organisationnelles, avec focus sur systemes et capacites.",
        seniorTakeaway:
          "L'IA n'annule pas les fondamentaux DevOps; elle amplifie la qualite ou le chaos de ton systeme existant.",
        useWhen:
          "Pour cadrer une discussion direction/engineering sur ROI, throughput et instabilite.",
      },
      {
        title: "Octoverse 2025",
        publisher: "GitHub Blog",
        url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/",
        date: "2025-10",
        kind: "report",
        sourceType: "primary",
        freshness: "durable",
        tags: ["github", "octoverse", "ai-projects", "prs"],
        synthesis:
          "GitHub observe l'explosion des projets IA, des PRs et de TypeScript, avec contexte sur agents et code review.",
        seniorTakeaway:
          "Les signaux d'adoption de plateforme montrent ou les pratiques se normalisent, meme si elles ne prouvent pas la productivite.",
        useWhen:
          "Pour suivre les tendances ecosysteme au niveau GitHub.",
      },
      {
        title: "Scaling Codex to enterprises worldwide",
        publisher: "OpenAI",
        url: "https://openai.com/index/scaling-codex-to-enterprises-worldwide/",
        date: "2026-04-21",
        kind: "product",
        sourceType: "primary",
        freshness: "recent",
        tags: ["codex", "enterprise", "adoption", "gsi"],
        synthesis:
          "OpenAI annonce Codex Labs, des partenaires integrateurs et des usages entreprise sur tests, review, features, incidents et grands repos.",
        seniorTakeaway:
          "Le marche passe du pilote individuel a l'industrialisation: formation, integration, gouvernance et use cases repetables.",
        useWhen:
          "Pour comprendre comment les fournisseurs vendent l'adoption Codex en entreprise.",
      },
      {
        title: "Stack Overflow Developer Survey 2025",
        publisher: "Stack Overflow",
        url: "https://survey.stackoverflow.co/2025",
        date: "2025",
        kind: "report",
        sourceType: "independent",
        freshness: "durable",
        tags: ["survey", "trust", "developers", "ai-tools"],
        synthesis:
          "Donnees de perception et adoption IA chez les developpeurs, utiles pour comprendre confiance, usage et scepticisme.",
        seniorTakeaway:
          "L'adoption massive ne signifie pas confiance massive; la qualite percue et la verification restent centrales.",
        useWhen:
          "Pour equilibrer les claims vendeurs avec le ressenti des praticiens.",
      },
      {
        title: "We are Changing our Developer Productivity Experiment Design",
        publisher: "METR",
        url: "https://metr.org/blog/2026-02-24-uplift-update/",
        date: "2026-02-24",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["productivity", "measurement", "selection-effects", "agents"],
        synthesis:
          "METR explique pourquoi mesurer la productivite IA devient plus difficile: adoption accrue, selection des taches, parallelisme agents et biais de participation.",
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
        url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/",
        date: "2025-07-10",
        kind: "research",
        sourceType: "independent",
        freshness: "historical",
        tags: ["productivity", "experienced-devs", "rct", "slowdown"],
        synthesis:
          "RCT sur 16 developpeurs open source experimentes travaillant sur leurs repos; dans ce cadre early-2025, l'IA les ralentit de 19%.",
        seniorTakeaway:
          "Les gains dependent du contexte: codebase connu, taches matures, cout de revue et qualite de l'outillage peuvent inverser le benefice.",
        useWhen:
          "Pour temperer les promesses de productivite et parler de conditions d'usage.",
      },
      {
        title: "AIDev: Studying AI Coding Agents on GitHub",
        publisher: "arXiv",
        url: "https://arxiv.org/abs/2602.09185",
        date: "2026-02",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["aidev", "github", "agentic-prs", "dataset"],
        synthesis:
          "Dataset de 932 791 PRs agentiques produites par Codex, Devin, Copilot, Cursor et Claude Code.",
        seniorTakeaway:
          "On commence a pouvoir etudier les agents dans le monde reel a grande echelle, pas seulement via anecdotes.",
        useWhen:
          "Pour alimenter une veille recherche sur adoption et integration de PRs agents.",
      },
      {
        title: "How AI Coding Agents Modify Code",
        publisher: "arXiv / MSR 2026",
        url: "https://arxiv.org/abs/2601.17581",
        date: "2026-01",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["agentic-prs", "code-changes", "github", "msr"],
        synthesis:
          "Compare des PRs agentiques mergees et humaines pour analyser comment les agents modifient le code et decrivent leurs changements.",
        seniorTakeaway:
          "La qualite d'un agent doit se lire dans la taille, la forme, la description et l'integration des changements.",
        useWhen:
          "Pour construire des heuristiques de review de PRs generees par agents.",
      },
      {
        title: "AgenticFlict",
        publisher: "arXiv",
        url: "https://arxiv.org/abs/2604.03551",
        date: "2026-04-04",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["merge-conflicts", "agent-prs", "github", "dataset"],
        synthesis:
          "Dataset sur les conflits de merge dans les PRs d'agents de code sur GitHub.",
        seniorTakeaway:
          "Plus d'agents en parallele signifie plus de risques d'integration; la coordination devient un probleme produit.",
        useWhen:
          "Pour definir des strategies worktree, locking, petits lots et integration continue.",
      },
      {
        title: "Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants",
        publisher: "OpenReview / AIWare 2026",
        url: "https://openreview.net/pdf?id=bw5mNj75h9",
        date: "2026",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["spec-driven", "contracts", "ai-coding", "sdd"],
        synthesis:
          "Situe le spec-driven development comme passage du code source de verite vers le contrat/specification maintenu.",
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
