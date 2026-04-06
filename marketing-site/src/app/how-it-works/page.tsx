import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Our 3-phase process: passive workflow capture, AI-powered analysis, and hands-on implementation that delivers measurable ROI.",
};

const CAPTURE_FEATURES = [
  { title: "Screen Activity", desc: "Low-FPS recordings that show what apps and screens your team uses throughout the day" },
  { title: "App & Tab Tracking", desc: "Which tools are in focus, for how long, and how often employees switch between them" },
  { title: "Data Movement", desc: "Copy-paste patterns that reveal manual data transfer between systems" },
  { title: "Idle Detection", desc: "Distinguishes active work from waiting, blocked states, and approval delays" },
  { title: "Privacy First", desc: "Pause button, excludable apps, auto-redacted passwords, encrypted storage" },
  { title: "Zero Disruption", desc: "Runs silently in the background — no behavior change, no Hawthorne effect" },
] as const;

const ANALYSIS_OUTPUTS = [
  { title: "Workflow Map", desc: "Auto-generated visual flowchart of how work actually moves through your business" },
  { title: "Time Heatmap", desc: "Where employee hours go by category — data entry, communication, research, waiting" },
  { title: "Pattern Detection", desc: "Repetitive task sequences that happen daily (the prime automation targets)" },
  { title: "Context-Switch Score", desc: "How often and between which apps your team switches — a hidden productivity killer" },
  { title: "Bottleneck Report", desc: "Where work stalls: approval queues, data dependencies, manual handoffs" },
  { title: "Data-Flow Diagram", desc: "Where the same information gets typed into multiple systems manually" },
] as const;

const SOLUTION_TYPES = [
  { title: "AI Agents", desc: "Custom AI assistants that handle specific business functions — lead management, customer service, internal support" },
  { title: "Workflow Automation", desc: "Event-driven pipelines that connect your existing tools and eliminate manual steps" },
  { title: "Data Integration", desc: "API bridges between your apps so data flows automatically instead of being copy-pasted" },
  { title: "Document AI", desc: "Extraction, generation, and summarization of documents, invoices, reports, and contracts" },
  { title: "Communication AI", desc: "AI-drafted emails, follow-ups, and notifications with human approval gates" },
  { title: "Reporting & Analytics", desc: "Auto-generated dashboards and digests that replace hours of manual compilation" },
] as const;

export default function HowItWorks() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Our Process
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-cream sm:text-5xl">
              How It Works
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/60">
              Three phases. No guesswork. Every recommendation backed by data
              from your actual operations.
            </p>
          </div>
        </div>
      </section>

      {/* Phase 1: Discover */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-7xl font-bold text-navy/[0.06]">01</span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">Phase One</p>
                <h2 className="mt-1 font-heading text-3xl font-bold text-navy">Discover</h2>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/60">
              We deploy a lightweight capture agent on your team&apos;s machines.
              For two weeks, it quietly records how work actually happens — not
              how anyone thinks it happens.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CAPTURE_FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl border border-navy/5 bg-white p-6">
                  <h3 className="font-semibold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase 2: Diagnose */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-7xl font-bold text-navy/[0.06]">02</span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">Phase Two</p>
                <h2 className="mt-1 font-heading text-3xl font-bold text-navy">Diagnose</h2>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/60">
              Our AI analysis engine processes the captured data and builds a
              complete operational picture — every workflow, every bottleneck,
              every automation opportunity, scored by ROI.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ANALYSIS_OUTPUTS.map((f) => (
                <div key={f.title} className="rounded-xl border border-navy/5 bg-cream p-6">
                  <h3 className="font-semibold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Phase 3: Design & Build */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-7xl font-bold text-navy/[0.06]">03</span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">Phase Three</p>
                <h2 className="mt-1 font-heading text-3xl font-bold text-navy">Design & Build</h2>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/60">
              We don&apos;t hand you a report and walk away. We build the
              automations, deploy them, train your team, and measure the
              impact against baseline.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SOLUTION_TYPES.map((f) => (
                <div key={f.title} className="rounded-xl border border-navy/5 bg-white p-6">
                  <h3 className="font-semibold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-cream">
            Ready to see what AI can do for your team?
          </h2>
          <p className="mt-4 text-cream/60">
            A 15-minute call is all it takes to find out if we&apos;re a fit.
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="inline-block rounded-lg bg-gold px-8 py-4 font-semibold text-navy transition-all hover:bg-gold-light"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
