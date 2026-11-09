# AuditLocal ChatGPT Builder → GitHub Migration Checklist

**Status:** Source migration not completed. GitHub repository is public. Do not deploy from these docs.

## What is known

- The existing AuditLocal apps were built using ChatGPT's website builder.
- The two previously reported site addresses are:
  - https://auditlocal.boldgpt.chatgpt.site
  - https://auditlocal-script-staging.boldgpt.chatgpt.site
- Production, staging and any internal management site are distinct environments.
- Exact source repository, hosting project, backend, database engine, admin auth strategy and environment variables are not confirmed.
- Current GitHub repository began empty; no live application code was found here at the time of initialization.

## To obtain a complete, *safe* backup

- [ ] Open the original ChatGPT website builder project, find the latest source/code export or GitHub integration.
- [ ] Identify the exact deployed version for production and staging; capture release tags/commit IDs if available.
- [ ] Export code and non-secret dependency manifests to a temporary **private** workspace/repository first.
- [ ] Remove any secrets, API keys, admin passwords, webhook tokens, personal information, customer records, private prompts/scoring logic, or internal-only methodology.
- [ ] Review Git history and large files for past secret exposure, not just the current files.
- [ ] Decide what public-facing code/docs may be published to this public repository.
- [ ] Create separate secure backup instructions for database schema, migrations and encrypted private data snapshots; never place live data in public GitHub.
- [ ] Inventory external integrations (ElevenLabs, notifications, forms, calendar, CRM, payments); save only **variable names**, not values.
- [ ] Record build, test, deployment and rollback steps.
- [ ] Test restored source in a separate staging sandbox with synthetic leads.
- [ ] Confirm auth, lead storage, permissions, mini-audit scoring, admin exports and reports before any production change.

## Minimal environment-variable template (names only)

Use a private deployment secrets manager, not a committed real .env file.

- DATABASE_URL
- SESSION_SECRET
- ADMIN_AUTH_PROVIDER (if applicable)
- ELEVENLABS_AGENT_ID
- ELEVENLABS_API_KEY
- EMAIL_PROVIDER_API_KEY
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID
- PUBLIC_SITE_URL

Names are illustrative. Confirm actual code before adding/configuring variables.

## Admin password recovery

A newly created GitHub repository does **not** reveal or reset the existing AuditLocal admin password. Investigate the original builder's settings and auth implementation. Prefer authorized recovery/reset workflows; never disable admin auth or publicize credentials as a workaround.

## Protection policy

Never upload customer records, actual passwords, secret environment values, private security configurations, copyrighted third-party assets without permission, or client-specific findings to this public repository.
