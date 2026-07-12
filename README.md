# The Lean Kitchen Edit

*Eat Simple. Live Lean. Feel Good.*

A Next.js (App Router) + Tailwind CSS blog with a built-in, WordPress-style admin panel at
`/admin` — add, edit, delete, and publish posts, upload photos, and edit homepage/About text,
all from a browser on your phone or computer. No code editing required for day-to-day content.

## How the admin panel works

There's no database. Every save in `/admin` commits the change straight to this GitHub repo
using the GitHub API, which triggers Vercel's normal auto-deploy — so changes go live
automatically, usually within **1–2 minutes**. Your content (`content/posts.json`,
`content/site.json`, `content/about.json`) stays fully version-controlled in git, same as the
code.

## One-time setup: enabling the admin panel

The admin panel needs a few things set as **environment variables in Vercel** (not in a
committed file — keep these out of git):

1. Go to your project on **vercel.com** → **Settings** → **Environment Variables**
2. Add each of these (see `.env.example` for the full list with descriptions):

   | Variable | Value |
   |---|---|
   | `ADMIN_PASSWORD` | A password only you know — this logs you into `/admin` |
   | `ADMIN_SESSION_SECRET` | Any random string (mixed into the login cookie) |
   | `GITHUB_TOKEN` | A GitHub personal access token — see below |
   | `GITHUB_OWNER` | Your GitHub username |
   | `GITHUB_REPO` | This repo's name |
   | `GITHUB_BRANCH` | `main` |

3. **Generate the GitHub token:**
   - On github.com → your profile photo → **Settings**
   - **Developer settings** (bottom of the left sidebar) → **Personal access tokens** →
     **Fine-grained tokens** → **Generate new token**
   - Under **Repository access**, choose **Only select repositories** and pick this repo
   - Under **Permissions** → **Repository permissions**, set **Contents** to **Read and write**
   - Generate, then copy the token into the `GITHUB_TOKEN` variable in Vercel

4. Back in Vercel, go to **Deployments** and redeploy once (top right menu → Redeploy) so the
   new environment variables take effect.

5. Visit `yoursite.vercel.app/admin` and log in with your `ADMIN_PASSWORD`.

## Using the admin panel

- **Dashboard** (`/admin`) — see every post, its published/draft status, edit or delete it, or
  create a new one.
- **New/Edit Post** — title, URL slug, category, excerpt, meta description, a hero photo upload
  (auto-resized so it fits GitHub's upload limits), quick facts (prep time/servings/calories/
  tags), the article body (plain text with `## Heading` for section titles and `- item` for
  bullets), repeatable recipe cards (ingredients/steps, one per line), and a repeatable FAQ
  section. Toggle **Published** to make a post go live — drafts stay hidden from the public
  site.
- **Homepage Text** (`/admin/settings`) — edit the hero headline, subheading, and newsletter
  section text shown on the homepage.
- **About Page** (`/admin/about`) — edit the About page headline and body.

Everything else (Contact, FAQ, Privacy Policy, Disclaimer, Terms of Use, Affiliate Disclosure)
is still edited in code for now, since those change rarely and some carry legal wording you may
want to review carefully before publishing changes. Ask if you'd like any of those made editable
from `/admin` too — the same pattern extends easily.

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The admin panel also works locally if you add the same
environment variables to a local `.env.local` file (never commit this file).

## Deploying — GitHub + Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Import into Vercel** at [vercel.com/new](https://vercel.com/new) — it auto-detects Next.js.
   Add the environment variables above before or after the first deploy (redeploy once you add
   them).

3. Every push to `main` — whether from you editing code, or from the admin panel committing a
   content change — triggers a new deploy automatically.

## Project structure

```
app/(site)/       — public pages (home, blog, about, contact, legal pages)
app/admin/         — the admin panel UI
app/api/admin/     — API routes the admin panel calls (posts, settings, about, image upload)
components/        — shared UI (ShareButtons, RecipeCard, FaqBlock, Header, Footer, etc.)
components/admin/  — admin-only UI (PostEditor)
content/           — the editable JSON "database": posts.json, site.json, about.json
lib/               — data-reading helpers, GitHub API client, auth
public/images/     — uploaded photos land here automatically
```

## Security notes

- The admin panel is protected by a single shared password (`ADMIN_PASSWORD`) — good for a
  one-person blog. If you ever want multiple editors with separate logins, that's a bigger
  upgrade (e.g. NextAuth) — ask if you'd like help with that later.
- Keep your `GITHUB_TOKEN` scoped to just this repo with only Contents read/write permission —
  never paste it anywhere outside Vercel's environment variables.
- If you ever suspect your admin password or GitHub token has leaked, rotate both immediately:
  generate a new fine-grained token (and delete the old one on GitHub), and change
  `ADMIN_PASSWORD` in Vercel.

## Before you go live

- [ ] Set all the environment variables above and confirm `/admin` logs in successfully
- [ ] Replace the Formspree placeholder in the Contact page with your real form endpoint
- [ ] Generate a real Privacy Policy (Termly / PrivacyPolicies.com) and update
      `app/(site)/privacy-policy/page.tsx`
- [ ] Publish your remaining draft posts from `/admin`
- [ ] Add Google Analytics / AdSense scripts once you have your property IDs
- [ ] Have 15–20 published, 1,200+ word posts live before applying for AdSense
