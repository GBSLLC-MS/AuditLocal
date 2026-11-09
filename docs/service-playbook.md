# AuditLocal Service Delivery Playbook — Draft

**Status:** Planning document, not a contract or representation of verified functionality. Updated 2026-11-09.

## SCRIPTS operating cycle

1. **SWOT:** Review platform strengths, cost exposure, conversion weaknesses, security risks, and growth opportunities.
2. **Context:** Establish client goals, current tools, locations, approved data, and constraints.
3. **Role:** Assign product owner, engineer, AI operations, local visibility advisor, and customer success responsibilities.
4. **Interview:** Ask only for missing client business facts, authorized integrations, consent, and success measures.
5. **Plan & Playbook:** Define package, onboarding checklist, responsibilities, acceptance criteria, support allowance and fees.
6. **Task, Test & Track:** Implement only authorized work; record proof of tests, actual costs, issues, milestones and ownership.
7. **Service the Problem:** Repair failures; verify fixes, re-run SWOT and update operating plan.

## Service packages — proposed, not finalized

All figures are USD. Monthly cost figures below are illustrative **internal delivery budgets**, not verified vendor expenses or net income. Contribution margin excludes sales/marketing, general overhead, taxes, unexpected incidents and financing costs.

| Package | Setup | Monthly | Budgeted setup cost | Budgeted monthly delivery cost | Monthly contribution margin |
|---|---:|---:|---:|---:|---:|
| Founding pilot | $500 | $199 | $250 | $65 | 67.3% |
| Starter | $750 | $249 | $375 | $85 | 65.9% |
| Growth | $1,500 | $499 | $750 | $175 | 64.9% |
| Professional | $3,500 | $899 | $1,750 | $345 | 61.6% |
| Enterprise illustration | $7,500 | $1,999 | $4,500 | $900 | 55.0% |

**Formula:** (monthly fee - actual monthly delivery cost) / monthly fee. Reprice if measured costs exceed margins.

| Limit / inclusion | Founding | Starter | Growth | Professional | Enterprise |
|---|---|---|---|---|---|
| Websites | 1 | 1 | 1 | 1 | Negotiated |
| Locations | 1 | 1 | 1 | 2 | Negotiated |
| Audit refresh | Initial | Quarterly | Monthly | Monthly | Contracted |
| AI chat sessions/month | 100 | 250 | 750 | 2,000 | Contracted |
| Website voice minutes/month | 30-minute trial | Extra charge | 200 | 500 | Contracted |
| Approved knowledge entries | 20 | 40 | 100 | 250 | Contracted |
| Standard integrations | 0 | 1 | 2 | 5 | Contracted |
| Automated workflows | 0 | 0 | 2 | 5 | Contracted |
| Human service time/month | 15 min | 30 min | 60 min | 180 min | Contracted |
| Reporting | Monthly | Monthly | Biweekly | Weekly | Contracted |
| Onboarding target | 3-5 business days | 5-7 business days | 7-14 business days | 14-28 business days | Quoted |

Chat sessions are proposed as a visitor session lasting up to 30 minutes or 20 AI replies, whichever occurs first; operational usage meters are **not verified**. Voice costs are **not measured**. An initial planning assumption was $0.15 per website voice minute and a possible customer overage of $0.35/minute; these are not promises or confirmed provider rates. Phone calls require separate telephony costs and consent controls.

### Detailed client deliverables

- **Founding pilot:** Initial audit PDF, top five prioritized recommendations, configured AI chat, up to 20 approved FAQs, lead capture, lead email alert, monthly summary and onboarding.
- **Starter:** Baseline website/local visibility review, AI chat, lead alerts, appointment booking link, one standard integration, quarterly audit refresh and monthly report.
- **Growth:** Starter plus embedded website voice, two authorized automation workflows, two integrations, lead qualification, monthly audit and biweekly report.
- **Professional:** Growth plus advanced agent configuration, up to five integrations and workflows, CRM pipeline/routing, two-location support, weekly reports and monthly strategy review.
- **Enterprise:** Paid discovery, bespoke statement of work, negotiated volumes/locations, integration map, privacy/security controls, user acceptance testing, support and reporting.

Custom website redesign, unrestricted SEO work, custom voice cloning, unlimited chat/voice use, phone-network answering and bespoke apps are excluded unless separately contracted. Always obtain lawful voice-cloning consent.

## Fulfillment SOP

1. Capture prospect intake, consent and source.
2. Produce evidence-based mini-audit without inventing findings.
3. Quote package, caps, limits, timeline and change-order rates.
4. Sign agreement / statement of work, collect approved setup payment, confirm billing commencement.
5. Create isolated client workspace; record baseline and approved business content.
6. Configure AI/chat/voice and only approved workflows in staging.
7. Test lead storage, notification delivery, answers, handoff, calendar/CRM, usage caps and isolation.
8. Obtain approval and deploy; retain rollback plan.
9. Monitor errors and costs, review conversations safely, issue contracted reports.
10. Re-audit, recommend next fix, review renewals and package fit.

## Acceptance test matrix

| Test | Passing evidence required |
|---|---|
| Public intake | Exactly one correctly scoped saved record, including timestamp/status |
| Customer email | Required for customer submission; not required for authorized admin audit |
| Admin auth | Authentication and recovery work without exposing credentials |
| Admin portal | List, filter, status update and authorized CSV export |
| Audit findings | Each check has evidence; unknown facts labeled unavailable |
| Score 0–100 | Explained weights, reproducible logic, no invented data |
| SCRIPTS private review | Not shown to customers; authorized admin access only |
| Reports / PDF | Client data correct; private notes excluded unless explicitly approved |
| Chat / voice | Approved answers, correct fallback, consent where applicable |
| Integrations | Calendar/CRM/email/Telegram test delivery with correct mapping |
| Multi-tenant security | Unrelated client cannot read or modify another client's data |
| Billing / metering | Caps and threshold notices tested, no surprise billing |
| Mobile / failure handling | Supported mobile interaction and safe error responses |

No tests in this document have been executed in the connected application. Maintain a dated test log, expected/actual result, tester and supporting evidence.

## Initial launch priorities

1. Locate original ChatGPT-built application source and hosting/admin configuration.
2. Protect public repository from secrets or client data; create private source repository if proprietary implementation is involved.
3. Verify staging lead intake and private dashboard, solve admin authentication safely.
4. Run measured ElevenLabs website-voice testing and determine real costs.
5. Complete first end-to-end pilot with a consenting business.
6. Publish only service levels proven operational.

## Business principles

AuditLocal sells **Audit → Improve → Automate → Monitor → Report → Renew**. No SEO ranking or revenue guarantees without evidence. Never claim a planned feature is deployed. Production data and permissions remain unchanged without approval.
