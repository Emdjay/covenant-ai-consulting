import Link from "next/link";

const STATS = [
  { value: "80-90%", label: "Operational time eliminated" },
  { value: "157", label: "API endpoints automated" },
  { value: "3 weeks", label: "From zero to full system" },
  { value: "~28 hrs", label: "Saved per week" },
] as const;

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description:
      "We install a lightweight capture agent on your team's machines (with full consent). For two weeks, it passively records workflows — app usage, screen activity, context switches, data movement between systems.",
    detail: "No consultants hovering. No disruption. Just quiet observation.",
  },
  {
    number: "02",
    title: "Diagnose",
    description:
      "Our AI engine analyzes the captured data to build a complete picture of how your business actually operates — not how you think it operates.",
    detail:
      "Repetitive tasks, bottlenecks, manual data transfer, approval delays — all surfaced automatically with time-impact estimates.",
  },
  {
    number: "03",
    title: "Design & Build",
    description:
      "We present a scored opportunity matrix showing exactly where AI automation delivers the highest ROI. Then we build it.",
    detail:
      "Not a PDF of suggestions. Working automation — custom AI agents, data integrations, workflow engines — deployed and measured.",
  },
] as const;

const PAIN_POINTS = [
  "Your team copies data between spreadsheets and CRMs by hand",
  "Follow-ups and reminders live in someone's memory",
  "Onboarding new clients means 20 emails that look the same every time",
  "Reports take hours to compile from scattered sources",
  "Scheduling requires 5 back-and-forth messages",
  "You know AI could help, but you don't know where to start",
] as const;

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-28 sm:py-36">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              AI Workflow Consulting
            </p>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-cream sm:text-5xl lg:text-6xl">
              We find where AI fits{" "}
              <span className="text-gold">your business</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/60 sm:text-xl">
              We passively capture your team&apos;s real workflow, use AI to map
              every bottleneck, and build automations that save 20+ hours per
              week. Proven on our own business first.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/book"
                className="w-full rounded-lg bg-gold px-8 py-4 text-center font-semibold text-navy transition-all hover:bg-gold-light sm:w-auto"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/case-study"
                className="w-full rounded-lg border border-cream/20 px-8 py-4 text-center font-medium text-cream/80 transition-all hover:border-cream/40 hover:text-cream sm:w-auto"
              >
                See Our Case Study
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-cream/10 pt-10 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-3xl font-bold text-gold">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-cream/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
              Sound familiar?
            </h2>
            <p className="mt-4 text-lg text-navy/60">
              Most businesses lose 20-30 hours per week to tasks AI can handle.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
            {PAIN_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl border border-navy/5 bg-white p-5"
              >
                <span className="mt-0.5 text-gold">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed text-navy/70">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Our Process
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl">
              Three phases. Measurable results.
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <span className="font-heading text-6xl font-bold text-navy/[0.04]">
                  {step.number}
                </span>
                <h3 className="mt-2 font-heading text-xl font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy/60">
                  {step.description}
                </p>
                <p className="mt-3 text-sm font-medium italic text-gold-muted">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/how-it-works"
              className="text-sm font-semibold text-navy underline underline-offset-4 transition-colors hover:text-gold"
            >
              Learn more about our process &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* PROOF / CASE STUDY TEASER */}
      <section className="bg-navy py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Proof
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-cream sm:text-4xl">
              We did it to ourselves first
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/60">
              Before consulting for anyone else, we built{" "}
              <strong className="text-cream">Enoch</strong> — an autonomous AI
              agent that manages our entire web-design business. Lead scoring,
              proposals, payments, client onboarding, project tracking, and a
              branded AI chat product. All automated. All measured.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: "22-31 hrs", label: "Weekly ops before" },
                { value: "~2.5 hrs", label: "Weekly ops after" },
                { value: "8", label: "AI agents built" },
                { value: "25+", label: "Database tables" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-cream/10 bg-cream/[0.03] p-5 text-center">
                  <p className="font-heading text-2xl font-bold text-gold">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-cream/40">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/case-study"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-navy transition-all hover:bg-gold-light"
              >
                Read the Full Case Study
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-navy sm:text-4xl">
            Ready to find your 20 hours?
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Book a free 15-minute discovery call. We&apos;ll ask about your
            biggest operational pain points and tell you honestly whether AI
            consulting is the right fit.
          </p>
          <div className="mt-10">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-4 font-semibold text-cream transition-all hover:bg-navy-light"
            >
              Book a Discovery Call
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <p className="mt-4 text-sm text-navy/40">
            No sales pitch. No obligation. Just an honest conversation.
          </p>
        </div>
      </section>
    </>
  );
}
