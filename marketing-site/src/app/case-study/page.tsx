import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Study — How We Automated an Entire Business with AI",
  description:
    "Covenant Sites went from 22-31 hours/week of manual operations to ~2.5 hours using Enoch, an autonomous AI business agent. See the real numbers.",
};

const BEFORE_AFTER = [
  { task: "Lead tracking & scoring", before: "3-4 hrs", after: "~0 (automated)", saved: "3-4 hrs" },
  { task: "Email communication", before: "5-6 hrs", after: "~1 hr (review drafts)", saved: "4-5 hrs" },
  { task: "Proposals", before: "3-4 hrs", after: "~30 min (review AI draft)", saved: "2.5-3.5 hrs" },
  { task: "Follow-ups", before: "2-3 hrs", after: "~0 (automated queue)", saved: "2-3 hrs" },
  { task: "Invoicing & payments", before: "2-3 hrs", after: "~15 min (webhook-driven)", saved: "1.75-2.75 hrs" },
  { task: "Client onboarding", before: "3-4 hrs", after: "~30 min (automated flow)", saved: "2.5-3.5 hrs" },
  { task: "Scheduling", before: "1-2 hrs", after: "~0 (self-service)", saved: "1-2 hrs" },
  { task: "Project tracking", before: "2-3 hrs", after: "~15 min (dashboard)", saved: "1.75-2.75 hrs" },
  { task: "Analytics review", before: "1-2 hrs", after: "~0 (integrated)", saved: "1-2 hrs" },
] as const;

const BUILD_STATS = [
  { value: "146", label: "Git commits" },
  { value: "157", label: "API endpoints" },
  { value: "37", label: "Dashboard pages" },
  { value: "25+", label: "Database tables" },
  { value: "8", label: "AI agents" },
  { value: "3 weeks", label: "Build time" },
] as const;

const CAPABILITIES = [
  {
    title: "Lead Management",
    items: [
      "Auto-captures leads from website, chat widget, and intake forms",
      "Scores leads based on business signals",
      "Enrolls into drip sequences automatically",
      "Tracks visitor journey from first touch to conversion",
    ],
  },
  {
    title: "Proposals & Sales",
    items: [
      "AI-generated PDF/HTML proposals",
      "A/B tests subject lines for open rates",
      "Tracks views with pixel analytics",
      "3 automated follow-ups (cancels on reply)",
    ],
  },
  {
    title: "Payments",
    items: [
      "Stripe-integrated checkout per tier",
      "Webhook-driven status updates",
      "Deposit → MSA → timeline triggered automatically",
      "Multi-phase payment tracking (deposit/mid/final)",
    ],
  },
  {
    title: "Client Lifecycle",
    items: [
      "Auto-sends onboarding questionnaire",
      "Generates MSA for e-signature",
      "Creates project timelines with milestones",
      "Client portal for deliverables and messaging",
    ],
  },
  {
    title: "Communication",
    items: [
      "AI drafts all outbound emails",
      "Human approves before anything sends",
      "Smart follow-up queue with scheduling",
      "Meeting prep memos before calls",
    ],
  },
  {
    title: "AI Chat Product",
    items: [
      "Embeddable widget for client websites",
      "Custom knowledge base per client",
      "Lead capture directly from conversations",
      "Weekly knowledge-gap digest to owners",
    ],
  },
] as const;

export default function CaseStudy() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Case Study
            </p>
            <h1 className="mt-4 font-heading text-3xl font-bold text-cream sm:text-4xl lg:text-5xl">
              How We Automated an Entire Business with AI
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/60">
              Covenant Sites went from 22-31 hours/week of manual operations to
              ~2.5 hours. Here are the real numbers.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-heading text-3xl font-bold text-navy">The Problem</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy/60">
            <strong className="text-navy">Covenant Sites</strong> is a web-design
            studio building premium websites from $999 to $6,999. Like most small
            service businesses, every operational task was manual — leads tracked
            in spreadsheets, emails written one by one, proposals designed from
            scratch, follow-ups remembered (or forgotten), and payments chased via
            text message.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-navy/60">
            The founder was spending <strong className="text-navy">22-31 hours per week</strong> on
            operations — time that wasn&apos;t spent on design work or growing the business.
          </p>
        </div>
      </section>

      {/* What Was Built */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-heading text-3xl font-bold text-navy">
              The Solution: Enoch
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-navy/60">
              We built <strong className="text-navy">Enoch</strong> — an autonomous AI
              business agent with 8 specialized sub-agents that manage the entire
              operation from lead capture through project delivery.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="rounded-xl border border-navy/5 bg-cream p-6">
                <h3 className="font-heading text-lg font-bold text-navy">
                  {cap.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {cap.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-navy/60">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Stats */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-heading text-2xl font-bold text-cream">
            Built in 3 Weeks
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {BUILD_STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-cream/10 bg-cream/[0.03] p-5 text-center">
                <p className="font-heading text-2xl font-bold text-gold">{stat.value}</p>
                <p className="mt-1 text-xs text-cream/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Table */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-heading text-3xl font-bold text-navy">The Results</h2>
          <p className="mt-4 text-lg text-navy/60">
            Weekly time spent on operations — before and after Enoch.
          </p>
          <div className="mt-10 overflow-x-auto rounded-xl border border-navy/10">
            <table className="w-full text-sm">
              <thead className="border-b border-navy/10 bg-navy text-cream">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Task</th>
                  <th className="px-5 py-3 text-right font-semibold">Before</th>
                  <th className="px-5 py-3 text-right font-semibold">After</th>
                  <th className="px-5 py-3 text-right font-semibold">Saved</th>
                </tr>
              </thead>
              <tbody>
                {BEFORE_AFTER.map((row, i) => (
                  <tr
                    key={row.task}
                    className={i % 2 === 0 ? "bg-white" : "bg-cream"}
                  >
                    <td className="px-5 py-3 font-medium text-navy">{row.task}</td>
                    <td className="px-5 py-3 text-right text-navy/50">{row.before}</td>
                    <td className="px-5 py-3 text-right text-navy/50">{row.after}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gold-muted">{row.saved}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-navy/20 bg-navy">
                  <td className="px-5 py-3 font-bold text-cream">Total</td>
                  <td className="px-5 py-3 text-right font-bold text-cream/60">22-31 hrs</td>
                  <td className="px-5 py-3 text-right font-bold text-cream/60">~2.5 hrs</td>
                  <td className="px-5 py-3 text-right font-bold text-gold">~20-28 hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-sm text-navy/40">
            The remaining 2.5 hours is intentional — reviewing AI drafts,
            approving proposals, and making strategic decisions.
          </p>
        </div>
      </section>

      {/* Key Takeaway */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-navy">
            80-90% of operational time eliminated
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-navy/60">
            One founder now runs a business that would traditionally require 3-4
            people. The AI handles operations. The human handles strategy,
            creativity, and relationships — the things that actually grow a
            business.
          </p>
          <div className="mt-10">
            <Link
              href="/book"
              className="inline-block rounded-lg bg-navy px-8 py-4 font-semibold text-cream transition-all hover:bg-navy-light"
            >
              Find Out What AI Can Do for You
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
