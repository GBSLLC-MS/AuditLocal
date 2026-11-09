# AuditLocal

AuditLocal is a proposed AI-assisted business improvement platform for local service businesses.

**Business workflow:** Audit → Improve → Automate → Monitor → Report → Renew.

> **Repository status (2026-11-09):** This repository is a documentation and migration starting point. It is **not** a confirmed backup of either deployed AuditLocal application. Source code, database schema, hosting configuration, and live data have not been exported or verified. Nothing in this repository should be described as deployed or production-ready.

## Known project environments

| Environment | URL | Purpose | Verification |
| --- | --- | --- | --- |
| Production | https://auditlocal.boldgpt.chatgpt.site | Customer-facing live application | Previously reported; not verified in this repository |
| SCRIPT staging | https://auditlocal-script-staging.boldgpt.chatgpt.site | Test environment for feature development | Previously reported; not verified in this repository |
| Operations/management dashboard | Not confirmed | Internal audit and service delivery management | URL and deployment not verified |

Do not replace production or modify existing records until code ownership, infrastructure, and end-to-end test results are confirmed.

## Planned customer-facing workflow

1. Collect business name, service, city, website, and customer's email address.
2. Allow administrator-initiated website audits without requiring the admin to enter an email; require email for customer-submitted requests.
3. Present only verified mini-audit findings, including title, meta description, H1, phone CTA, address, local service areas, FAQs, reviews, and calls to action.
4. Show an explainable **0–100 mini-audit score** with a category breakdown; score only verified checks and label unavailable checks.
5. Save each audit and its evidence to the appropriate private dashboard.
6. Let authorized administrators use a private SCRIPTS analysis to prepare a full bottleneck/revenue-opportunities report and a PDF review.
7. Keep private prompts, internal scoring details, sensitive analysis and administrative workflows hidden from public-facing pages.
8. Offer AI chat/voice only after integration, consent and end-to-end testing.

## Admin requirements

- Protected sign-in with secure password reset or recovery; never publish passwords or credential hashes.
- View/filter/search leads and audits, change statuses, and export authorized CSV data.
- Ensure public/customer intake does **not** depend on admin login.
- Separate customer-facing audit summaries from private internal review, SCRIPTS methodology and supporting evidence.
- Enforce server-side authorization and per-client data isolation.
- Preserve existing data and provide rollback guidance for changes.
- Verify emails/Telegram notifications with test accounts before promising delivery.

## Scope and planning

See [docs/service-playbook.md](docs/service-playbook.md) and [docs/migration-checklist.md](docs/migration-checklist.md).

**Important:** No secrets, client lead records, raw credentials, database dumps, private prompts, or API tokens belong in this public repository.
