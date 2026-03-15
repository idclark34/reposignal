import { PlaybookEntry } from '@/types'

export const PLAYBOOKS: PlaybookEntry[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    tagline: 'Open source Firebase alternative built on Postgres',
    repo: 'supabase/supabase',
    currentStars: '73k+',
    categories: ['database', 'backend', 'postgres'],
    stack: ['TypeScript', 'Go', 'PostgreSQL'],
    launchYear: 2020,
    channels: ['twitter', 'hn', 'producthunt'],
    contentExamples: [
      {
        platform: 'hn',
        text: 'Show HN: Supabase – an open source Firebase alternative using Postgres',
        engagement: '▲ 812 pts · 312 comments',
        context: 'at launch',
      },
      {
        platform: 'twitter',
        text: 'We just shipped realtime subscriptions. Every row change in Postgres now streams to your client in real time. Zero config.',
        engagement: '4.2k likes · 1.1k RTs',
        context: 'feature drop',
      },
      {
        platform: 'producthunt',
        text: 'Supabase — Open Source Firebase alternative with Postgres',
        engagement: '#1 Product of the Day · 1.2k upvotes',
        context: 'PH launch',
      },
    ],
    milestones: [
      {
        label: '0 → 1k stars',
        description: 'Show HN post drove initial traction; positioned explicitly against Firebase',
        timeframe: 'Week 1',
      },
      {
        label: '1k → 10k stars',
        description: 'Weekly changelog threads on Twitter and consistent HN presence built momentum',
        timeframe: 'Month 3',
      },
      {
        label: 'Product Hunt launch',
        description: '#1 Product of the Day drove 8k new signups in 48 hours',
        timeframe: 'Month 6',
      },
      {
        label: '$2M seed round announced',
        description: 'Public funding announcement + blog post drove second wave of HN attention',
        timeframe: 'Month 9',
      },
    ],
    lessons: [
      'Lead with the incumbent (Firebase)',
      'Ship and announce weekly',
      'Postgres is the moat — say it loud',
      'Build in public from day 1',
      'Developer Twitter compounds fast',
      'HN Show HN is still the best cold launch',
    ],
    channelNotes:
      'Supabase bet heavily on Twitter as a brand-building channel and HN for credibility spikes. Product Hunt amplified each major release. Newsletter ("Supabase Weekly") drove retention.',
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    tagline: 'Utility-first CSS framework for rapid UI development',
    repo: 'tailwindlabs/tailwindcss',
    currentStars: '84k+',
    categories: ['css', 'styling', 'frontend', 'utility-first'],
    stack: ['JavaScript', 'PostCSS'],
    launchYear: 2017,
    channels: ['twitter', 'hn', 'newsletter'],
    contentExamples: [
      {
        platform: 'twitter',
        text: 'A lot of people are skeptical of utility classes. Here\'s why I think they\'re actually the most productive way to style things once you get past the initial "this looks ugly" reaction.',
        engagement: '8.4k likes · 2.3k RTs',
        context: 'controversial take',
      },
      {
        platform: 'hn',
        text: 'Tailwind CSS – A utility-first CSS framework for rapid UI development',
        engagement: '▲ 654 pts · 278 comments',
        context: 'v1 launch',
      },
      {
        platform: 'newsletter',
        text: 'This week in Tailwind: JIT mode is now the default. Here\'s what changed and why.',
        engagement: '42% open rate',
        context: 'weekly newsletter',
      },
    ],
    milestones: [
      {
        label: '0 → 5k stars',
        description: 'Adam Wathan\'s "CSS Utility Classes and Separation of Concerns" essay went viral on HN',
        timeframe: 'Month 1',
      },
      {
        label: '5k → 20k stars',
        description: 'Refactoring UI book launch created massive awareness among designers and devs',
        timeframe: 'Year 1',
      },
      {
        label: 'v2.0 launch',
        description: 'Dark mode, JIT mode, and new color palette drove biggest traffic spike to date',
        timeframe: 'Year 2',
      },
      {
        label: '50k → 80k stars',
        description: 'Tailwind UI (paid component library) validated the business and fueled OSS investment',
        timeframe: 'Year 3',
      },
    ],
    lessons: [
      'Write the essay before the code',
      'Controversy is distribution',
      'Pair OSS with a paid tier early',
      'Own the "why" debate in your category',
      'Video demos convert faster than docs',
    ],
    channelNotes:
      'Adam Wathan\'s personal Twitter account was the primary growth engine. Long-form opinionated content drove HN discussions. Refactoring UI newsletter pre-dated the framework and seeded its audience.',
  },
  {
    id: 'calcom',
    name: 'Cal.com',
    tagline: 'Open source Calendly alternative you can self-host',
    repo: 'calcom/cal.com',
    currentStars: '34k+',
    categories: ['scheduling', 'saas-alternative', 'open-source'],
    stack: ['TypeScript', 'Next.js', 'Prisma'],
    launchYear: 2021,
    channels: ['twitter', 'hn', 'producthunt', 'reddit'],
    contentExamples: [
      {
        platform: 'hn',
        text: 'Show HN: Cal.com – an open source Calendly alternative you can self-host',
        engagement: '▲ 943 pts · 401 comments',
        context: 'Show HN launch',
      },
      {
        platform: 'twitter',
        text: 'We raised $25M to build the open source scheduling infrastructure for the internet. And we\'re just getting started.',
        engagement: '6.1k likes · 1.8k RTs',
      },
      {
        platform: 'reddit',
        text: 'I built an open-source alternative to Calendly that you can self-host. $0 to self-host, MIT licensed.',
        engagement: '▲ 2.1k pts',
        context: 'r/selfhosted',
      },
    ],
    milestones: [
      {
        label: '0 → 3k stars',
        description: 'Show HN post with explicit "alternative to Calendly" framing drove viral sharing',
        timeframe: 'Week 1',
      },
      {
        label: '3k → 15k stars',
        description: 'r/selfhosted and r/opensource posts found existing demand for self-hosted scheduling',
        timeframe: 'Month 2',
      },
      {
        label: '$25M Series A',
        description: 'Public funding announcement became a media event — TC, The Verge covered it',
        timeframe: 'Month 8',
      },
      {
        label: '30k stars',
        description: 'Enterprise tier launch with SSO and teams drove second user acquisition wave',
        timeframe: 'Year 2',
      },
    ],
    lessons: [
      '"Alternative to X" is the fastest positioning',
      'Self-host communities are underrated',
      'MIT license removes the biggest adoption blocker',
      'Announce funding publicly — it\'s free press',
      'Reddit finds different users than HN',
    ],
    channelNotes:
      'Cal.com cracked the "open source alternative" formula: name the incumbent in the headline, make self-hosting trivial, and seed niche communities (r/selfhosted, r/homelab) before HN.',
  },
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    tagline: 'Copy-paste React components built on Radix and Tailwind',
    repo: 'shadcn-ui/ui',
    currentStars: '82k+',
    categories: ['react', 'component-library', 'design-system'],
    stack: ['TypeScript', 'React', 'Tailwind CSS', 'Radix UI'],
    launchYear: 2023,
    channels: ['twitter', 'hn'],
    contentExamples: [
      {
        platform: 'twitter',
        text: 'This is not a component library. It\'s a collection of re-usable components that you can copy and paste into your apps.',
        engagement: '12.3k likes · 4.1k RTs',
        context: 'positioning tweet',
      },
      {
        platform: 'hn',
        text: 'shadcn/ui – Re-usable components built using Radix UI and Tailwind CSS',
        engagement: '▲ 1.1k pts · 312 comments',
      },
      {
        platform: 'twitter',
        text: 'New components dropped: Data Table, Combobox, Date Picker. All copy-paste ready.',
        engagement: '5.8k likes',
        context: 'weekly drop',
      },
    ],
    milestones: [
      {
        label: '0 → 10k stars',
        description: 'Contrarian "not a library" positioning broke through noise in a crowded category',
        timeframe: 'Week 2',
      },
      {
        label: '10k → 40k stars',
        description: 'Twitter virality from developers showing side-by-side before/after component code',
        timeframe: 'Month 2',
      },
      {
        label: 'Vercel partnership',
        description: 'Default in Next.js scaffolding drove exponential adoption among new projects',
        timeframe: 'Month 5',
      },
      {
        label: '80k stars',
        description: 'Community themes and variants ecosystem created self-sustaining content flywheel',
        timeframe: 'Year 1',
      },
    ],
    lessons: [
      'Reframe the category before competing in it',
      'Copy-paste > install as dependency',
      'Ship new components every week',
      'Ecosystem plugins multiply your surface area',
      'Get into default toolchains',
    ],
    channelNotes:
      'shadcn/ui grew almost entirely through Twitter and HN. The "not a library" framing was deliberate differentiation. Weekly drops maintained feed presence without paid distribution.',
  },
  {
    id: 'resend',
    name: 'Resend',
    tagline: 'Email API for developers — ship transactional email that works',
    repo: 'resendlabs/resend-node',
    currentStars: '3k+',
    categories: ['email', 'api', 'developer-tools'],
    stack: ['TypeScript', 'React Email'],
    launchYear: 2023,
    channels: ['twitter', 'hn', 'producthunt'],
    contentExamples: [
      {
        platform: 'producthunt',
        text: 'Resend — Email API for developers',
        engagement: '#1 Product of the Day · 1.8k upvotes',
        context: 'launch day',
      },
      {
        platform: 'twitter',
        text: 'Introducing React Email — write your emails in JSX. Works with any email provider.',
        engagement: '9.2k likes · 3.4k RTs',
        context: 'React Email launch',
      },
      {
        platform: 'hn',
        text: 'Show HN: React Email – Build and send emails using React',
        engagement: '▲ 778 pts · 218 comments',
      },
    ],
    milestones: [
      {
        label: 'Private beta',
        description: 'Waitlist of 3k developers before public launch through Twitter buzz',
        timeframe: 'Month 1',
      },
      {
        label: 'Public launch',
        description: 'Product Hunt #1 + HN front page same day — 10k signups in 48 hours',
        timeframe: 'Month 3',
      },
      {
        label: 'React Email launch',
        description: 'Open source companion tool (React Email) became its own viral moment, feeding Resend signups',
        timeframe: 'Month 4',
      },
      {
        label: '$3M seed',
        description: 'Funding announced publicly, Y Combinator association added credibility signal',
        timeframe: 'Month 5',
      },
    ],
    lessons: [
      'Ship an OSS tool adjacent to your paid product',
      'Coordinate PH + HN on launch day',
      'Developer experience IS the marketing',
      'Build the waitlist before writing the code',
      'YC credibility is free press',
    ],
    channelNotes:
      'Resend ran a classic dev-tool playbook: build in public on Twitter, launch OSS companion (React Email) to manufacture a second virality moment, then coordinate a dual-channel launch (PH + HN) on the same day.',
  },
  {
    id: 'triggerdev',
    name: 'Trigger.dev',
    tagline: 'Background jobs for TypeScript — run code in the background without infra',
    repo: 'triggerdotdev/trigger.dev',
    currentStars: '10k+',
    categories: ['background-jobs', 'typescript', 'workflows'],
    stack: ['TypeScript', 'Node.js', 'Postgres'],
    launchYear: 2022,
    channels: ['twitter', 'hn', 'reddit'],
    contentExamples: [
      {
        platform: 'hn',
        text: 'Show HN: Trigger.dev – open-source background jobs for TypeScript with no infra',
        engagement: '▲ 612 pts · 186 comments',
        context: 'Show HN',
      },
      {
        platform: 'twitter',
        text: 'We just open-sourced our job queue. No Bull.mq config, no Redis setup. Just write a function.',
        engagement: '3.8k likes · 1.2k RTs',
      },
      {
        platform: 'reddit',
        text: 'I built an open-source alternative to Inngest and Quirrel that runs background jobs in TypeScript — would love feedback',
        engagement: '▲ 891 pts',
        context: 'r/typescript',
      },
    ],
    milestones: [
      {
        label: '0 → 2k stars',
        description: 'Show HN drove first wave; r/typescript and r/node seeded early adopters',
        timeframe: 'Month 1',
      },
      {
        label: 'v2.0 launch',
        description: 'Complete rewrite with simpler API drove second HN front page appearance',
        timeframe: 'Month 8',
      },
      {
        label: '$3M raise',
        description: 'Funding + YC S22 batch announcement attracted enterprise inbound',
        timeframe: 'Year 1',
      },
      {
        label: '10k stars',
        description: 'Steady Twitter content showing real-world use cases compounded steadily',
        timeframe: 'Year 2',
      },
    ],
    lessons: [
      'Name the problem, not just the solution',
      'TypeScript-native is a niche with big fanbase',
      'Reddit developer subs are criminally underused',
      'v2.0 rewrite is a free marketing event',
      'Show HN with zero-config angle wins comments',
    ],
    channelNotes:
      'Trigger.dev focused on the TypeScript developer specifically — subreddit targeting (r/typescript, r/node) found exactly the right audience. Major version releases were treated as launch events with coordinated posts.',
  },
  {
    id: 'turso',
    name: 'Turso',
    tagline: 'SQLite at the edge — distributed database for every user',
    repo: 'tursodatabase/libsql',
    currentStars: '15k+',
    categories: ['database', 'sqlite', 'edge'],
    stack: ['Rust', 'C', 'TypeScript'],
    launchYear: 2023,
    channels: ['twitter', 'hn', 'newsletter'],
    contentExamples: [
      {
        platform: 'hn',
        text: 'Turso – SQLite for the Edge',
        engagement: '▲ 534 pts · 241 comments',
        context: 'launch',
      },
      {
        platform: 'twitter',
        text: 'We forked SQLite. Here\'s why — and why it matters for every app running at the edge.',
        engagement: '5.1k likes · 1.9k RTs',
      },
      {
        platform: 'twitter',
        text: 'Turso now has 200k databases created. Each one lives at the edge, close to the user it serves. The future of databases is distributed.',
        engagement: '4.3k likes',
        context: 'milestone',
      },
    ],
    milestones: [
      {
        label: 'libSQL fork announcement',
        description: 'Forking SQLite itself was controversial — drove HN front page and tech press coverage',
        timeframe: 'Month 1',
      },
      {
        label: 'Public launch',
        description: 'HN Show HN + Twitter thread explaining the edge database model drove 5k signups',
        timeframe: 'Month 3',
      },
      {
        label: '100k databases',
        description: 'Milestone tweet showing growth velocity attracted VC and enterprise attention',
        timeframe: 'Month 7',
      },
      {
        label: '$32M Series A',
        description: 'Sequoia-led round validated the edge database category, drove press coverage',
        timeframe: 'Year 1',
      },
    ],
    lessons: [
      'Fork a famous project if your fork is justified',
      'Edge + SQLite = content that writes itself',
      'Milestone tweets build social proof',
      'Controversial architectural decisions = free HN',
      'Name the deployment model in your tagline',
    ],
    channelNotes:
      'Turso leaned into the controversy of forking SQLite — the technical boldness made it newsworthy. Milestone tweets (100k databases, 200k databases) maintained cadence without needing new features to announce.',
  },
]
