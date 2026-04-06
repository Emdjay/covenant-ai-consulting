import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "From AI website widgets to full workflow audits and implementation. Transparent pricing for every stage.",
};

interface Tier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const TIERS: Tier[] = [
  {
    name: "AI Widget",
    price: "$99-299",
    period: "/month",
    description: "A branded AI chat agent on your website that handles customer questions, captures leads, and books appointments 24/7.",
    features: [
      "Branded AI chat widget",
      "Custom knowledge base",
      "Lead capture & notifications",
      "Booking integration",
      "Email sequence automation",
      "Weekly knowledge-gap reports",
      "Monthly analytics digest",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Workflow Audit",
    price: "$5K-15K",
    period: "one-time",
    description: "Two-week passive capture + AI analysis of your team's workflows. Produces a scored opportunity matrix with ROI projections.",
    features: [
      "Capture agent deployed to team",
      "2-week passive recording period",
      "AI-powered workflow mapping",
      "Time heatmap analysis",
      "Bottleneck identification",
      "Opportunity matrix with ROI scores",
      "Executive presentation of findings",
      "Prioritized recommendation report",
    ],
    cta: "Book a Call",
    highlight: true,
  },
  {
    name: "AI Implementation",
    price: "$10K-50K+",
    period: "per project",
    description: "We build the automations identified in the audit — AI agents, integrations, workflow engines — deployed and measured against baseline.",
    features: [
      "Custom AI agent development",
      "API integrations between systems",
      "Workflow automation pipelines",
      "Document AI (extraction/generation)",
      "Communication AI with approval gates",
      "Team training & documentation",
      "Impact measurement vs. baseline",
      "30-day post-launch support",
    ],
    cta: "Book a Call",
    highlight: false,
  },
  {
    name: "AI Operations",
    price: "$2K-5K",
    period: "/month",
    description: "Ongoing optimization of your AI systems, new opportunity discovery, and quarterly re-audits to keep improving.",
    features: [
      "Monthly performance reviews",
      "System monitoring & maintenance",
      "New automation opportunities",
      "Quarterly workflow re-audit",
      "Priority support",
      "Training for new team members",
      "Scaling existing automations",
    ],
    cta: "Book a Call",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Pricing
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-cream sm:text-5xl">
              Services for Every Stage
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/60">
              Start with an AI widget, scale to full workflow transformation.
              Every engagement is scoped to deliver measurable ROI.
            </p>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-8 ${
                  tier.highlight
                    ? "border-gold bg-white shadow-lg shadow-gold/5"
                    : "border-navy/5 bg-white"
                }`}
              >
                {tier.highlight && (
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
                    Most Popular
                  </p>
                )}
                <h3 className="font-heading text-xl font-bold text-navy">
                  {tier.name}
                </h3>
                <div className="mt-4">
                  <span className="font-heading text-3xl font-bold text-navy">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-sm text-navy/40">
                    {tier.period}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-navy/60">
                  {tier.description}
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-navy/70">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/book"
                    className={`block rounded-lg px-6 py-3 text-center font-semibold transition-all ${
                      tier.highlight
                        ? "bg-gold text-navy hover:bg-gold-light"
                        : "bg-navy text-cream hover:bg-navy-light"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ-style note */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-navy">
            Not sure which tier is right?
          </h2>
          <p className="mt-4 text-navy/60">
            Most clients start with a <strong>Workflow Audit</strong> — it shows
            you exactly where the opportunities are and how much you&apos;ll save.
            No commitment to implementation until you see the numbers.
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="inline-block rounded-lg bg-navy px-8 py-4 font-semibold text-cream transition-all hover:bg-navy-light"
            >
              Book a Free Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
