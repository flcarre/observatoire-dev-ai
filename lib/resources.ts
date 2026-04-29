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
      "Sélection manuelle des ressources les plus proches de la cible senior: product engineering, harness, contexte, orchestration, observabilité, token economy, sécurité et limites.",
    categoryIds: [
      "product-engineering-architecture",
      "context-engineering",
      "agentic-coding",
      "long-running-multi-agent",
      "tools-platforms",
      "evals-quality",
      "observability-debugging",
      "inférence-economy",
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
      "Comprendre le glissement du développeur vers un rôle qui cadre le produit, l'architecture et la qualité des décisions.",
    whyItMatters:
      "Quand l'exécution devient moins chère, les mauvaises specs, mauvais arbitrages et mauvaises frontières système coûtent plus vite.",
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
          "Retour terrain PostHog sur la construction de produits utilisés par des agents: exposer les capacités au bon niveau d'abstraction, charger le contexte universel et écrire des skills qui capturent le savoir produit.",
        articleSummary:
          "L'article explique que les agents ne doivent pas être traités comme une simple fonctionnalité ajoutée au produit, mais comme une nouvelle surface d'interaction. PostHog partage cinq règles issues de la reconstruction de son architecture agent/MCP: donner aux agents les mêmes capacités que les utilisateurs, exposer le produit au bon niveau d'abstraction, charger le contexte universel dès le départ, rédiger des skills utiles et tester les agents comme de vrais utilisateurs. Le passage le plus concret concerne la génération contrôlée d'outils à partir d'endpoints typés, avec opt-in explicite par équipe produit. L'article insiste aussi sur la valeur du contexte produit: taxonomie, dialecte SQL, contraintes de requête et savoir métier doivent être disponibles sans que l'agent les redécouvre. La partie skills rappelle qu'il ne faut pas écrire des manuels rigides, mais transmettre les conventions et jugements que seul un humain du domaine connaît. Pour une équipe senior, c'est surtout un article d'architecture produit: construire pour agents demande API, permissions, traces, evals et empathie utilisateur.",
        seniorTakeaway:
          "Construire pour les agents ressemble a construire une nouvelle surface produit: API, permissions, sémantique, contexte et confiance doivent être designes ensemble.",
        useWhen:
          "Pour cadrer une stratégie produit ou plateforme où des agents doivent agir dans ton produit, pas seulement autour de ton code.",
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
          "Definition du product engineer comme profil qui combine sens produit, exécution technique, ownership utilisateur et capacité a shipper sans silo strict.",
        articleSummary:
          "PostHog décrit le product engineer comme un développeur qui ne se limite pas à livrer du code, mais prend responsabilité sur l'impact produit. Le texte oppose ce rôle au full-stack classique: le sujet n'est pas de connaître chaque couche en profondeur, mais de travailler à rebours depuis l'expérience utilisateur et le résultat business. Le product engineer parle aux utilisateurs, participe aux décisions roadmap, fait du support, arbitre l'UX et accepte de jeter des features qui ne servent plus. Dans un monde où l'IA rend la production de code moins rare, l'article soutient que la valeur se déplace vers le choix du bon problème, la qualité du jugement et la boucle d'apprentissage. Le handbook est présenté comme un document vivant pour aider les engineers à adopter ces comportements sans attendre une réorganisation formelle. Pour l'observatoire, l'intérêt est de cadrer le rôle senior post-IA: moins spécialiste de syntaxe, plus propriétaire du système produit.",
        seniorTakeaway:
          "L'IA accélère ce profil: plus le code est délégable, plus la valeur vient de la boucle problème, décision, livraison, mesure.",
        useWhen:
          "Pour repositionner le rôle senior dans une équipe où les frontières PM/design/dev bougent.",
      },
      {
        title: "AI turns software engineers into product engineers",
        publisher: "Atlassian Work Life",
        author: "Atlassian",
        url: "https://www.atlassian.com/blog/artificial-intelligence/how-ai-turns-software-engineers-into-product-engineers",
        date: "2026-01-15",
        kind: "engineering",
        sourceType: "primary",
        freshness: "recent",
        tags: ["product-engineering", "ai-era", "customer-context", "taste"],
        synthesis:
          "Atlassian décrit le passage du modèle PM-spécification-dev-exécution vers un rôle d'engineer qui participe au choix du problème, au contexte client et à la validation produit.",
        articleSummary:
          "L'article part du constat que les agents de code compressent le temps entre une intention et un prototype fonctionnel. Quand l'implémentation devient moins rare, le risque principal n'est plus seulement de savoir construire, mais de choisir quoi construire. Atlassian définit le product engineer comme la combinaison de l'excellence technique, du contexte client et de la résolution stratégique de problèmes. Le texte oppose le développeur ticket-taker, mesuré sur la livraison d'une spec, à l'engineer qui participe aux interviews, lit le feedback support, challenge la solution et mesure l'adoption. La partie la plus utile est la notion de goût produit: quand l'IA peut produire quelque chose qui compile et semble correct, quelqu'un doit juger si cela résout vraiment le problème utilisateur. L'article reste vendor-friendly, mais il cadre bien la mutation du rôle senior: plus de proximité avec les utilisateurs, plus de responsabilité sur les outcomes, moins d'exécution aveugle.",
        seniorTakeaway:
          "Avec les agents, le jugement produit devient un avantage technique: un senior doit savoir relier problème, solution, adoption et architecture.",
        useWhen:
          "Pour expliquer à une équipe pourquoi l'IA ne rend pas le rôle engineer moins important, mais le rapproche du cadrage produit.",
      },
      {
        title: "The next big job in tech may be the 'product engineer'",
        publisher: "Yahoo Tech / Business Insider",
        author: "Lakshmi Varanasi",
        url: "https://tech.yahoo.com/ai/claude/articles/next-big-job-tech-may-090901264.html/",
        date: "2026-04-06",
        kind: "report",
        sourceType: "independent",
        freshness: "recent",
        tags: ["product-engineering", "pm-role", "anthropic", "ai-productivity"],
        synthesis:
          "Article de veille sur l'émergence du product engineer comme réponse organisationnelle à la hausse de productivité des engineers outillés par l'IA.",
        articleSummary:
          "L'article reprend un signal intéressant de l'écosystème: si les outils comme Claude Code rendent les engineers deux à trois fois plus productifs sur certains travaux, les PMs et designers se retrouvent à supporter un volume effectif de delivery beaucoup plus élevé. Une réponse possible n'est pas simplement d'embaucher plus de PMs, mais de donner à des engineers product-minded la responsabilité produit de petits chantiers. Le cas Anthropic cité dans l'article est concret: pour des projets de moins de deux semaines d'effort engineering, l'engineer peut agir comme mini-PM, aligner les stakeholders et assumer l'outcome. Le texte est court et journalistique, donc à lire comme un signal de marché plutôt qu'un modèle complet. Sa valeur pour l'observatoire est de montrer que le titre product engineer sort du vocabulaire startup pour devenir une option d'operating model discutée publiquement.",
        seniorTakeaway:
          "La productivité agentique déplace la pression vers la coordination produit; les petits chantiers peuvent exiger un ownership engineer plus complet.",
        useWhen:
          "Pour nourrir une discussion org design sur le ratio PM/engineering et les seuils de délégation produit.",
      },
      {
        title: "Product meets Engineering in the AI Era",
        publisher: "TechEmpower",
        author: "Tony Karrer",
        url: "https://www.techempower.com/blog/2026/03/13/product-meets-engineering-in-the-ai-era/",
        date: "2026-03-13",
        kind: "engineering",
        sourceType: "independent",
        freshness: "recent",
        tags: ["product-engineering", "specs", "agentic-coding", "prd"],
        synthesis:
          "Analyse le nouveau frottement entre produit et engineering quand les specs sont lues littéralement par des agents de code.",
        articleSummary:
          "TechEmpower décrit un problème très concret des workflows agentiques: la spec a désormais deux publics, les humains et les agents. Une spec floue peut soit générer une longue liste de questions qui ralentit l'équipe, soit être exécutée trop vite dans la mauvaise direction. L'article recommande de donner aux PMs des outils codebase-aware pour clarifier l'état produit, les questions ouvertes et les edge cases avant le handoff. Il propose aussi de parler davantage de specs que de tickets ou PRDs, car l'artefact devient une entrée opérationnelle pour l'agent. La partie la plus utile pour les engineers est le rappel que la spec claire ne supprime pas l'engineering: architecture, contraintes, sécurité, découpage en tâches testables et revue restent des responsabilités humaines. Pour une équipe senior, c'est une ressource pratique sur l'interface PM-engineer-agent.",
        seniorTakeaway:
          "Le product engineer doit écrire et relire les specs comme des contrats exécutables: assez précises pour l'agent, assez contextualisées pour l'architecture.",
        useWhen:
          "Pour améliorer Definition of Ready, PRDs, tickets et specs dans une équipe qui délègue à des coding agents.",
      },
      {
        title: "When Everyone Can Build: Redesigning Product Work for the AI Era in 2026",
        publisher: "Adaline Labs",
        author: "Nilesh Barla",
        url: "https://labs.adaline.ai/p/redesigning-product-work-for-the-ai-era-in-2026",
        date: "2026-01-31",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["product-engineering", "role-boundaries", "decision-rights", "coherence"],
        synthesis:
          "Propose de remplacer les frontières PM/designer/engineer par des droits de décision explicites quand l'IA permet à chacun de produire des artefacts.",
        articleSummary:
          "L'article décrit la collapse des frontières de rôle: les PMs peuvent produire des dashboards, les designers des prototypes plus proches du code, et les engineers des variantes de copy ou de scope. Le problème n'est pas que tout le monde puisse produire plus, mais que la cohérence produit se dégrade quand les décisions ne sont pas attribuées clairement. Adaline propose de raisonner en doer, decider et reviewer plutôt qu'en titres de poste. La lecture est utile pour le thème product engineer parce qu'elle évite un piège: le rôle hybride ne doit pas devenir une zone floue où chacun fait tout sans accountability. Le product engineer a besoin de droits de décision explicites, d'artefacts partagés et de règles de revue. Sinon l'IA augmente le throughput visible tout en dispersant le sens, le langage, les métriques et les patterns UX.",
        seniorTakeaway:
          "Un rôle hybride ne marche que si l'équipe rend visibles decision rights, reviewers et critères de cohérence.",
        useWhen:
          "Pour refondre la collaboration PM/design/engineering quand l'équipe prototype et shippe plus vite avec l'IA.",
      },
      {
        title: "Why we're hiring AI Engineers",
        publisher: "incident.io",
        author: "Pete Hamilton",
        url: "https://incident.io/blog/why-hire-ai-engineers",
        date: "2025-04-03",
        kind: "engineering",
        sourceType: "primary",
        freshness: "durable",
        tags: ["product-engineering", "ai-engineering", "evals", "agentic-products"],
        synthesis:
          "incident.io distingue product engineering, AI sprinkling et AI engineering pour expliquer le nouveau rôle qui transforme des modèles probabilistes en produit fiable.",
        articleSummary:
          "incident.io explique pourquoi l'entreprise, historiquement organisée autour de product engineers, ouvre un rôle AI Engineer pour ses produits agentiques. Le texte sépare trois niveaux: logiciel déterministe sans IA, fonctionnalité avec 'AI sprinkles', puis AI engineering où l'IA devient coeur de la valeur produit. À ce dernier niveau, les tests unitaires classiques ne suffisent plus: il faut evals, backtesting, orchestration, outils de debug, safety rails et benchmarks adaptés. L'article est précieux car il ne confond pas AI engineer avec chercheur fondation model. La cible est un builder produit capable de transformer des modèles existants en workflows réels, sûrs et utiles. Le lien avec product engineer est direct: les meilleurs profils combinent instincts produit, craft logiciel et capacité à opérer des systèmes probabilistes en production.",
        seniorTakeaway:
          "Le product engineer AI-native doit savoir construire le produit et le harness d'evaluation qui rend ce produit fiable.",
        useWhen:
          "Pour clarifier la différence entre product engineer, AI engineer applicatif et ML researcher dans une organisation produit.",
      },
      {
        title: "Coinbase's bet on agent-first development",
        publisher: "Linear Customers",
        author: "Linear",
        url: "https://linear.app/customers/coinbase",
        date: "2026",
        kind: "case-study",
        sourceType: "primary",
        freshness: "recent",
        tags: ["product-engineering", "agent-first", "source-of-truth", "coinbase"],
        synthesis:
          "Cas Coinbase/Base sur une organisation qui repense le travail produit autour d'agents, d'un contexte structuré et d'une source de vérité exploitable.",
        articleSummary:
          "Linear raconte comment Chintan Turakhia a poussé l'organisation Base chez Coinbase vers un mode agent-first, jusqu'à demander aux engineers de travailler deux semaines sans IDE et sans écrire directement du code. Le point le plus intéressant n'est pas le geste spectaculaire, mais le diagnostic: les entreprises sont lentes parce que le contexte est dispersé entre têtes, Slack, meetings, tickets et notes. Les humains compensent ce désordre; les agents beaucoup moins. Coinbase traite donc Linear comme une source de vérité pour requirements, designs, bugs, statuts et structure d'équipe. Cela transforme le travail du product engineer: designer les systèmes de contexte pour agents, pas seulement écrire ou déléguer du code. Le cas est évidemment présenté par un fournisseur, mais il illustre très bien le glissement du rôle vers l'architecture de coordination.",
        seniorTakeaway:
          "Un product engineer agent-first doit structurer le contexte de travail autant que le code: sinon l'agent accélère surtout les malentendus.",
        useWhen:
          "Pour discuter source of truth, tickets, specs et workflows quand une organisation veut passer du copilote individuel à l'agent-first.",
      },
      {
        title: "Professional Software Developers Don't Vibe, They Control",
        publisher: "arXiv",
        author: "Ruanqianqian Huang et al.",
        url: "https://arxiv.org/abs/2512.14012",
        date: "2025-12-16",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["product-engineering", "agency", "professional-practice", "agent-control"],
        synthesis:
          "Étude qualitative montrant que les développeurs expérimentés utilisent les agents comme boost, mais conservent le contrôle sur design, qualité et implémentation.",
        articleSummary:
          "Ce papier étudie l'usage réel des agents de code par des développeurs professionnels expérimentés, via observations de terrain et enquêtes qualitatives. Le résultat important est que ces praticiens ne se contentent pas de vibe coder. Ils apprécient le gain de productivité, mais gardent leur agency sur la conception logicielle, les choix d'implémentation et les attributs de qualité. Leur expertise sert à cadrer l'agent, choisir les tâches adaptées, limiter les dérives et vérifier les sorties. Pour le rôle de product engineer, le papier donne un contrepoids empirique aux narratifs trop simples: l'IA ne remplace pas le contrôle professionnel, elle le rend plus important. Les pratiques classiques restent utiles, notamment découpage, tests, lisibilité, validation et jugement sur la qualité. C'est une ressource solide pour expliquer que le product engineer AI-native n'est pas un prompt jockey, mais un opérateur responsable du système de production.",
        seniorTakeaway:
          "Les seniors efficaces ne délèguent pas leur jugement; ils utilisent leur expertise pour contrôler l'agent et choisir où il vaut la peine.",
        useWhen:
          "Pour cadrer les normes d'usage agent dans une équipe qui veut aller vite sans basculer dans le vibe coding non contrôlé.",
      },
      {
        title: "Role and Identity Work of Software Engineering Professionals in the Generative AI Era",
        publisher: "arXiv / CHASE 2026",
        author: "Jorge Melegati",
        url: "https://arxiv.org/abs/2602.18190",
        date: "2026-02-20",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["product-engineering", "identity", "roles", "genai"],
        synthesis:
          "Article CHASE 2026 sur la manière dont l'adoption GenAI change l'identité professionnelle selon les rôles software engineering.",
        articleSummary:
          "Jorge Melegati propose une agenda de recherche sur le role and identity work des professionnels du software engineering à l'ère GenAI. Le papier part d'une idée utile pour les leads: l'adoption de GenAI ne change pas seulement les outils techniques, elle change la manière dont les personnes se définissent au travail. L'auteur insiste sur le fait que les rôles ne réagissent pas tous pareil: développeurs, testeurs, managers ou profils hybrides n'ont pas les mêmes tensions identitaires. Pour l'observatoire, cette ressource aide à ne pas traiter le product engineer comme un simple titre nouveau. C'est aussi un travail d'identité: quelles tâches sont encore 'du vrai engineering', quelles responsabilités passent au produit, comment préserver expertise, autonomie et reconnaissance. Le papier n'apporte pas de playbook opérationnel, mais il donne un cadre sérieux pour discuter adoption IA sans réduire le sujet à productivité.",
        seniorTakeaway:
          "Changer les rôles avec l'IA crée aussi un travail d'identité; ignorer cette dimension ralentit l'adoption ou produit du cynisme.",
        useWhen:
          "Pour préparer une transformation d'équipe qui touche aux responsabilités, titres, progression et attentes de rôle.",
      },
      {
        title: "From Junior to Senior: Allocating Agency and Navigating Professional Growth in Agentic AI-Mediated Software Engineering",
        publisher: "arXiv / CHI 2026",
        author: "Dana Feng, Bhada Yun, April Yi Wang",
        url: "https://arxiv.org/abs/2602.00496",
        date: "2026-02-11",
        kind: "research",
        sourceType: "independent",
        freshness: "recent",
        tags: ["product-engineering", "agency", "mentorship", "career"],
        synthesis:
          "Étude CHI 2026 sur la différence junior/senior dans l'allocation d'agency avec les agents de code.",
        articleSummary:
          "Ce papier compare comment juniors et seniors utilisent les agents dans le travail logiciel et la progression professionnelle. Les auteurs observent que l'agency est souvent contrainte par les politiques organisationnelles, pas seulement par les préférences individuelles. Les seniors gardent le contrôle par une délégation détaillée, tandis que les novices oscillent davantage entre sur-dépendance et évitement prudent. La lecture est importante pour le rôle product engineer parce qu'elle montre que le profil hybride exige des instincts construits avant l'IA: cadrage, suspicion productive, décomposition et mentorship. Si l'équipe pousse trop vite les juniors vers une posture 'mini-PM + agents', elle risque de court-circuiter l'apprentissage du jugement. Pour les leaders, l'article aide à définir des pratiques qui préservent agency, apprentissage et mentoring dans un environnement où les agents deviennent plus autonomes.",
        seniorTakeaway:
          "Le rôle product engineer exige agency et jugement; il faut donc enseigner la délégation aux agents, pas seulement l'usage des outils.",
        useWhen:
          "Pour adapter onboarding, mentoring et attentes de niveau dans une équipe qui utilise des coding agents au quotidien.",
      },
      {
        title: "The Product-Minded Software Engineer",
        publisher: "The Pragmatic Engineer",
        author: "Gergely Orosz",
        url: "https://blog.pragmaticengineer.com/the-product-minded-engineer/",
        date: "2019",
        kind: "community",
        sourceType: "community",
        freshness: "historical",
        tags: ["product-engineering", "product-minded", "durable-concept", "career"],
        synthesis:
          "Référence durable qui formalise les traits du product-minded engineer bien avant la vague actuelle d'agents.",
        articleSummary:
          "Cet article est antérieur à la vague GenAI, mais il reste une base conceptuelle importante. Gergely Orosz décrit les engineers product-minded comme des développeurs qui veulent comprendre pourquoi une décision produit est prise, comment les utilisateurs se comportent et comment mesurer l'impact. Les traits listés restent très actuels: proposer des idées, s'intéresser au business, demander pourquoi, communiquer avec les non-engineers, créer des boucles de validation rapides et suivre les métriques après rollout. L'intérêt aujourd'hui est de rappeler que le product engineer n'est pas né avec Claude Code ou Cursor. L'IA rend cette posture plus visible et plus nécessaire, mais les compétences de fond sont anciennes: curiosité, ownership, contexte utilisateur et capacité à relier craft technique et outcome. À lire comme fondation historique, pas comme guide d'outillage 2026.",
        seniorTakeaway:
          "L'IA accélère une posture qui existait déjà: les meilleurs engineers ne se contentaient pas d'exécuter des specs.",
        useWhen:
          "Pour donner une base durable à un leveling ou à une discussion carrière autour du product-minded engineering.",
      },
      {
        title: "The Product-Minded Engineer",
        publisher: "O'Reilly",
        author: "Drew Hoskins",
        url: "https://www.oreilly.com/library/view/the-product-minded-engineer/9781098173722/",
        date: "2025-11",
        kind: "docs",
        sourceType: "independent",
        freshness: "recent",
        tags: ["product-engineering", "book", "product-thinking", "career"],
        synthesis:
          "Livre O'Reilly récent sur les méthodes qui relient excellence engineering et insight produit.",
        articleSummary:
          "La page O'Reilly présente le livre de Drew Hoskins comme un guide pour combler l'écart entre compétence engineering et insight produit. L'ouvrage s'adresse à un public intermediate to advanced et structure le product thinking autour de scénarios, discovery, priorisation, execution et validation. Même si la page n'est pas un article complet, elle constitue une référence utile parce que le livre date de novembre 2025, au moment où le vocabulaire product-minded engineer redevient central avec l'IA. Le sommaire met l'accent sur les scénarios comme outil pour capturer interviews, frictions, gaps produit et critères de validation. Pour une équipe senior, cela donne une piste concrète: renforcer la capacité à raconter, tester et prioriser des scénarios utilisateur, pas seulement à générer du code. C'est une ressource de fond pour professionnaliser le rôle.",
        seniorTakeaway:
          "Le product engineering demande des techniques de discovery et de validation, pas seulement une attitude générale orientée utilisateur.",
        useWhen:
          "Pour construire une bibliothèque ou un parcours interne de montée en compétence product-minded pour engineers seniors.",
      },
      {
        title: "Product Engineering: The Only Skill That Survives AI",
        publisher: "Sourav Dey",
        author: "Sourav Dey",
        url: "https://souravdey.space/blogs/product-engineers-and-the-ai-era",
        date: "2026-03-30",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["product-engineering", "ai-era", "problem-framing", "career"],
        synthesis:
          "Retour de praticien sur le déplacement de valeur: quand tout le monde peut produire vite, la rareté devient la capacité à choisir le bon problème.",
        articleSummary:
          "Sourav Dey raconte comment sept ans de construction de produits customer-facing l'ont amené à voir le product thinking comme la compétence la plus résistante à l'IA. L'article est moins académique que les autres, mais il met le doigt sur une tension très réelle: l'IA enlève une partie de la friction qui obligeait autrefois à se demander si une feature valait vraiment l'effort. Quand un prototype arrive en vingt minutes, le mauvais problème peut recevoir une solution beaucoup trop vite. L'auteur illustre cela avec un exemple HackerRank: le vrai problème n'était pas un formulaire imparfait, mais l'incapacité des recruteurs à savoir quelles questions techniques choisir. La leçon est simple et utile: les engineers à impact commencent par 'qui a ce problème, comment le résout-il aujourd'hui, comment saura-t-on que c'est mieux?'.",
        seniorTakeaway:
          "Plus l'exécution devient facile, plus la discovery et le cadrage deviennent des compétences différenciantes.",
        useWhen:
          "Pour aider des engineers à passer d'une identité de code writer à une identité de problem owner.",
      },
      {
        title: "What I'm building as an AI Product Engineer in 2026",
        publisher: "PEC Community",
        author: "Boaz",
        url: "https://productengineer.info/community/articles/en/ai-product-engineer-2026-goals",
        date: "2026-03-04",
        kind: "community",
        sourceType: "community",
        freshness: "recent",
        tags: ["product-engineering", "ai-product-engineer", "skills", "workflow-abstraction"],
        synthesis:
          "Témoignage de builder sur le passage de l'écriture de code à la conception de structures et workflows que les agents exécutent.",
        articleSummary:
          "L'article décrit le vécu d'un AI Product Engineer après plusieurs mois de développement intensif avec agents. Son idée centrale est que le rôle se déplace de 'personne qui écrit le code' vers 'personne qui conçoit la structure à partir de laquelle le code sera généré'. Le texte insiste sur l'apprentissage par volume: construire beaucoup de features, apps et systèmes pour voir apparaître les patterns à abstraire. Les skills Claude Code, custom agents et workflows répétables sont présentés comme des abstractions de tâches découvertes par usage répété, pas comme des gadgets. La partie la plus utile est le lien entre gain d'implémentation et retour vers la discovery: observer, empathiser, découvrir, définir, puis abstraire. La ressource est communautaire et subjective, mais elle donne un vocabulaire concret au nouveau rôle: designer les boucles de travail que les agents peuvent exécuter.",
        seniorTakeaway:
          "Le product engineer agentique ne délègue pas seulement du code; il identifie les patterns de travail répétables et les transforme en workflows.",
        useWhen:
          "Pour réfléchir à skills, custom agents et abstractions internes autour de projets produit répétables.",
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
          "Propose un cadre pour évaluer la maturite d'un codebase face au développement assiste par IA: structure, testabilité, documentation, automatisation et lisibilité machine.",
        articleSummary:
          "Le papier propose l'AI Codebase Maturity Model, un modèle en cinq niveaux inspire de CMMI pour faire evoluer un codebase depuis l'assistance ponctuelle jusqu'à des boucles de développement presque auto-entretenues. L'auteur l'ancre dans une expérience de quatre mois sur KubeStellar Console, avec Claude Code, Copilot, une CI/CD dense, des suites de tests nocturnes et une couverture annoncee élevée. La thèse centrale est que la performance d'un système de développement IA ne reside pas seulement dans le modèle, mais dans l'infrastructure autour: instructions, tests, métriques, workflows et feedback loops. Chaque niveau débloque le suivant par l'ajout d'un mecanisme de feedback plus fiable. Le papier insiste notamment sur la testabilité comme investissement majeur: sans tests nombreux, rapides et stables, les agents ne peuvent pas progresser sans surveillance excessive. Pour une équipe, c'est un bon support d'audit: avant de vouloir des agents autonomes, il faut mesurer si le repo est observable, exécutable et compréhensible par machine.",
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
          "Field report de discussions avec CTO, CPO et leaders engineering à San Francisco sur la montee du harness, des AI factories et du rôle de builder.",
        articleSummary:
          "Ce retour de terrain synthétise des conversations avec fondateurs, CTO, CPO et builders rencontrés à San Francisco fin mars 2026. L'auteur clarifie plusieurs termes souvent mélangés: le modèle est la couche d'intelligence, le harness rassemble contexte, outils, runtime, permissions et vérification, l'agent est une boucle outillée, et l'AI factory est le système organisationnel qui transforme l'intention en travail livré. Le texte rapporte un signal fort d'accélération depuis fin 2025, mais le traite comme un indicateur directionnel plutôt qu'une mesure universelle. Il explique que l'avantage ne vient pas seulement de coder plus vite, mais de raccourcir les boucles build-review-ship-learn. Le rapport met aussi en garde contre le vibe coding non structuré pour les contextes où exactitude, répétabilité et régulation comptent. Pour une équipe senior, la lecture sert à séparer hype et operating model: les organisations performantes construisent des harness, des boucles de revue et des pratiques produit autour des agents.",
        seniorTakeaway:
          "Le bottleneck se déplace vers stratégie produit, revue, orchestration et apprentissage organisationnel; la vitesse d'implémentation ne sauve pas une mauvaise direction.",
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
          "Reflexion de praticien sur ce qui reste du métier quand l'IA génère de plus en plus de code: goût, compréhension, debugging, cohérence produit et responsabilité.",
        articleSummary:
          "Josh Comeau revient sur les prédictions de disparition des développeurs et constate que les outils IA ont progressé sans supprimer le besoin de jugement humain. Il distingue code généré et travail logiciel: même quand une part importante du code commité vient d'une IA, un développeur qualifié reste au volant pour cadrer, corriger, intégrer et assumer le résultat. L'article décrit l'agent comme un regulateur de vitesse utile mais dangereux si l'on lâche le volant: les sorties peuvent sembler bonnes tout en dérivant lentement hors des contraintes du projet. Il mobilise aussi des retours terrain et l'étude METR pour montrer l'écart entre sensation de vitesse et productivité mesurée. La partie carrière nuance le marché difficile: les licenciements, la macro et les mythes IA pèsent autant que l'automatisation réelle. Le point important pour seniors est la responsabilité de transmission: utiliser l'IA sans comprendre peut éroder les compétences nécessaires pour réparer les systèmes que l'IA produit.",
        seniorTakeaway:
          "Le craft ne disparait pas; il migre vers la capacité a juger, orienter et corriger des systèmes qui produisent vite.",
        useWhen:
          "Pour alimenter une conversation de carrière senior sans tomber dans le fatalisme ou le hype pur.",
      },
    ],
  },
  {
    id: "context-engineering",
    title: "Context engineering",
    summary:
      "Concevoir ce que l'agent sait, oublie, retrouve et persiste pendant son travail.",
    whyItMatters:
      "La competence rare n'est plus seulement d'écrire le bon prompt, mais de concevoir un système de contexte qui tient sur des tâches longues.",
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
          "Formalise le passage du prompt engineering vers la gestion du contexte complet: instructions, outils, historique, fichiers, mémoire, compaction et recherche just-in-time.",
        articleSummary:
          "Anthropic explique que le prompt engineering ne suffit plus pour les agents capables de travailler sur plusieurs tours et avec des outils. Le vrai problème devient de choisir quels tokens doivent être présents au moment de l'inférence: instructions système, exemples, descriptions d'outils, historique, résultats de recherche, fichiers, notes et mémoire. L'article insiste sur le fait que le contexte est une ressource finie: plus on ajoute de contenu, plus l'attention du modèle se dilue et plus le risque de confusion augmente. Les bons agents utilisent donc du contexte minimal mais riche, chargé au bon moment. Anthropic décrit aussi le just-in-time retrieval, où l'agent conserve des références légères puis va chercher les données pertinentes par outils, au lieu de tout injecter en amont. Pour les tâches longues, l'article met en avant la compaction, les notes structurées et les architectures multi-agents comme moyens de garder la cohérence. C'est une lecture centrale pour penser AGENTS.md, CLAUDE.md, skills, retrieval et mémoire comme une architecture, pas comme une collection de prompts.",
        seniorTakeaway:
          "Traite le contexte comme une ressource finie: moins de tokens, plus de signal, et des outils qui permettent à l'agent de charger ce dont il a besoin au bon moment.",
        useWhen:
          "Pour concevoir AGENTS.md, CLAUDE.md, skills, notes persistantes, compaction ou stratégie de retrieval dans un gros repo.",
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
          "Guide opérationnel sur l'exploration d'un codebase, la planification, les permissions, les sous-agents, la gestion agressive du contexte et les sessions parallèles.",
        articleSummary:
          "La documentation Claude Code rassemble des pratiques très concrètes pour utiliser un agent CLI dans un vrai repo. Elle recommande de commencer par laisser l'agent explorer le codebase, lire les conventions et proposer un plan avant de modifier des fichiers. Le guide insiste sur la qualité des instructions locales: fichiers de contexte, commandes de test, conventions de style, contraintes de sécurité et attentes de revue doivent être visibles pour l'agent. Il couvre aussi les permissions, l'usage des sous-agents, les sessions parallèles et la gestion du contexte quand une conversation devient longue. Le point fort est l'approche workflow: demander des petites étapes vérifiables, faire lancer les tests, relire les diffs et recadrer rapidement. La documentation rappelle qu'un agent performant reste dépendant de son environnement: scripts fiables, setup reproductible et feedback humain. Pour une équipe, c'est une base pour transformer une utilisation individuelle de Claude Code en discipline collective.",
        seniorTakeaway:
          "Les agents productifs ressemblent à des juniors très rapides: ils ont besoin d'environnement, de vérification et de recadrage tôt, pas seulement d'une demande vague.",
        useWhen:
          "Pour définir les pratiques quotidiennes d'une équipe qui utilise Claude Code ou un agent CLI comparable.",
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
          "Anthropic présente les Agent Skills comme des paquets de capacités que l'agent peut charger à la demande. Une skill combine des instructions, des scripts, des fichiers de référence et parfois des ressources annexes dans une structure réutilisable. L'idée clé est la progressive disclosure: au lieu de saturer le contexte avec toutes les procédures possibles, l'agent identifie la skill pertinente puis charge seulement ce qui est nécessaire. L'article positionne les skills comme un moyen de rendre les agents plus utiles dans le monde réel, où les tâches exigent des pratiques locales, des formats précis et des outils spécifiques. Le contenu d'une bonne skill ressemble moins à un tutoriel exhaustif qu'à une procédure exécutable avec exemples et contraintes. Pour une organisation, cela permet de transformer du savoir tacite en routines partagées: release, QA, documents, présentations, migrations, design review ou opérations. Le message senior est qu'une skill est une interface de connaissance maintenable entre l'équipe et ses agents.",
        seniorTakeaway:
          "Les skills transforment le savoir d'équipe en capacités réutilisables; c'est une forme d'onboarding exécutable pour agents.",
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
          "Montre l'intérêt de rapprocher les agents des outils d'exécution et de standardiser les interfaces via MCP.",
        articleSummary:
          "L'article explique pourquoi le simple appel d'API depuis un modèle ne suffit pas pour construire des agents efficaces. Anthropic montre que donner à l'agent un environnement d'exécution proche du travail réel lui permet de tester, inspecter, transformer et vérifier au lieu de seulement raisonner sur du texte. MCP sert ici de contrat standardise entre l'agent et ses outils: fichiers, commandes, bases de données, services internes ou environnements spécialisés. Le texte insiste sur le coût du contexte: une bonne interface outil doit renvoyer des résultats exploitables, pas des dumps bruts qui saturent la fenêtre. Il met aussi en avant la séparation entre le modèle, le runtime et les outils, ce qui rend le système plus composable et plus gouvernable. Pour une équipe plateforme, la question devient: quelles opérations exposer, avec quelles permissions, quelles erreurs et quelles sorties? L'intérêt est de concevoir les outils internes comme des APIs pour agents autant que pour humains.",
        seniorTakeaway:
          "Un bon agent est autant une question de contrats d'outils que de modèle: le design de l'interface outil determine beaucoup de fiabilité.",
        useWhen:
          "Pour connecter des outils internes, environnements de build, bases documentaires ou actions métier à un agent.",
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
          "Cursor explique pourquoi les agents ont encore besoin de recherche texte ultra-rapide, notamment dans les monorepos où ripgrep devient un goulot.",
        articleSummary:
          "Cursor part d'un constat simple: malgré les index sémantiques et les LSP, les agents utilisent encore massivement grep et les recherches regex. Certaines questions ne se résolvent pas par recherche vectorielle: il faut trouver un identifiant exact, un pattern, une chaîne de configuration ou une signature précise. Dans les grands monorepos, ripgrep reste très bon mais doit scanner beaucoup de fichiers, ce qui peut ralentir l'agent et casser l'interaction. L'article explique les bases des index inverses, des trigrams et de la décomposition regex pour prefiltrer les fichiers candidats avant la recherche classique. Le point important est que la recherche texte devient une primitive agentique, pas un outil legacy. Les agents ont besoin de retrouver rapidement du contexte frais, local et exact, en complément des outils sémantiques. Pour les équipes qui construisent une plateforme de dev IA, l'article montre que l'infrastructure de recherche bas niveau influence directement la qualité du raisonnement agent.",
        seniorTakeaway:
          "Le contexte n'est pas seulement sémantique: les recherches exactes, fraîches et locales restent critiques pour éviter les errances coûteuses.",
        useWhen:
          "Pour réfléchir à l'outillage des agents dans un grand codebase ou une plateforme interne.",
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
          "Montre comment réduire la friction IA en rendant les connaissances implicites disponibles avant que l'agent ne tente de resoudre le problème.",
        articleSummary:
          "L'article présente le knowledge priming comme une forme de RAG manuel: fournir au modèle, avant le travail, le contexte spécifique qui doit dominer les patterns génériques appris sur Internet. Rahul Garg part d'un problème familier: un assistant peut produire du code syntaxiquement correct mais faux pour le codebase, parce qu'il ignore Fastify vs Express, les conventions de services, la gestion des cookies où les choix d'architecture locaux. Il compare l'agent à un nouveau membre d'équipe: competent, mais inutilisable sans onboarding. Le texte propose une hiérarchie du savoir où les priming documents passent devant la conversation courante et les données d'entraînement. Il décrit ensuite le contenu utile d'un document de priming: architecture, versions, sources de connaissance, structure projet, conventions de nommage, exemples et anti-patterns. Le message opérationnel est fort: le contexte ne doit pas dépendre d'un copier-coller ad hoc, mais devenir une infrastructure versionnée, maintenue et relue.",
        seniorTakeaway:
          "Le contexte utile n'est pas seulement dans le repo: décisions passées, vocabulaire métier et contraintes locales doivent devenir consultables.",
        useWhen:
          "Pour transformer des docs d'équipe, ADR et notes produit en contexte exploitable par agents.",
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
          "Analyse comment les outils de spec-driven development changent le point de départ du travail IA: la spec devient un artefact actif qui pilote génération et vérification.",
        articleSummary:
          "Birgitta Bockeler compare trois approches de spec-driven development: Kiro, GitHub spec-kit et Tessl. L'article commence par une réserve importante: évaluer ces outils sérieusement est coûteux, surtout en brownfield, car il faut tester plusieurs tailles de problèmes et relire les artefacts intermédiaires avec attention. Kiro est présentée comme le plus léger, avec un flux requirements, design, tasks et des fichiers markdown simples. Spec-kit ajoute une constitution, des templates, des checklists et une topologie de fichiers plus riche, ce qui le rend personnalisable mais potentiellement verbeux. Tessl pousse davantage l'idée de synchronisation entre spécification et code. Les observations finales sont les plus utiles: le SDD n'est pas une pratique unique, les workflows peuvent être surdimensionnés pour de petits changements, relire beaucoup de markdown peut être moins efficace que relire du code, et les agents peuvent ignorer ou sur-appliquer les consignes. La valeur senior est donc de calibrer la granularité et de garder des boucles itératives.",
        seniorTakeaway:
          "Plus les agents codent vite, plus la qualité de la spécification devient un multiplicateur ou un point de casse.",
        useWhen:
          "Pour expliquer pourquoi ce projet utilise Spec Kit comme couche métier et pas seulement comme documentation.",
      },
    ],
  },
  {
    id: "agentic-coding",
    title: "Agentic coding & cloud agents",
    summary:
      "Déléguer du travail de dev à des agents qui lisent, modifient, testent et ouvrent des PR.",
    whyItMatters:
      "Le métier glisse du code ligne à ligne vers la décomposition, l'orchestration, la revue et l'amélioration des environnements.",
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
          "Retour d'expérience OpenAI sur un produit interne construit avec 0 ligne de code manuel, où les humains pilotent l'environnement, les specs, les boucles de feedback et la lisibilité agent.",
        articleSummary:
          "OpenAI décrit le harness engineering comme le travail qui rend les agents vraiment productifs: environnement, instructions, tests, conventions, feedback et lisibilité future. Le cas raconte un produit interne construit sans ecriture manuelle directe de code, mais pas sans engineering: les humains cadrent le problème, preparrent les specs, améliorent le repo et vérifient les résultats. L'article montre que le levier n'est pas seulement le modèle, mais tout ce qui l'entoure. Un codebase àgent-friendly doit être facile a explorer, tester, modifier et comprendre par un agent qui arrive sans mémoire locale. Les auteurs insistent aussi sur la boucle de feedback: chaque run doit laisser des traces et des apprentissages pour le prochain. Le rôle humain se déplace donc vers la conception du système de production de code. Pour des leads, c'est une lecture utile pour expliquer pourquoi CI, tests, structure repo et instructions sont des accelerateurs IA, pas de la bureaucratie.",
        seniorTakeaway:
          "Le levier se déplace vers le harness: templates, CI, conventions, instructions repo, tests et lisibilité future pour agents.",
        useWhen:
          "Pour comprendre ce qui change dans le rôle d'un staff/tech lead quand plusieurs agents produisent le code.",
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
          "Positionne Codex comme un centre de commande pour gérer plusieurs agents, threads, worktrees, diffs et tâches longues.",
        articleSummary:
          "L'annonce présente l'application Codex comme une interface pour piloter plusieurs agents de développement plutôt qu'un simple assistant de chat. Le produit organise des threads de travail, des diffs, des environnements et des tâches parallèles afin qu'un développeur puisse déléguer, suivre et revoir plusieurs chantiers. L'intérêt est de rendre visible le travail asynchrone: l'agent peut explorer, modifier, tester et revenir avec un résultat inspectable. L'article marque un changement d'ergonomie: l'outil de développement devient un tableau de supervision où l'humain gère des travaux en cours, pas seulement un éditeur de fichiers. Cela implique aussi de nouvelles pratiques: bien nommer les tâches, isoler les worktrees, comparer les propositions et garder une discipline de revue. Pour une équipe senior, la question n'est pas seulement d'adopter Codex, mais de définir comment ce mode multi-agent s'insère dans Git, CI, review et priorisation.",
        seniorTakeaway:
          "L'IDE n'est plus seulement un éditeur: il devient un poste de supervision de travaux parallèles.",
        useWhen:
          "Pour évaluer comment organiser le travail multi-agent en local et dans le cloud.",
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
          "Expose l'extension de Codex au-delà du code: navigateur intégré, computer use, plugins, mémoire et automations qui reprennent du contexte dans le temps.",
        articleSummary:
          "OpenAI présente Codex comme un agent de travail plus large que le coding pur. L'article met en avant le navigateur intégré, l'usage de l'ordinateur, les plugins, la mémoire et les automations capables de reprendre du contexte dans le temps. Cela déplace Codex vers des workflows où l'agent peut vérifier une UI, naviguer dans des outils, préparer des documents, suivre des PRs ou exécuter des tâches récurrentes. Le signal important est l'extension de la surface d'action: l'agent n'est plus limité au repo, il peut traverser plusieurs applications de la chaîne logicielle. Cette puissance augmente aussi le besoin de cadrage: permissions, traces, critères de succès et limites de responsabilité doivent être explicites. Pour des seniors, la ressource sert à anticiper la convergence entre coding agents, browser agents et assistants d'opérations. Les équipes devront penser l'agent comme participant au cycle de vie logiciel complet, pas comme générateur de fonctions.",
        seniorTakeaway:
          "Les agents de dev deviennent des agents de cycle de vie logiciel: design, vérification UI, docs, suivi de PR et tâches récurrentes.",
        useWhen:
          "Pour suivre l'état actuel des capacités Codex en avril 2026.",
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
          "Cursor décrit le passage de l'autocomplete aux agents synchrones, puis aux agents cloud autonomes sur des tâches plus longues avec artefacts de revue.",
        articleSummary:
          "Cursor propose une lecture en trois périodes de l'IA pour développeurs. La première est l'autocomplete, utile pour les tâches répétitives et locales. La deuxième est celle des agents synchrones, où le développeur dialogue avec un assistant capable de modifier plusieurs fichiers et d'utiliser des outils. La troisième, selon Cursor, est celle des agents cloud qui travaillent plus longtemps, sur leurs propres machines, puis reviennent avec des artefacts de revue: logs, previews, enregistrements, résultats de tests. L'article explique que cela change le rôle humain: moins guider chaque action, davantage définir le problème, fournir les outils et évaluer le résultat. Cursor partage aussi son usage interne, avec une part importante de PRs créées par des agents autonomes. Le texte reste promotionnel, mais utile comme signal de direction produit. Pour une équipe, il force à penser l'environnement, les artefacts de revue et la parallélisation avant de multiplier les agents.",
        seniorTakeaway:
          "La valeur senior devient de définir le problème et les critères de revue plutôt que de surveiller chaque action.",
        useWhen:
          "Pour expliquer à une équipe pourquoi les workflows agents ne sont pas juste une version plus rapide de l'autocomplete.",
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
          "Annonce les agents cloud self-hosted: les executions restent dans l'infrastructure client tandis que Cursor orchestre l'expérience.",
        articleSummary:
          "Cursor annonce une option pour faire tourner les agents cloud dans l'infrastructure du client. Le problème vise est typiquement enterprise: les agents distants sont attractifs pour la parallélisation et les tâches longues, mais ils posent des questions de sécurité, secrets, accès réseau, données internes et conformité. Le modèle self-hosted sépare l'orchestration produit de l'exécution: Cursor fournit l'expérience utilisateur, tandis que le code et les runs restent dans un environnement contrôle par l'organisation. L'article est important parce qu'il montre que l'adoption agentique ne se joue pas seulement dans l'IDE ou le modèle. Elle dépend du runtime, des politiques d'accès, du réseau, de la reproductibilité et de l'audit. Pour les grandes organisations, c'est le type de fonctionnalité qui rend possible un passage de pilote individuel à usage équipe. Le bon sujet de discussion est l'architecture de confiance, pas seulement la qualité des suggestions.",
        seniorTakeaway:
          "Pour les entreprises, l'adoption agentique dépend souvent plus de l'environnement, des secrets et de la conformité que du modèle.",
        useWhen:
          "Pour discuter architecture d'adoption dans une organisation régulée ou gros monorepo interne.",
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
          "Documente les agents asynchrones Cursor: environnements distants, snapshots, commandes d'installation, terminaux, branches et risques de sécurité.",
        articleSummary:
          "La documentation des Background Agents de Cursor décrit comment lancer des agents asynchrones dans des environnements distants. Elle couvre les prérequis pratiques: création d'environnement, installation des dépendances, commandes de setup, snapshots, accès au terminal, branches et intégration GitHub. Le point important est que l'agent travaille dans un espace sépare du poste local, ce qui permet de déléguer des tâches sans bloquer l'utilisateur. Mais cette autonomie introduit des risques: permissions, secrets, accès réseau, dépendances non reproductibles et erreurs de branche peuvent transformer un run utile en dette de revue. La documentation rend visible le fait qu'un background agent est un système d'exécution, pas une simple conversation. Pour une équipe, elle sert de checklist pour préparer un repo: setup deterministic, scripts fiables, CI, politiques d'accès et conventions de délégation. Sans cela, l'agent asynchrone risque surtout de produire des PRs difficiles à comprendre.",
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
          "Cadre durable pour concevoir des workflows agents simples: commencer par des patterns contrôles avant de complexifier l'autonomie.",
        articleSummary:
          "Anthropic propose un cadre pragmatique pour construire des systèmes agentiques sans commencer par l'autonomie maximale. L'article distingue les workflows, où le LLM et les outils suivent des chemins de code prédéterminés, des agents, où le modèle décide dynamiquement quelles actions mener. Le conseil central est de partir de la solution la plus simple possible: souvent un appel LLM enrichi par retrieval ou exemples suffit. Quand la complexité est justifiée, les workflows apportent prédictibilité pour des tâches bien définies, tandis que les agents conviennent mieux aux problèmes ouverts qui exigent adaptation et usage d'outils. Anthropic met aussi en garde contre les frameworks qui cachent prompts, réponses et erreurs sous trop d'abstraction. Le reste de l'article décompose des patterns utiles comme prompt chaining, routing, parallélisation, orchestrator-workers et evaluator-optimizer. Pour une équipe, c'est une grille de décision: ajouter de l'autonomie seulement quand le gain compense latence, coût et débuggage plus difficile.",
        seniorTakeaway:
          "La bonne architecture agentique est souvent sobre: workflow explicite, outils clairs, observation et escalation humaine avant autonomie totale.",
        useWhen:
          "Pour éviter de surconcevoir un système multi-agent alors qu'un workflow outillé suffit.",
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
          "Handbook pratique pour appliquer les agents a tout le cycle de vie logiciel: idéation, specs, code, tests, review, release et opérations.",
        articleSummary:
          "Ce handbook propose une méthodologie complète pour passer d'une adoption opportuniste des assistants IA à un SDLC pensé pour les agents. Il s'adresse à la fois aux leaders, qui doivent raisonner stratégie, gouvernance, business case et structures d'équipe, et aux praticiens, qui cherchent des techniques concrètes pour spécifier, instrumenter, orchestrer et vérifier. Le cœur du livre est le framework PROSE, présenté comme un ensemble de contraintes architecturales pour rendre les sorties d'agents fiables, vérifiables et maintenables. Le texte couvre l'instrumentation du codebase, la spécification, le context engineering, l'orchestration multi-agent, le meta-process d'exécution et les anti-patterns. Il inclut aussi des case studies tirés de projets réels et assume que la méthode elle-même a servi à produire le handbook. Pour une équipe senior, ce n'est pas un tutoriel d'outil: c'est une cartographie des changements de process nécessaires quand l'IA touche tout le cycle de livraison.",
        seniorTakeaway:
          "Le sujet n'est pas l'outil de coding isole, mais la reconfiguration du SDLC autour de points de contrôle humains.",
        useWhen:
          "Pour structurer une roadmap d'adoption IA dans une équipe produit/engineering.",
      },
    ],
  },
  {
    id: "team-process",
    title: "Travail d'équipe & operating model",
    summary:
      "Comment les agents entrent dans les tickets, PR, reviews, specs, Slack et responsabilites humaines.",
    whyItMatters:
      "L'IA change moins les ceremonies que les flux de responsabilité: qui délègue, qui valide, qui garde le contexte et qui reste accountable.",
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
          "Principes pour intégrer les agents comme acteurs visibles dans les workflows: identité claire, état transparent, feedback immediat et responsabilité humaine finale.",
        articleSummary:
          "Les Agent Interaction Guidelines de Linear formalisent comment un agent doit apparaître dans un outil de travail collaboratif. Le document insiste sur l'identité explicite de l'agent: les humains doivent savoir quand ils interagissent avec une personne, une intégration ou un agent autonome. Les recommandations couvrent aussi l'état du travail, les feedbacks de progression, les erreurs et la responsabilité finale. Un agent utile ne doit pas disparaître dans un chat latéral; il doit être représentable dans les tickets, mentions, assignations, commentaires et historiques. La valeur de ces guidelines est de traiter l'agent comme un acteur de workflow soumis aux mêmes besoins de lisibilité que les humains: qui fait quoi, pourquoi, avec quel niveau de confiance et sous quelle supervision. Pour une équipe produit, c'est une ressource UX autant qu'architecture. Elle aide à éviter les agents magiques mais opaques qui créent de la confusion organisationnelle.",
        seniorTakeaway:
          "Un agent ne doit pas être un acteur invisible: l'interface doit rendre délégation, état et accountability impossibles a confondre.",
        useWhen:
          "Pour designer une intégration agent dans Linear, Jira, GitHub, Slack ou un outil interne.",
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
          "Cas concret: un email client devient issue, triage, contexte produit, délégation à un coding agent, PR revue humainement, puis boucle de retour client.",
        articleSummary:
          "Linear montre trois workflows internes où l'agent relie support, produit et engineering. Le premier transforme un email client en issue contextualisée, puis en triage, analyse de demandes similaires, délégation à un coding agent, PR revue par un humain et retour client. Le deuxième part d'un thread Slack ambigu et utilise l'agent pour ramener du contexte produit, créer ou mettre à jour une issue, puis notifier le canal quand le bug est corrigé. Le troisième montre un PM qui remarque un manque produit, crée une issue et fait générer une première PR. L'article est fort parce qu'il ne vend pas seulement un agent qui code; il montre une boucle complète de travail, de la voix client jusqu'au follow-up. Linear insiste aussi sur l'autonomie progressive: commencer par suggestions et petits pas, puis déléguer davantage quand la fiabilité est prouvée. Pour une équipe senior, c'est un exemple concret d'operating model agentique.",
        seniorTakeaway:
          "Le workflow fort n'est pas 'agent écrit du code', mais 'contexte client -> décision produit -> implémentation -> feedback loop'.",
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
          "Explique les agents comme app users: assignation, mentions, guidance d'organisation, vues de suivi et responsabilité humaine conservee.",
        articleSummary:
          "La documentation Linear explique comment les agents deviennent des utilisateurs applicatifs dans le système de travail. Ils peuvent être assignés, mentionnés, suivre des issues, agir dans des workflows et recevoir de la guidance d'organisation. Le point important est la normalisation: l'agent n'est pas une boîte noire externe, il apparait dans les mêmes objets que les humains et laisse des traces dans l'historique. Linear conserve cependant la responsabilité humaine: l'agent exécute ou propose, mais les équipes doivent garder un propriétaire clair pour les décisions et la validation. La documentation couvre aussi les conventions d'usage qui rendent la délégation praticable: quand mentionner l'agent, comment cadrer une demande, comment suivre l'état et comment relier son travail aux issues. Pour les leads, c'est un modèle d'intégration socio-technique: les agents doivent entrer dans le système de coordination existant, pas créer un second workflow parallèle.",
        seniorTakeaway:
          "La délégation à un agent doit être observable dans le système de travail, pas cachee dans un chat sépare.",
        useWhen:
          "Pour définir les conventions d'assignation, de suivi et de guidance d'équipe.",
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
          "Linear introduit un agent intégré au produit, des skills réutilisables, automations de triage et code intelligence.",
        articleSummary:
          "Le changelog présente Linear Agent comme une évolution native de l'outil de product development. L'agent peut aider à créer, trier, enrichir ou manipuler des issues et projets dans Linear, en s'appuyant sur le contexte du workspace. La ressource mentionne les skills réutilisables, les automatisations de triage et la code intelligence comme briques pour relier intention produit et exécution. L'intérêt n'est pas seulement une fonctionnalité d'IA dans l'interface: Linear positionne l'agent comme une couche d'orchestration qui vit dans le flux de travail. Cela permet de transformer des demandes floues, feedbacks ou discussions en artefacts plus exploitables. Pour une équipe senior, le point à retenir est la direction prise par les outils de planning: ils deviennent des lieux où des agents lisent le contexte, proposent des actions et déclenchent du travail dans d'autres systèmes. Il faut donc penser droits, audit, conventions et responsabilité.",
        seniorTakeaway:
          "Les outils de product development deviennent eux-mêmes des surfaces d'orchestration d'agents.",
        useWhen:
          "Pour suivre l'évolution des outils de planning vers des systèmes agents natifs.",
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
          "Lancement du modèle où les agents deviennent des utilisateurs applicatifs assignables et mentionnables comme des teammates.",
        articleSummary:
          "Linear for Agents introduit l'idée que les agents doivent être traités comme des coequipiers applicatifs, avec identité, assignation, mentions et participation aux workflows. Le changelog signale un passage important: au lieu de rester dans des interfaces de chat separees, les agents peuvent interagir avec les issues, commentaires et objets de travail de Linear. Cela rend leur contribution plus visible et plus gouvernable. La ressource sert aussi de signal produit: les outils de gestion du travail s'adaptent aux agents en leur donnant des primitives sociales et opérationnelles proches de celles des humains. Pour une organisation, cela pose les bonnes questions: comment nommer les agents, quels droits leur donner, qui approuve leurs actions, comment éviter les doublons et comment conserver l'audit trail. C'est une brique de design de workflow plus qu'une simple intégration API.",
        seniorTakeaway:
          "Le 'travail avec IA' devient un problème de système socio-technique: statuts, profils, droits et audit trail.",
        useWhen:
          "Pour concevoir une plateforme interne où un agent est acteur explicite du workflow.",
      },
    ],
  },
  {
    id: "evals-quality",
    title: "Evals, qualité & revue",
    summary:
      "Mesurer les agents sur des tâches réelles, pas seulement sur des benchmarks flatteurs.",
    whyItMatters:
      "Quand la production de code augmente, la contrainte se déplace vers la vérification, la revue, les tests et la confiance.",
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
          "Cursor décrit un processus hybride d'evals offline et online pour garder les mesurés alignees avec les vrais usages développeurs.",
        articleSummary:
          "Cursor explique pourquoi les benchmarks publics deviennent insuffisants pour comparer des agents de code. Les tâches réelles sont longues, ambiguës, multi-fichiers et dépendantes du contexte produit, alors que beaucoup de benchmarks restent centrés sur des bugs publics ou des problèmes trop fermés. CursorBench est leur suite interne d'evals construite à partir de vraies sessions Cursor, avec des dimensions comme correction, qualité de code, efficience et comportement interactif. L'article insiste sur la séparation entre evals offline et evals online: une suite interne peut classer les modèles, mais les expériences en production capturent les régressions de ressenti et d'usage. Il pointe aussi les problèmes de contamination, d'underspecification et de saturation des benchmarks publics. Pour une équipe senior, c'est un modèle de programme d'évaluation: partir des vrais workflows, mesurer plusieurs axes, et relier les scores à des signaux produit. Évaluer un agent, ce n'est pas seulement vérifier une solution finale.",
        seniorTakeaway:
          "Les benchmarks publics ne suffisent pas: il faut mesurer correction, qualité, efficience et comportement interactif dans son contexte.",
        useWhen:
          "Pour créer un programme d'évaluation interne des modèles et agents.",
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
          "Cadre pour penser les evals agents: objectifs, traces, critères de succès et ecarts entre démos et fiabilité.",
        articleSummary:
          "Anthropic propose une méthode pour construire des evals d'agents au-delà des démos impressionnantes. L'article recommande de définir clairement le comportement attendu, les critères de succès et les types d'erreurs à capturer. Pour les agents, l'évaluation ne peut pas se limiter à la sortie finale: il faut regarder les traces, les appels outils, les décisions intermédiaires, les récupérations d'erreur et la capacité à terminer une tâche sans dériver. Le texte insiste aussi sur l'importance d'evals proches des usages réels, car un agent peut bien performer sur des cas synthétiques et échouer dans l'environnement de production. Les evals doivent donc être itératives: partir d'erreurs observées, les transformer en cas reproductibles, puis suivre les régressions. Pour les équipes, la leçon est de construire une boucle d'apprentissage, pas un score unique. C'est particulièrement utile avant d'autoriser un agent à toucher à du code critique ou à des données sensibles.",
        seniorTakeaway:
          "Les evals doivent capturer le workflow et les erreurs observées, pas seulement une sortie finale jolie.",
        useWhen:
          "Pour formaliser des gates avant de laisser un agent toucher àu code critique.",
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
          "Analyse comment l'environnement d'exécution, les tests et l'infrastructure peuvent polluer l'interpretation des performances agents.",
        articleSummary:
          "Anthropic montre que les evals de coding agents mesurent souvent autant l'infrastructure que le modèle. Un agent peut échouer à cause d'un environnement mal préparé, de dépendances instables, de tests flaky, de réseau indisponible ou d'erreurs CI non liées à la qualité de sa solution. L'article explique que ce bruit fausse la comparaison entre modèles et peut pousser une équipe à optimiser le mauvais problème. Pour fiabiliser une évaluation, il faut contrôler le setup, isoler les causes d'échec, rendre les runs reproductibles et collecter des traces suffisantes. Le texte rappelle aussi que les agents interagissent avec des systèmes complexes: shell, package managers, tests, fichiers, services externes. Chaque couche peut introduire de la variance. Pour des leads, c'est une mise en garde importante: avant de conclure qu'un agent est mauvais, il faut vérifier que le harness d'évaluation est sain. Sinon la mesure devient un miroir de la dette d'infrastructure.",
        seniorTakeaway:
          "Une eval agent mesure aussi ton harness. Si l'environnement est flaky, tu mesurés le bruit autant que le modèle.",
        useWhen:
          "Pour fiabiliser une suite de benchmarks internes ou une CI pilotée par agents.",
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
          "GitHub ajoute des validations sécurité et qualité automatiques sur le code généré par Copilot coding agent.",
        articleSummary:
          "Le changelog GitHub annonce que Copilot coding agent valide automatiquement certains aspects de sécurité et de qualité du code qu'il produit. La ressource est courte, mais importante comme signal de plateforme: les fournisseurs integrent des garde-fous directement dans les workflows agentiques, car les PRs generees par agents augmentent le volume a relire. L'idée est de détecter plus tôt des problèmes qui ne devraient pas dépendre uniquement d'une revue humaine manuelle. Cela s'inscrit dans une tendance plus large: les agents de code doivent arriver avec tests, scans, checks et explications, pas seulement un diff. Pour une équipe, le point à retenir est que la revue humaine ne disparait pas, mais doit être completee par des validations automatiques specialisees. La question devient alors de comparer ce que la plateforme fournit par défaut avec les contrôles internes: SAST, dépendances, politiques de repo, tests et quality gates.",
        seniorTakeaway:
          "Les plateformes commencent à intégrer des garde-fous automatiques parce que la revue humaine seule ne scale pas.",
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
          "Etude empirique de 33k PRs agent-authored pour comprendre les facteurs de merge, CI, review et échecs.",
        articleSummary:
          "Ce papier étudie 33 000 pull requests produites par cinq agents de code sur GitHub afin de comprendre pourquoi certaines sont mergées et d'autres non. Les auteurs comparent les résultats selon les types de tâches, les changements de code, les résultats CI et les dynamiques de review. Les tâches de documentation, CI et build updates semblent mieux réussir, alors que les tâches de performance et bug fix sont plus difficiles. Les PRs non mergées tendent à toucher plus de fichiers, contenir des changements plus larges et échouer davantage en CI. L'analyse qualitative de 600 PRs fait ressortir des motifs que les métriques brutes ne capturent pas: manque d'engagement reviewer, doublons, features non désirées ou mauvais alignement avec l'intention du projet. Le papier montre donc que l'échec agentique est socio-technique. Pour une équipe senior, il aide à définir quelles tâches déléguer, comment limiter la taille des PRs et quels signaux de review surveiller.",
        seniorTakeaway:
          "Les agents échouent dans des dynamiques socio-techniques, pas seulement par mauvaise génération de code.",
        useWhen:
          "Pour argumenter sur les risques de revue, CI et intégration de PRs agents.",
      },
    ],
  },
  {
    id: "long-running-multi-agent",
    title: "Taches longues & multi-agents",
    summary:
      "Faire progresser plusieurs agents sur des travaux qui dépassent une fenêtre de contexte.",
    whyItMatters:
      "Les gains majeurs viennent de travaux longs, parallèles et vérifiables, mais ils exigent structure, locks, logs et état persistant.",
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
          "Propose un pattern initializer agent + coding agent pour laisser un état propre, incrementer et documenter le travail entre sessions.",
        articleSummary:
          "Anthropic analyse pourquoi les agents ont encore du mal avec des tâches qui dépassent une fenêtre de contexte. Même avec compaction, un agent peut essayer de tout faire d'un coup, laisser un chantier incomplet, puis repartir dans une nouvelle session sans comprendre l'état précédent. L'article propose un harness en deux rôles: un initializer agent prépare l'environnement, les scripts et les artefacts de suivi; les coding agents suivants font des progrès incrémentaux et laissent un état propre. Le fichier de progression et l'historique Git deviennent des mécanismes de passage de relais. Le texte emprunte explicitement aux pratiques humaines: travailler par incréments, documenter ce qui a été fait, laisser un repo mergable et préparer le prochain intervenant. Pour une équipe, c'est une référence utile pour migrations, refontes et projets longs. Le message est clair: l'autonomie longue n'est pas magique, elle exige protocole, checkpoints et hygiène de repo.",
        seniorTakeaway:
          "La tâche longue exige un protocole de passage de relais. Sans journal, checkpoints et objectifs incrementaux, l'agent recommence ou déclare victoire trop tôt.",
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
          "Experience de 16 agents construisant un compilateur C en Rust, avec locks de tâches, conteneurs, tests et synchronisation Git.",
        articleSummary:
          "Anthropic raconte une expérience où seize instances de Claude travaillent en parallèle pour construire un compilateur C en Rust. L'article est moins intéressant pour le compilateur lui-même que pour le système de coordination: décomposition des tâches, locks, conteneurs, tests, synchronisation Git et arbitrage humain. Le projet montre que le multi-agent peut produire du travail substantiel quand les frontières sont claires et que les conflits sont gérés explicitement. Il montre aussi les limites: plus il y a d'agents, plus le coût d'intégration, de coordination et de vérification augmente. Les agents doivent pouvoir savoir quoi prendre, quoi ne pas toucher et comment valider leur contribution. Pour une équipe senior, c'est une expérience de laboratoire qui donne des principes pratiques: découper finement, isoler les environnements, rendre les tests rapides et définir des artefacts de synchronisation simples. Le multi-agent est un problème d'architecture de travail autant que de modèle.",
        seniorTakeaway:
          "Le multi-agent n'est utile que si le travail est decomposable, testable et synchronise par des artefacts simples.",
        useWhen:
          "Pour réfléchir à la parallélisation d'un gros chantier technique.",
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
          "Decrit une architecture de recherche multi-agent avec un orchestrateur qui distribue des sous-tâches et synthétise les retours.",
        articleSummary:
          "Anthropic décrit son système de recherche multi-agent, construit autour d'un orchestrateur qui décompose une question, lance des agents travailleurs et consolide leurs résultats. L'article montre pourquoi un seul agent peut manquer de largeur d'exploration sur des problèmes complexes: chaque sous-agent peut poursuivre une piste, accumuler du contexte spécialisé et produire un retour plus ciblé. L'orchestrateur sert à définir les sous-tâches, éviter les doublons, combiner les évidences et produire une synthèse finale. La ressource insiste aussi sur les coûts: les systèmes multi-agents consomment plus de tokens et demandent des tâches qui justifient cette dépense. Le pattern est particulièrement adapté à la recherche ouverte, la veille, l'investigation technique et certains diagnostics codebase. Pour une équipe, c'est un modèle durable d'orchestration: séparer exploration, synthèse et vérification, plutôt que faire porter toute la charge cognitive à une seule conversation longue.",
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
          "Article récent signale par Cognition sur les patterns multi-agents qui marchent dans la pratique de Devin.",
        articleSummary:
          "La page Cognition référence un article récent intitulé Multi-Agents: What's Actually Working, publié dans le contexte de Devin et des cloud agents. Même si la page catalogue expose peu de contenu détaillé, le signal est utile: Cognition met explicitement en avant les apprentissages pratiques autour de la gestion de plusieurs agents logiciels. Le contexte de l'entreprise est important: Devin est positionné comme un agent software engineer, et Cognition publie plusieurs notes rapprochées sur cloud agents, management de Devins et workflows multi-agents. Pour la Watchtower, cette entrée sert donc de veille sur un acteur spécialisé dans l'autonomie logicielle. Elle doit être lue comme un pointeur à suivre, pas comme une preuve indépendante. Le sujet à surveiller est la convergence entre acteurs: décomposition du travail, agents gérés comme ressources, orchestration plus sobre, artefacts de revue et limites de parallélisation. Pour une équipe senior, l'intérêt est de comparer ces signaux avec les retours Anthropic, Cursor et OpenAI.",
        seniorTakeaway:
          "A suivre comme signal terrain: les labs d'agents convergent vers des formes d'orchestration plus sobres et vérifiables.",
        useWhen:
          "Pour completer les retours Anthropic/OpenAI avec un acteur spécialisé agent logiciel.",
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
          "Propose d'ajouter des hooks de grounding et validation à chaque phase Spec Kit pour éviter hallucinations et violations d'architecture.",
        articleSummary:
          "Ce papier propose une extension de Spec Kit pour réduire le problème des agents context-blind dans les grands repositories. Les auteurs ajoutent des hooks de grounding à chaque phase du workflow SDD: Specify, Plan, Tasks et Implement. Ces hooks forcent l'agent a sonder le repo en lecture seule, a ancrer ses artefacts dans des preuves existantes, puis à valider les résultats intermédiaires contre l'environnement réel. Le pipeline introduit aussi des rôles type PM et développeur pour séparer intention, planification et implémentation. L'évaluation couvre 128 runs, 32 features et cinq repositories, avec une amélioration modeste mais mesurable de la qualité jugée, tout en conservant une compatibilité très élevée avec les tests repo. L'idée importante est que la spec seule ne suffit pas: elle doit rester connectee au code vivant. Pour une équipe Spec Kit, c'est une piste pour éviter les APIs hallucinées et les violations d'architecture.",
        seniorTakeaway:
          "Spec-driven ne suffit pas: les specs doivent être reconnectees au repo réel à chaque phase.",
        useWhen:
          "Pour renforcer un workflow Spec Kit dans un codebase brownfield.",
      },
    ],
  },
  {
    id: "observability-debugging",
    title: "Observabilite & debug black-box",
    summary:
      "Rendre visibles les traces, coûts, décisions et échecs des agents qui manipulent du code et des données.",
    whyItMatters:
      "On ne peut pas opérer un workflow agentique serieux avec seulement le dernier message du modèle: il faut traces, replay, coûts, evals et audit.",
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
          "Cadre pour instrumenter les agents: traces, appels outils, coûts, latence, qualité et comparaison entre runs.",
        articleSummary:
          "Weights & Biases explique pourquoi l'observabilité agentique dépasse largement le monitoring applicatif classique. Un service traditionnel se surveille avec latence, erreurs et ressources; un agent peut répondre techniquement avec succès tout en prenant une mauvaise décision, en halluciant une contrainte ou en appelant le mauvais outil. L'article définit donc l'observabilité agent comme la collecte et l'analyse des raisonnements, appels outils, décisions, coûts, latences, versions de prompts, modèles et configurations. Il insiste particulièrement sur les systèmes multi-agents, où l'erreur visible dans un agent peut venir d'une dérivée de contexte ou de données plusieurs étapes plus tôt. Les cinq piliers couvrent traces, métriques, évaluations, gouvernance et boucle d'amélioration. L'intérêt pour une équipe de dev est direct: avant de confier des workflows sensibles à un agent, il faut pouvoir rejouer, comparer, attribuer et auditer ce qui s'est passé.",
        seniorTakeaway:
          "Les agents doivent être debuggables comme un système distribue: chaque décision importante doit laisser une trace exploitable.",
        useWhen:
          "Pour définir les signaux minimaux avant de déployer un agent dans un flux d'équipe.",
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
          "Plateforme open source de LLM observability: traces, prompts, scores, evals et coûts pour applications et agents.",
        articleSummary:
          "La page présente Langfuse comme une plateforme open source d'LLM engineering qui couvre tracing, prompt management, evals, experiments, annotations humaines, coûts et dashboards. Le positionnement important est l'intégration du cycle complet: partir du prototype, observer la production, annoter ou scorer les traces, puis améliorer prompts et agents avec des données réelles. Langfuse met en avant une compatibilité large avec frameworks, providers et langages via OpenTelemetry et de nombreuses intégrations. Le produit insiste aussi sur le self-hosting, la licence MIT, les exports API et la capacité à traiter de gros volumes d'observations. Pour les agents de code, la page ajoute un signal intéressant: CLI, MCP et skills permettent aux agents eux-mêmes de gérer une partie de l'instrumentation. C'est moins un article de doctrine qu'une référence outillage pour évaluer ce qu'une stack d'observabilité LLM doit couvrir en production.",
        seniorTakeaway:
          "Une stack agentique sans traces et evals finit vite en boîte noire non gouvernable.",
        useWhen:
          "Pour choisir une base d'observabilité LLM/agent compatible open source.",
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
          "Enregistre les sessions agents via Git hooks afin de conserver transcript, prompts, outils, coûts, fichiers modifies et checkpoints.",
        articleSummary:
          "Entire part d'une idée simple: un commit ne suffit plus à raconter comment du code a été produit quand un agent a participé au travail. L'outil CLI s'accroche au workflow Git pour capturer les sessions d'agents à chaque push et les indexer à côté des commits. La page met l'accent sur l'absence de nouveau lieu de travail: les développeurs restent dans leur terminal et leurs outils existants, tandis que les conversations, checkpoints et intentions deviennent consultables. Les intégrations citées couvrent Claude Code, Gemini CLI, Cursor, OpenCode, GitHub Copilot CLI, avec Codex en preview. Pour les équipes, l'intérêt est l'audit trail: retrouver pourquoi un changement a été fait, quel agent était impliqué, quel contexte a guidé la modification et comment partager cette mémoire. C'est une brique utile pour les workflows où review, compliance et passation de contexte comptent autant que le diff final.",
        seniorTakeaway:
          "Pour les agents de code, l'audit trail doit suivre le diff et le contexte de génération, pas seulement le commit final.",
        useWhen:
          "Pour évaluer comment archiver et revoir des runs agents dans un workflow Git.",
      },
    ],
  },
  {
    id: "inference-economy",
    title: "Economie du contexte & tokens",
    summary:
      "Reduire coût, latence et pollution du contexte avec des outils sobres, recherches précises et modèles adaptes.",
    whyItMatters:
      "À l'échelle d'une équipe, le contexte devient une ressource d'infrastructure: il se budgète, se route, se compresse et se débuggue.",
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
          "Position critique: beaucoup de cas MCP seraient mieux servis par des CLI composables, debuggables et déjà comprises par humains et agents.",
        articleSummary:
          "Eric Holmes remet en question l'enthousiasme automatique autour de MCP pour connecter les agents aux outils. Son argument n'est pas que les protocoles sont inutiles, mais que beaucoup de cas d'usage peuvent être mieux servis par des interfaces CLI déjà robustes, composées, observables et faciles à débugguer. Une CLI fonctionne pour les humains comme pour les agents, s'intègre aux shells, logs, permissions et pipelines existants, et n'ajoute pas forcément une couche de serveur ou de schéma à maintenir. L'article invite à regarder le coût complet de l'interface outil: auth, distribution, compatibilité, sorties verbeuses, expérience de debug et charge cognitive. Pour une équipe senior, c'est un bon antidote au réflexe 'nouveau protocole = meilleure architecture'. Le vrai critère est la qualité du contrat entre agent et système: prédictibilité, composabilité, moindre pollution du contexte et capacité à diagnostiquer les erreurs.",
        seniorTakeaway:
          "La meilleure interface outil n'est pas toujours le protocole le plus neuf; debuggabilite, auth, composition et coût contexte comptent.",
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
          "RTK est un proxy CLI qui s'intercale entre l'agent et des commandes de développement courantes pour réduire la consommation de tokens. Le README montre le principe: au lieu de renvoyer a Claude une sortie brute de git, grep, diff ou logs, RTK exécute la commande puis applique filtrage intelligent, regroupement, troncature et déduplication. L'objectif annonce est de garder le signal utile tout en supprimant commentaires, bruit, répétitions et détails non pertinents. Les commandes couvrent lecture de fichiers, arbres de répertoire, recherche, grep, diff et résumés de code. Pour les agents, ce type d'outil traite une cause concrète de dégradation: ce ne sont pas seulement les prompts qui saturent le contexte, mais les sorties d'outils trop longues. Pour une équipe, RTK sert de rappel architectural: optimiser le canal outil-agent peut être aussi rentable que changer de modèle.",
        seniorTakeaway:
          "La pollution du contexte vient souvent des sorties brutes, pas seulement des prompts; optimiser les tool outputs est un levier concret.",
        useWhen:
          "Pour des repos ou commandes très verbeuses qui dégradent la qualité et le coût des sessions agents.",
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
          "Serveur outillé par language servers pour donner aux agents une compréhension symbolique du code au lieu de tout charger en texte.",
        articleSummary:
          "Serena se présente comme un IDE pour agents de code, expose via MCP, qui donne accès à des opérations sémantiques plutôt qu'à de simples recherches texte. L'outil s'appuie notamment sur les language servers pour fournir navigation par symboles, références, refactorings, édition symbolique et débuggage selon le backend utilisé. Le README insiste sur le fait que les agents sont les vrais utilisateurs finaux: ils gagnent en fiabilité quand ils peuvent demander une opération de haut niveau au lieu de manipuler des numéros de lignes fragiles. Serena ajoute aussi une mémoire de projet configurable et des outils de base, mais recommande de désactiver ce qui ferait doublon avec le harness existant. Pour les grands codebases, le point clé est la réduction de contexte inutile: définitions, références et opérations atomiques valent mieux que de gros blocs de fichiers. C'est une piste d'outillage pour passer du 'copier-coller de code' à une vraie code intelligence agentique.",
        seniorTakeaway:
          "Le contexte efficace est souvent structurel: symboles, références et définitions valent mieux qu'un gros copier-coller de fichiers.",
        useWhen:
          "Pour améliorer navigation et modification dans un codebase de taille moyenne ou grande.",
      },
    ],
  },
  {
    id: "tools-platforms",
    title: "Outils & plateformes",
    summary:
      "Panorama des outils d'agents de dev, code intelligence, review, orchestration et plateformes.",
    whyItMatters:
      "Le choix d'outil devient un choix d'operating model: local vs cloud, self-hosted, droits, intégration tickets, review et observabilité.",
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
          "GA de Codex avec Slack, SDK, contrôles admin, usage en éditeur/terminal/cloud et exemples entreprise.",
        articleSummary:
          "L'annonce de disponibilité générale de Codex marque le passage d'un outil de preview à une plateforme plus complète pour équipes. OpenAI met en avant plusieurs surfaces: éditeur, terminal, cloud, Slack, SDK et contrôles administrateur. Le message produit est que Codex n'est plus seulement une expérience individuelle de coding assistant, mais une infrastructure de délégation et d'orchestration pour organisations. Les exemples entreprise servent à montrer des usages au-delà de la génération de code: tests, review, compréhension de grands repos, incidents et automatisations. Pour les seniors, la ressource est utile comme photographie de la surface produit: quels contrôles existent, quelles intégrations deviennent natives, et comment le fournisseur parle d'adoption équipe. Elle aide aussi à distinguer capacités réelles, promesses marketing et prérequis internes. La question à poser n'est pas seulement 'Codex marche-t-il?', mais 'quels workflows, politiques et metrics devons-nous mettre autour?'.",
        seniorTakeaway:
          "Les agents de dev sortent du mode individuel: admin, analytics, Slack et SDK deviennent des critères d'achat.",
        useWhen:
          "Pour comprendre la surface Codex équipe/entreprise.",
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
          "PDF de cas d'usage internes OpenAI: compréhension de code, refactoring, migrations, performance, tests, flow et idéation.",
        articleSummary:
          "Ce PDF compile des usages internes de Codex chez OpenAI à partir d'entretiens et de données d'usage. Les cas couvrent la compréhension de code, les refactorings multi-fichiers, les migrations, l'optimisation de performance, l'amélioration de couverture de tests, la vélocité de développement, le maintien du flow et l'idéation. Le document est intéressant car il montre que les usages les plus rentables ne sont pas uniquement la création de features. Codex sert aussi à cartographier un système, trouver des chemins de données, détecter des patterns répétés, proposer des tests d'edge cases ou préparer des PRs pendant qu'un engineer reste concentré sur autre chose. Les bonnes pratiques encouragent à donner du contexte, demander des plans, vérifier, itérer et utiliser l'agent sur des tâches bien bornées. Pour une équipe, c'est une base pour construire une matrice de cas d'usage, avec des catégories plus nuancées que 'écrire du code plus vite'.",
        seniorTakeaway:
          "Les meilleurs cas ne sont pas seulement génération de features: comprendre, migrer, couvrir, optimiser et investiguer comptent autant.",
        useWhen:
          "Pour construire une matrice de cas d'usage IA dans une équipe existante.",
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
          "Documentation du coding agent Copilot: assignation, plans payants, intégration GitHub et comportement de PR.",
        articleSummary:
          "La documentation GitHub décrit Copilot cloud agent comme un agent qui peut être assigné à des issues ou demandes dans GitHub et travailler jusqu'à produire une pull request. Le contenu couvre le positionnement du cloud agent, les prérequis de plan, les permissions, les intégrations GitHub et la manière dont l'agent opère dans le contexte du repo. L'intérêt est que GitHub transforme la plateforme de code review elle-même en surface de délégation. Les agents peuvent être rattachés à des objets existants, ouvrir des branches, proposer des changements et s'insèrer dans le workflow PR. Pour une équipe déjà GitHub-first, cela réduit la distance entre planification, exécution et review, mais augmente aussi le besoin de règles: quels tickets assigner, qui relit, quels checks bloquent et comment limiter les droits. La ressource sert à comparer l'approche native GitHub avec les agents plus indépendants comme Codex, Cursor ou Claude Code.",
        seniorTakeaway:
          "GitHub devient une surface native pour assigner du travail à des agents, pas seulement pour heberger leurs PRs.",
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
          "Sourcegraph présente sa version 7.0 comme un repositionnement vers une couche d'intelligence partagée pour développeurs et agents. L'article part du problème des grands codebases: dépendances cross-repo, historique, décisions architecturales anciennes et contexte implicite rendent les suggestions agents fragiles. Sourcegraph propose que les agents aient accès au même contexte profond que les meilleurs développeurs, notamment via Deep Search et MCP. La promesse n'est pas que l'agent écrive du code parfait, mais qu'il dispose d'un socle de compréhension plus fiable pour poser des questions sémantiques, historiques ou architecturales. Le texte est utile parce qu'il reformule le code search comme infrastructure agentique. Pour les équipes enterprise, cela déplace le débat buy vs build: la qualité de l'agent dépend de la qualité du graphe de connaissance code, des permissions, de la fraîcheur et de l'intégration dans les workflows.",
        seniorTakeaway:
          "L'agent a besoin de code intelligence d'entreprise: dépendances cross-repo, historique, conventions et architecture.",
        useWhen:
          "Pour réfléchir buy vs build autour du code search et de l'indexation agentique.",
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
          "Analyse les exigences et coûts de construire une plateforme de code intelligence interne.",
        articleSummary:
          "Sourcegraph détaille ce qu'il faut vraiment construire pour disposer d'une plateforme de code intelligence interne. L'article montre que la partie visible, une barre de recherche et des résultats, n'est qu'une petite fraction du travail. Le reste inclut indexation, recherche exacte et regex, graphe de références, synchronisation de repos, Git serving, permissions, authentification, stockage, jobs de fond, observabilité et support des environnements enterprise. La thèse est que les briques open source comme Zoekt ou SCIP sont utiles mais ne remplacent pas l'infrastructure autour: planification de requêtes, ranking, contrôles d'accès, re-indexation, compatibilité multi-host et gestion des acquisitions. Le lien avec les agents est direct: sans contexte fiable, un agent travaille sur une vue incomplète ou obsolète du code. Pour des leaders plateforme, la ressource aide à chiffrer le coût caché d'un build interne et à séparer moteur technique, expérience développeur et exigences de gouvernance.",
        seniorTakeaway:
          "Avant de construire ton propre contexte agentique, chiffre les besoins: multi-repo, langages, permissions, fraîcheur, compliance et maintenance.",
        useWhen:
          "Pour préparer une décision plateforme dans une organisation de taille significative.",
      },
    ],
  },
  {
    id: "security-governance",
    title: "Sécurité, gouvernance & contrôle",
    summary:
      "Permissions, exfiltration, prompt injection, admin controls, self-hosting et responsabilité.",
    whyItMatters:
      "Un agent qui peut lire le repo, exécuter des commandes et pousser du code est une surface de risque opérationnelle.",
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
          "Explore comment dépasser les prompts de permission répétitifs pour obtenir plus d'autonomie sans perdre le contrôle sécurité.",
        articleSummary:
          "Anthropic analyse le compromis entre sécurité et autonomie dans Claude Code. Les confirmations manuelles protégeaient l'utilisateur, mais elles deviennent vite un frein quand l'agent doit exécuter beaucoup d'actions répétitives. L'article propose de déplacer le contrôle vers l'environnement et les politiques plutôt que de multiplier les prompts. Le sandboxing permet d'autoriser davantage d'actions dans un périmètre limité, observable et réversible. La ressource insiste sur la conception des permissions: quelles commandes sont sûres, quelles sorties peuvent exfiltrer des données, quels accès réseau sont acceptables, et comment garder l'utilisateur en contrôle sans le fatiguer. Le message est que la sécurité agentique n'est pas un interrupteur binaire. Elle demande des modes, des boundaries et des garanties techniques. Pour une équipe senior, c'est une base pour définir des profils d'autonomie par repo, tâche et niveau de risque.",
        seniorTakeaway:
          "La sécurité agentique est un design de politique et d'environnement, pas une pile de confirmations manuelles.",
        useWhen:
          "Pour définir modes de permission, commandes autorisees et limites d'autonomie.",
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
          "Claude Code auto mode vise à réduire la friction des permissions tout en gardant des garde-fous. L'article explique que demander confirmation pour chaque commande ou modification peut rendre les agents trop lents, surtout sur des tâches longues ou répétitives. Le mode auto cherche à distinguer les actions sûres des actions plus sensibles, afin d'autoriser les premières sans interrompre constamment l'utilisateur. Le sujet central est la calibration de confiance: l'agent doit pouvoir avancer, mais pas obtenir un accès illimité au système. Anthropic met donc l'accent sur les classifiers de risque, les limites d'environnement et la possibilité de reprendre la main. Pour une équipe, cette ressource aide à penser des politiques d'usage: quand accepter l'auto mode, sur quels repos, avec quels secrets, et pour quelles catégories de commandes. C'est un signal que les outils vont vers plus d'autonomie encadrée, pas vers l'absence de contrôle.",
        seniorTakeaway:
          "L'autonomie n'est acceptable que si l'environnement, les commandes et les sorties restent auditablement contrôles.",
        useWhen:
          "Pour évaluer si une équipe peut passer d'un agent accompagne à un agent plus autonome.",
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
          "Documente les considerations de sécurité et mitigations produit pour GPT-5-Codex, dont sandboxing et accès réseau configurable.",
        articleSummary:
          "L'addendum system card GPT-5-Codex documente les risques et mitigations propres à un modèle spécialisé pour le coding agentique. Le document couvre les dimensions de sécurité produit: exécution de code, accès fichiers, sandboxing, contrôle réseau, interactions avec outils et risques de comportements non souhaites. L'intérêt pour une équipe n'est pas de lire la system card comme une garantie absolue, mais comme une liste de menaces que le fournisseur a juge suffisamment importantes pour les tester et mitiguer. Elle montre aussi que le modèle ne peut pas être sépare de son runtime: la sécurité dépend de la configuration du sandbox, des permissions, des données disponibles et de la supervision humaine. Pour les responsables plateforme, c'est une source utile pour construire une grille de risques interne. Elle aide à poser des questions concrètes avant adoption: secrets, réseau, commandes autorisees, audit des actions, revue et rollback.",
        seniorTakeaway:
          "Les system cards donnent des indices utiles pour les politiques internes: sandbox, réseau, secrets et review humaine.",
        useWhen:
          "Pour construire une grille de risques avant de déploiement d'agents de code.",
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
          "Page produit utile pour suivre les capacités, intégrations et positionnement entreprise de Claude Code.",
        articleSummary:
          "La page produit Claude Code présente le système comme un agent de coding capable de lire un codebase, modifier plusieurs fichiers, lancer des tests et livrer du code commité. Elle insiste sur le passage d'un outil d'autocomplete à un agent qui agit au niveau projet. Les cas d'usage mis en avant couvrent navigation dans un code inconnu, développement multi-fichiers, exécution d'outils CLI, correction de tests et gestion de CI. La page met aussi en avant des exemples clients: migrations, incident response, réduction de délais et parallélisation de sessions. Comme toute page produit, elle doit être lue avec distance, mais elle donne un bon signal de positionnement enterprise et des workflows que le fournisseur veut normaliser. Pour une équipe senior, l'intérêt est de traduire ces claims en critères de proof of concept: quel setup, quelles permissions, quels tests, quelle supervision et quelle mesure de gain.",
        seniorTakeaway:
          "Les claims produit doivent être lus comme signaux de direction, puis verifies dans le workflow réel de l'équipe.",
        useWhen:
          "Pour maintenir une veille outillage sans confondre marketing et pratiques prouvées.",
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
          "Recherche sur l'intégration de principes sécurité non négociables directement dans la couche de specifications.",
        articleSummary:
          "Ce papier propose le Constitutional Spec-Driven Development, une méthode qui encode des contraintes sécurité non négociables dans la spécification avant génération de code. L'auteur part du constat que le vibe coding accélère le développement mais peut privilégier la correction fonctionnelle au détriment de la sécurité. La constitution devient un document versionné et lisible par machine, dérivée de références comme CWE/MITRE Top 25 et de cadres réglementaires. Le cas d'étude porte sur une application bancaire en microservices, avec traçabilité des principes vers les emplacements de code. Le papier annonce une réduction importante des défauts sécurité par rapport à une génération non contrainte. Même si le résultat doit être lu comme recherche appliquée, la logique est précieuse: mettre les invariants de sécurité en amont de l'agent, puis vérifier leur application. Pour une équipe, c'est une justification forte pour maintenir une constitution projet et des gates avant implémentation.",
        seniorTakeaway:
          "La gouvernance doit être en amont de la génération: les specs sont un levier de sécurité by construction.",
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
          "Referentiel de risques pour applications LLM: prompt injection, données sensibles, supply chain, excessive agency, sorties non fiables et gouvernance.",
        articleSummary:
          "L'OWASP Top 10 for LLM Applications fournit une taxonomie de risques pour les systèmes génératifs et agentiques. La version 2025 couvre notamment prompt injection, divulgation de données sensibles, supply chain, empoisonnement de données ou modèles, mauvaise gestion des sorties, agency excessive, fuite de system prompt, faiblesses des embeddings, désinformation et consommation non bornée. L'intérêt est de traduire les inquiétudes générales sur les LLM en catégories auditables et discutables avec sécurité, plateforme et produit. Pour les agents de développement, plusieurs risques se combinent: un agent peut lire du code, recevoir des instructions indirectes, appeler des outils, exposer des secrets ou produire une dépendance vulnérable. La ressource sert donc de checklist de gouvernance plus que de guide d'implémentation détaillé. Elle aide à poser les questions minimales avant d'ouvrir des permissions, brancher des données internes ou automatiser des changements de code.",
        seniorTakeaway:
          "Un agent de dev traverse plusieurs surfaces OWASP LLM à la fois: accès outil, secrets, code généré, dépendances et validation humaine.",
        useWhen:
          "Pour cadrer une checklist sécurité avant de connecter des agents à des repos, outils internes ou données sensibles.",
      },
    ],
  },
  {
    id: "enterprise-metrics",
    title: "Adoption entreprise & métriques",
    summary:
      "Mesurer l'effet de l'IA sur throughput, qualité, adoption, DX et organisation.",
    whyItMatters:
      "Les gains individuels ne deviennent gains d'équipe que si le système de delivery, review et plateforme suit.",
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
          "Rapport DORA sur l'IA comme amplificateur des forces et faiblesses organisationnelles, avec focus sur systèmes et capacités.",
        articleSummary:
          "Le rapport DORA 2025 analyse l'IA assistee dans le développement logiciel sous l'angle des capacités organisationnelles, pas seulement des gains individuels. Il replace l'IA dans les fondamentaux DORA: delivery performance, qualité, fiabilité, culture, plateforme, flux de travail et feedback. Le message utile est que l'IA amplifie ce qui existe déjà: une organisation avec tests, CI, architecture claire et bonnes boucles de feedback peut transformer l'assistance IA en levier, tandis qu'une organisation fragile risque d'accelerer le chaos. Le rapport aide aussi à déplacer la discussion ROI depuis les anecdotes de productivité vers des mesurés systemiques: throughput, stabilite, expérience développeur, qualité et apprentissage. Pour les leaders engineering, c'est une base plus solide que les claims vendeurs. La bonne lecture est: quels prérequis organisationnels rendent l'IA utile, et quels dysfonctionnements seront amplifies si on deploie des agents trop vite?",
        seniorTakeaway:
          "L'IA n'annule pas les fondamentaux DevOps; elle amplifie la qualité ou le chaos de ton système existant.",
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
          "L'Octoverse 2025 de GitHub donne une photographie macro de l'activité développeur sur la plateforme. Le rapport met en avant la croissance des projets IA, l'adoption massive d'outils IA et le fait que TypeScript devient un langage dominant dans ce contexte. Il mentionne aussi l'évolution des PRs, de la collaboration et du rôle des agents dans les workflows GitHub. Pour l'observatoire, l'intérêt n'est pas de conclure directement à un gain de productivité, car les données de plateforme mesurent surtout l'activité et l'adoption. En revanche, elles indiquent où les pratiques se normalisent: les développeurs utilisent davantage les modèles, les outils agentiques et les plateformes de review intégrées. Le rapport aide à distinguer tendance écosystème et preuve de qualité. Pour une équipe senior, c'est une source de contexte pour calibrer veille, recrutement, choix d'outils et attentes des contributeurs open source.",
        seniorTakeaway:
          "Les signaux d'adoption de plateforme montrent où les pratiques se normalisent, même si elles ne prouvent pas la productivité.",
        useWhen:
          "Pour suivre les tendances écosystème au niveau GitHub.",
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
          "OpenAI annonce Codex Labs, des partenaires intégrateurs et des usages entreprise sur tests, review, features, incidents et grands repos.",
        articleSummary:
          "OpenAI annonce Codex Labs et des partenariats avec de grands intégrateurs pour aider les entreprises à déployer Codex à grande échelle. L'article cite une croissance rapide de l'usage développeur et présente des cas enterprise sur tests, code review, nouvelles features, compréhension de grands repos et incident response. Le message important est le passage du pilote individuel à l'industrialisation: workshops, accompagnement, intégration aux workflows existants et identification de cas d'usage répétables. OpenAI positionne aussi Codex au-delà de l'engineering strict, vers des tâches de synthèse, planification et actions entre outils. Pour une équipe senior, cette ressource sert surtout à comprendre le go-to-market et les attentes que les directions vont avoir. Elle invite à préparer une réponse structurée: quels cas d'usage sont mûrs, quels contrôles sont nécessaires, comment mesurer la valeur et comment éviter une adoption uniquement poussée par le fournisseur.",
        seniorTakeaway:
          "Le marché passe du pilote individuel à l'industrialisation: formation, intégration, gouvernance et use cases répétables.",
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
          "Donnees de perception et adoption IA chez les développeurs, utiles pour comprendre confiance, usage et scepticisme.",
        articleSummary:
          "Le Developer Survey 2025 de Stack Overflow fournit des données de perception sur les développeurs, leurs outils et leur rapport à l'IA. Le rapport indique une forte exposition aux LLMs et aux agents, avec une majorité d'utilisateurs d'agents déclarant un gain de productivité, mais aussi des nuances sur confiance, collaboration et qualité de code. Il montre que l'adoption est large, y compris chez des développeurs expérimentés, mais que l'usage ne signifie pas automatiquement satisfaction totale ou délégation aveugle. Pour l'observatoire, cette source est utile comme contrepoint aux annonces fournisseurs: elle capture ce que les praticiens disent utiliser, apprendre et ressentir. Elle aide aussi à anticiper les tensions dans les équipes: productivité perçue, scepticisme, besoin de vérification et changement des outils de collaboration. Pour des managers hands-on, c'est une base pour discuter adoption avec des données de terrain plutôt qu'àvec des impressions individuelles.",
        seniorTakeaway:
          "L'adoption massive ne signifie pas confiance massive; la qualité perçue et la vérification restent centrales.",
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
          "METR explique pourquoi mesurer la productivité IA devient plus difficile: adoption accrue, sélection des tâches, parallélisme agents et biais de participation.",
        articleSummary:
          "METR explique pourquoi son design experimental de mesure de productivité développeur doit evoluer. Les outils IA sont plus largement adoptes, les développeurs apprennent a choisir les tâches qui conviennent aux agents, et les workflows deviennent parallèles plutôt que strictement séquentiels. Cela rend moins pertinente une mesure simple du temps gagné sur une tâche isolée. L'article discute aussi les biais de participation et les effets de sélection: les personnes qui acceptent de participer, les tâches choisies et l'expérience préalable avec l'IA influencent fortement les résultats. Pour les équipes, le point important est que la productivité IA n'est pas une variable stable à mesurer une fois. Elle dépend du niveau de maturite, du type de travail, de l'outillage et de l'organisation du flux. Cette ressource aide a concevoir des métriques plus réalistes: parallélisme, qualité, rework, throughput équipe et capacité a apprendre.",
        seniorTakeaway:
          "Les anciennes mesurés de temps par tâche se cassent quand les devs orchestrent plusieurs agents en parallèle.",
        useWhen:
          "Pour concevoir des métriques d'équipe qui ne reduisent pas l'IA a 'minutes gagnees'.",
      },
    ],
  },
  {
    id: "skepticism-research",
    title: "Recherche critique & limites",
    summary:
      "Lire les résultats qui contredisent le narratif 'tout va plus vite' et clarifient les limites.",
    whyItMatters:
      "Un senior doit savoir où les agents échouent, quand ils ralentissent, et quelles hypothèses ne généralisent pas.",
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
          "RCT sur 16 développeurs open source expérimentés travaillant sur leurs repos; dans ce cadre early-2025, l'IA les ralentit de 19%.",
        articleSummary:
          "L'étude METR mesure l'impact des outils IA early-2025 sur des développeurs open source expérimentés travaillant sur leurs propres repositories. Le résultat le plus cite est contre-intuitif: dans ce contexte, l'usage de l'IA a ralenti les participants d'environ 19%, alors qu'ils pensaient avoir été acceleres. L'étude est importante parce qu'elle porte sur des tâches réelles et des codebases connus, pas uniquement sur des benchmarks artificiels. Elle doit toutefois être lue avec ses limites: petit echantillon, outils et modèles de début 2025, niveau d'expérience IA variable, et un participant très expérimenté qui obtient des gains. Le message senior n'est donc pas 'l'IA ralentit toujours', mais 'les gains dependent fortement du contexte'. Revue, correction, mauvaise compréhension du codebase et confiance excessive peuvent annuler le temps gagné en génération. C'est une ressource utile pour temperer les promesses simplistes et parler de conditions d'usage.",
        seniorTakeaway:
          "Les gains dependent du contexte: codebase connu, tâches matures, coût de revue et qualité de l'outillage peuvent inverser le benefice.",
        useWhen:
          "Pour temperer les promesses de productivité et parler de conditions d'usage.",
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
          "AIDev introduit un grand dataset de pull requests agentiques observées sur GitHub. Les auteurs agrégeraient plus de 932 000 PRs produites par cinq agents: Codex, Devin, Copilot, Cursor et Claude Code, couvrant plus de 116 000 repositories et 72 000 développeurs. Le dataset inclut aussi un sous-ensemble plus riche de PRs issues de repositories avec plus de 100 stars, comprenant commentaires, reviews, commits et issues liées. L'intérêt principal est de fournir une base empirique pour étudier l'adoption des agents dans le monde réel. Au lieu de s'appuyer sur anecdotes ou benchmarks fermés, les chercheurs peuvent analyser comment les agents sont utilisés, dans quels projets, avec quels types de changements et quelles interactions humaines. Pour une équipe senior, ce n'est pas directement un guide pratique, mais une source à suivre pour comprendre les patterns d'adoption, les risques de review et les formes de collaboration humain-agent.",
        seniorTakeaway:
          "On commence à pouvoir étudier les agents dans le monde réel à grande échelle, pas seulement via anecdotes.",
        useWhen:
          "Pour alimenter une veille recherche sur adoption et intégration de PRs agents.",
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
          "Compare des PRs agentiques mergées et humaines pour analyser comment les agents modifient le code et decrivent leurs changements.",
        articleSummary:
          "Ce papier compare des pull requests mergées produites par agents avec des PRs humaines, à partir du dataset AIDev. Les auteurs analysent le nombre de commits, les fichiers touchés, les additions, suppressions et la similarité entre description de PR et diff effectif. Les résultats indiquent que les PRs agentiques diffèrent notamment par le nombre de commits et certains aspects de taille ou de forme du changement. Elles présentent aussi une similarité description-diff légèrement plus élevée, ce qui peut refléter une tendance à décrire plus directement ce qui a été modifié. L'intérêt de l'étude est de donner des signaux observables pour la review: forme de PR, taille, granularité, cohérence entre texte et code. Pour les équipes, cela ouvre la voie à des heuristiques de triage et de contrôle qualité spécifiques aux PRs agentiques. Un agent ne se juge pas seulement au fait que la CI passe; la structure du changement compte aussi.",
        seniorTakeaway:
          "La qualité d'un agent doit se lire dans la taille, la forme, la description et l'intégration des changements.",
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
          "AgenticFlict se concentre sur les conflits de merge dans les pull requests produites par agents de code. La ressource est importante car le parallélisme agentique promet de multiplier les chantiers simultanés, mais cette multiplication augmente aussi les risques d'intégration. Les conflits ne sont pas seulement des accidents Git: ils révèlent des problèmes de coordination, de découpage des tâches, de durée de branche et de chevauchement fonctionnel. Le dataset permet d'étudier à grande échelle quand et comment ces conflits apparaissent dans des PRs agentiques. Pour une équipe senior, le takeaway pratique est clair: si plusieurs agents travaillent en parallèle, il faut des stratégies de petits lots, de worktrees, de locks, de rebase fréquent, de tests rapides et de propriétaires humains. L'autonomie de production de code doit être accompagnée d'une architecture d'intégration. Sinon le gain apparent se transforme en coût de merge et de review.",
        seniorTakeaway:
          "Plus d'agents en parallèle signifie plus de risques d'intégration; la coordination devient un problème produit.",
        useWhen:
          "Pour définir des stratégies worktree, locking, petits lots et intégration continue.",
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
          "Situe le spec-driven development comme passage du code source de verite vers le contrat/spécification maintenu.",
        articleSummary:
          "Ce papier positionne le spec-driven development comme une réponse au changement apporté par les assistants de code IA. Quand le code peut être généré ou modifié rapidement, le contrat qui guide le système devient plus important que la saisie manuelle du code lui-même. L'article défend l'idée que la spécification doit devenir un artefact maintenu, vérifiable et connecté à l'implémentation, plutôt qu'un document ponctuel écrit avant le développement. Cette approche aide à clarifier les exigences, les contraintes et les critères d'acceptation avant de demander à un agent de produire des changements. Elle peut aussi servir de base à la vérification et à la traçabilité. Pour une équipe senior, l'intérêt est de cadrer le rôle de la spec dans les workflows IA: elle ne remplace pas le jugement technique, mais elle rend l'intention explicite et révisable. La limite à garder en tête est le coût de maintenance: une spec obsolète peut guider l'agent dans la mauvaise direction.",
        seniorTakeaway:
          "Les specs ne sont plus des docs mortes: elles deviennent des artefacts de pilotage et vérification pour agents.",
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
