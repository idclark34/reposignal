# ForkPulse

**Turn your GitHub repo into a build-in-public content engine.**

ForkPulse connects to your GitHub account, reads your code and repo data, searches Hacker News for real pain points your project addresses, and uses Claude to generate an intelligence report — including positioning advice, launch channels, content ideas, and deployment recommendations.

---

## What it does

1. **Scans your repo** — reads your README, recent commits, open issues, topics, contributors, and language breakdown via the GitHub API
2. **Searches Hacker News** — finds stories and comments where people are talking about the exact problems your project solves
3. **Generates an intelligence report** — Claude synthesizes everything into 7 actionable sections:
   - **ICP** — who your actual target user is, based on real issue and commit data
   - **Positioning Angle** — the single strongest hook to lead with
   - **Top 3 Launch Channels** — ranked by evidence in the data, with platform-specific angles
   - **Show HN Headlines** — 3 candidate titles for a Hacker News launch post
   - **Build-in-Public Content** — 5 specific tweet/post ideas grounded in real community language
   - **Timing Recommendation** — whether your repo is ready to launch publicly based on activity signals
   - **Gaps & Risks** — what the data says is missing or risky about your current positioning

---

## Tech stack

- **Next.js 15** (App Router)
- **NextAuth** — GitHub OAuth
- **Anthropic Claude** (`claude-sonnet-4-6`) — report synthesis
- **GitHub API** — repo data, commits, issues, README
- **Hacker News Algolia API** — community signal search

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/forkpulse.git
cd forkpulse
npm install
```

### 2. Create a GitHub OAuth App

1. Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set the Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
3. Copy the **Client ID** and generate a **Client Secret**

### 3. Set environment variables

Create a `.env.local` file:

```env
# GitHub OAuth (from step 2)
GITHUB_ID=your_client_id
GITHUB_SECRET=your_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret   # generate with: openssl rand -base64 32

# Anthropic (get from console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Optional: GitHub personal access token for higher API rate limits
GITHUB_TOKEN=
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to production

### Environment variables

Set all five variables from `.env.local` in your hosting platform, with these changes:

```env
NEXTAUTH_URL=https://yourdomain.com
```

### Update your GitHub OAuth App

In your GitHub OAuth App settings, add your production URL as an additional callback:

```
https://yourdomain.com/api/auth/callback/github
```

### Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Deploying to Google Cloud Run

```bash
gcloud run deploy forkpulse \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXTAUTH_URL=https://yourdomain.com,...
```

---

## Project structure

```
app/
  page.tsx                  # Landing page
  dashboard/[owner]/[repo]/ # Analysis dashboard
  api/
    auth/[...nextauth]/     # GitHub OAuth
    sources/github/         # GitHub data fetcher
    sources/hn/             # Hacker News fetcher
    synthesize/             # Claude synthesis endpoint
    analyze/                # Combined analysis endpoint
components/
  AnalysisProgress.tsx      # Live scan UI
  DashboardView.tsx         # Results layout
  MarketingReport.tsx       # Claude report renderer
  GitHubAuth.tsx            # Sign-in / repo picker
lib/
  auth.ts                   # NextAuth config
  github.ts                 # GitHub API client
  hn.ts                     # HN Algolia client
  synthesize.ts             # Claude prompt + API call
```
