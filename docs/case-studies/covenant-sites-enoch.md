# Case Study: How We Automated an Entire Business with AI

## Covenant Sites — From Manual Operations to Autonomous AI Agent

> "We didn't just talk about AI transformation. We did it to ourselves first.
> Then we measured every hour saved."

---

## The Business

**Covenant Sites** is a web-design studio that builds premium websites for businesses,
ranging from single-page sites ($999) to full AI-powered experiences with branded
chat agents ($6,999). The operation includes lead generation, proposals, payments,
client onboarding, project management, and post-launch support.

**Team size:** 1 founder + AI

---

## The Problem (Before)

Like most small service businesses, every operational task was manual:

| Task | How It Was Done | Time/Week |
|------|----------------|-----------|
| Lead tracking | Spreadsheet + memory | 3-4 hrs |
| Email communication | Manually written and sent, one by one | 5-6 hrs |
| Proposals | Designed in docs/Canva, manually sent | 3-4 hrs |
| Follow-ups | Remembered (or forgotten) | 2-3 hrs |
| Invoicing & payments | Manual Stripe links via email | 2-3 hrs |
| Client onboarding | Manual emails, calls, back-and-forth | 3-4 hrs |
| Scheduling | Email chains to find times | 1-2 hrs |
| Project tracking | Mental notes, scattered docs | 2-3 hrs |
| Analytics review | Manually checking Google Analytics | 1-2 hrs |

**Estimated total: 22-31 hours/week on operations** — time that wasn't spent
on actual design work or growing the business.

The biggest pain points:
- **Leads falling through the cracks** — no system to score or prioritize
- **Follow-ups forgotten** — prospects went cold because nobody remembered to check in
- **Inconsistent client experience** — onboarding steps varied project to project
- **Payment delays** — manual invoicing meant chasing payments
- **No visibility** — no dashboard, no metrics, no way to see the business at a glance

---

## The Solution: Enoch

We built **Enoch** — an autonomous AI business agent that manages the entire
operation from lead capture through project delivery.

### What Enoch Does

**Lead Management (fully automated)**
- Captures leads from website contact forms, AI chat widget, and intake forms
- Scores leads automatically based on business signals
- Enrolls qualified leads into drip email sequences
- Tracks visitor journeys from first touch to conversion
- Sends webhook notifications for high-priority leads

**Proposals (AI-generated, human-approved)**
- Generates professional PDF/HTML proposals with pricing, scope, and timelines
- A/B tests email subject lines for higher open rates
- Tracks proposal views with pixel-level analytics
- Sends 3 automated follow-ups (3, 7, and 14 days) — cancels if the prospect replies
- One-click convert to client when the proposal is accepted

**Payments (Stripe-integrated, event-driven)**
- Generates payment links per tier with correct split amounts
- Stripe webhook auto-updates payment status on receipt
- Triggers downstream actions: deposit received → generate MSA → create timeline
- Handles deposit, mid-project, and final payments for multi-phase projects
- Tracks revenue, expenses, and generates financial summaries

**Client Lifecycle (end-to-end automation)**
- Auto-sends onboarding questionnaire after payment
- Generates Master Service Agreements for e-signature
- Creates project timelines with milestones and deadlines
- Sends milestone completion emails as work progresses
- Provides client portal access with deliverables, payments, and messaging
- Triggers satisfaction checks at key project stages

**Communication (AI-drafted, human-controlled)**
- Drafts all outbound emails — founder reviews and approves before sending
- Manages follow-up queue with smart scheduling
- Cancels follow-ups automatically when a prospect replies
- Handles drip unsubscribe/stop/resume per contact
- Meeting prep memos generated before client calls

**Calendar & Booking**
- Configurable availability slots
- Client self-service booking with conflict detection
- Calendar management with event CRUD operations

**Analytics & Operations**
- Real-time dashboard with pipeline metrics and trends
- Google Analytics integration for website performance
- Revenue tracking with P&L and tax summaries
- Activity logging for full operational audit trail
- System health monitoring

**Covenant AI — Branded AI Chat Product**
- Embeddable AI chat widget deployed to client websites
- Custom knowledge base per client with training interface
- Lead capture directly from chat conversations
- Booking integration from chat context
- Automated email sequences triggered by chat events
- Knowledge gap detection with weekly digest to site owners

---

## By The Numbers

### What We Built (in 3 weeks)

| Metric | Count |
|--------|-------|
| Git commits | 146 |
| API endpoints (dashboard) | 157 |
| Dashboard pages | 37 |
| Database tables (Enoch) | 25 |
| Database tables (Covenant AI) | 11 |
| Specialized AI agents | 8 |
| Automated background jobs | 6 |
| Stripe webhook handlers | 4 |
| Email sequence triggers | 3 |

### Time Impact (estimated weekly savings)

| Task | Before | After | Saved |
|------|--------|-------|-------|
| Lead tracking & scoring | 3-4 hrs | ~0 (automated) | 3-4 hrs |
| Email communication | 5-6 hrs | ~1 hr (review + approve) | 4-5 hrs |
| Proposals | 3-4 hrs | ~30 min (review AI draft) | 2.5-3.5 hrs |
| Follow-ups | 2-3 hrs | ~0 (automated queue) | 2-3 hrs |
| Invoicing & payments | 2-3 hrs | ~15 min (webhook-driven) | 1.75-2.75 hrs |
| Client onboarding | 3-4 hrs | ~30 min (automated flow) | 2.5-3.5 hrs |
| Scheduling | 1-2 hrs | ~0 (self-service booking) | 1-2 hrs |
| Project tracking | 2-3 hrs | ~15 min (dashboard glance) | 1.75-2.75 hrs |
| Analytics review | 1-2 hrs | ~0 (integrated dashboard) | 1-2 hrs |
| **Total** | **22-31 hrs** | **~2.5 hrs** | **~20-28 hrs/week** |

**That's roughly 80-90% of operational time eliminated.**

The remaining 2.5 hours is intentional — reviewing AI email drafts, approving
proposals, and making strategic decisions. The human stays in the loop where
judgment matters.

---

## The Architecture

- **8 specialized AI agents** — each handles a domain (scouting, proposals, email, outreach, prep, bookkeeping, memory, timelines)
- **Orchestrator** — coordinates agent scheduling with configurable intervals
- **Dashboard** — 37-page FastAPI admin interface for full operational control
- **Client Portal** — self-service portal for clients to view deliverables, payments, and messages
- **Covenant AI engine** — separate Node.js service powering the branded AI chat product
- **Infrastructure** — Docker Compose on VPS, GitHub Actions CI/CD, Stripe webhooks, SMTP integration

---

## Key Design Decisions

1. **Human-in-the-loop for all outbound communication.** Enoch drafts; the founder approves. Nothing sends without explicit consent. This builds trust and prevents AI mistakes from reaching clients.

2. **Event-driven architecture.** Stripe payment → webhook → triggers MSA generation → triggers timeline creation → triggers onboarding email. Each step flows automatically from the previous one.

3. **Single-person operation.** The system was designed so one person can run a business that would traditionally need 3-4 people (sales, project management, admin, bookkeeping).

4. **The AI product IS the proof.** Covenant AI — the branded chat widget sold to clients — runs on the same infrastructure that powers the consulting business. Clients see it working on their own site and ask for more.

---

## What This Means for Your Business

Every business has the same types of operational friction:
- Repetitive data entry between systems
- Communication that follows predictable patterns
- Follow-ups and scheduling that consume disproportionate time
- Tracking and reporting that requires manual assembly
- Onboarding processes that vary when they shouldn't

We didn't just theorize about AI automation. We built a system that runs our own
business, measured the results, and now we bring that same methodology to yours.

**The question isn't whether AI can help your business. It's where it helps most
and how fast you can get there.**

---

*Covenant AI Consulting — [covenantai.consulting](https://covenantai.consulting)*
*We discover your workflow. We diagnose the bottlenecks. We build the solution.*
