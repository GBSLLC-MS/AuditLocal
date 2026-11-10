# SCRIPTS Guided Discovery — Master Playbook v1 (2026-11-10)

## Scope and safeguards
Internal consulting method; public repository contains non-secret operating specifications only. AuditLocal's website audit is the entry point to broader custom business consulting. The owner's separate property-management application is not part of AuditLocal. Do not expose internal analysis, private customer records, credentials, or agent prompts on customer pages.

## SCRIPTS
S — SWOT Scan; C — Context; R — Role; I — Interview; P — Plan & Playbook; T — Task, Test & Track; S — Service the Problem. Repeat the SWOT scan after service and testing.

## Guided Discovery conversation
Engage → Explore → Enable Ideas → Gain Commitment → Follow Up. Natural, respectful, adaptive conversation, one question at a time. Identify outcomes before suggesting AI tools. Do not manufacture findings or promise results.

## Twelve physical/digital benefit cards
Front | Back
---|---
More Sales | Increase revenue and close more deals.
More Customers | Attract new clients and generate leads.
Save Time | Reduce busywork and speed up tasks.
Cash Flow | Get paid faster and manage incoming money.
Lower Costs | Reduce expenses and improve profit.
Better Quality | Reduce mistakes, delays, and rework.
Stronger Team | Improve training, productivity, and accountability.
Business Growth | Expand services and handle more business.
Less Risk | Protect the business and prevent costly problems.
Happy Customers | Improve service, loyalty, and reputation.
Stay Organized | Track inventory, orders, records, and processes.
Better Technology | Improve tools, systems, and automation.

Physical card target: 3.5 x 2 inches, short title front and sentence back. Digital interface should let an owner choose three and rank the most important.

## Five-question intake
1. What does your business do and who do you serve?
2. Which three benefit cards matter most, and which is number one?
3. What's stopping you from achieving that today?
4. What have you tried, and what happened?
5. What would success look like in 90 days?
Ask tailored follow-ups to verify the root cause and estimate baseline impact. Allow opt-out and human handoff.

## Private data model (proposed, not implemented)
Discovery: id, business_id, consent_status, created_at, industry, service_area, contact, selected_benefits[3], top_benefit, stated_problem, verified_bottleneck, evidence, previous_attempts, desired_90_day_outcome, next_step, owner, status. KPI: name, baseline, target, unit, measurement_method, review_date, actual, source. Store only necessary data and apply server-side access controls and retention policy.

## Dashboard KPIs
Lead-to-discovery conversion; discoveries completed; qualified leads; proposal acceptance; implementation cycle time; monthly recurring revenue. Client KPIs vary: HVAC missed calls and appointments; embroidery inventory accuracy and order turnaround; property management response times and maintenance completion. Report baseline, target, actual and evidence; do not label projections as measured gains.

## Three scenario acceptance tests
HVAC: prioritizes More Customers, asks about missed calls, after-hours volume, booked appointments and consent for callbacks.
Embroidery: prioritizes Stay Organized, asks about stock location, inventory variance, orders and rework.
Property management: prioritizes Save Time, asks about maintenance intake, response time and reporting, without offering the owner's internal proprietary app.
All: identify top three and rank one, ask adaptive questions, avoid false audit findings, secure consent, preserve client isolation, save lead only after verified server response, and show authorized record in admin dashboard.

## Implementation sequence and gates
1. Locate authoritative deployed source, DB schema, hosting access, backups and staging deployment. The GitHub repo currently documents a migration; it is not verified production code.
2. Test existing public intake, admin authentication, persistence, authorization, and recovery without modifying production data.
3. Create an isolated development branch and staging-only backend endpoints for discovery and KPI storage; test authorization and consent.
4. Adapt existing ElevenLabs AuditLocal Private Demo agent with short guided discovery, only after confirming prompt/voice configuration and staging integration.
5. Add widget to staging; test voice, text fallback, lead save, and three scenarios end to end.
6. Conduct owner acceptance test; only then approve production rollout. Do not claim a live integration before test evidence.

## Status on 2026-11-10
Playbook drafted; connected GitHub repository confirmed public and documentation-only. Existing ElevenLabs agent 'AuditLocal Private Demo' found; its current prompt is a general concierge and has no configured tool IDs or data collection fields. Live deployment source, staging backend, database persistence, and site embed remain unverified. No customer-facing deployment authorized by this document.
