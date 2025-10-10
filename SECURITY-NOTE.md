Secret hygiene and CI unblock notes

Summary
- Removed committed environment files (.env.local, .env.local.backup) from the repo to resolve secret scanner failures.
- Runtime environments should be configured via Vercel/Supabase/Stripe/Resend project settings, not committed files.

What changed
- Deleted: .env.local and .env.local.backup (contained Supabase keys and other secrets)
- .gitignore already ignores .env* by default; keep secrets out of git.

What to do next
1) Rotate keys that were committed in history (recommended):
   - Supabase: rotate Service Role key and Anon key in Project Settings → API, then update Vercel env vars.
   - Resend: generate a new API key; update production and preview envs.
   - Stripe: if any test/secret keys appeared, rotate in Dashboard → Developers → API keys.
2) Add environment variables in Vercel Project Settings for Production/Preview/Development.
3) If GitGuardian is a required check, re-run the PR checks after rotation and the commit removal.

Notes
- Keep an example template in .env.example only; never commit real values.
- For local dev, create .env.local (git-ignored) with your own keys.
