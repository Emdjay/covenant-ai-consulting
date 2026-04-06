import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "We built an AI agent that runs our own business. Now we help other businesses do the same. Meet Covenant AI Consulting.",
};

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              About Us
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-cream sm:text-5xl">
              We proved it on ourselves first
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-heading text-3xl font-bold text-navy">
              The Origin Story
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-navy/60">
              Covenant AI Consulting started with a simple realization: we were
              spending more time <em>managing</em> our web-design business than
              actually <em>doing</em> the work.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-navy/60">
              Lead tracking lived in a spreadsheet. Proposals were designed from
              scratch every time. Follow-ups depended on memory. Payments were
              chased via text message. Client onboarding was a different
              experience every time.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-navy/60">
              So we did something about it. We built{" "}
              <strong className="text-navy">Enoch</strong> — an autonomous AI
              agent with 8 specialized sub-agents that manages our entire
              operation. Lead scoring, AI-generated proposals, automated
              follow-ups, Stripe-integrated payments, client onboarding
              pipelines, project timelines, and even a branded AI chat product
              we sell to our own clients.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-navy/60">
              The result:{" "}
              <strong className="text-navy">
                22-31 hours per week of operations compressed to ~2.5 hours.
              </strong>{" "}
              One person now runs a business that would normally need a team of
              3-4.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-navy/60">
              That&apos;s when we realized: every business has these same
              problems. Repetitive tasks. Manual data movement. Forgotten
              follow-ups. Inconsistent processes. And most businesses know AI
              could help — they just don&apos;t know <em>where</em> or{" "}
              <em>how</em>.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-navy/60">
              So we built a way to find out. A passive capture tool that records
              how work actually happens, an AI engine that spots the patterns and
              bottlenecks, and a consulting process that turns those insights
              into working automation.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold text-navy">
            What We Believe
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Build, don't just advise",
                desc: "We deliver working automation, not slide decks. If we recommend it, we build it.",
              },
              {
                title: "Human in the loop",
                desc: "AI should handle the repetitive work. Humans should handle judgment, creativity, and relationships.",
              },
              {
                title: "Measure everything",
                desc: "Every recommendation has projected ROI. Every implementation is measured against baseline.",
              },
              {
                title: "Privacy by design",
                desc: "Our capture tools have built-in consent, exclusions, and encryption. We respect your team's boundaries.",
              },
              {
                title: "Prove it on ourselves",
                desc: "We use the same AI systems we recommend. Our business is the proof of concept.",
              },
              {
                title: "Honest about fit",
                desc: "Not every business needs AI consulting. We'll tell you if it's not the right time.",
              },
            ].map((v) => (
              <div key={v.title}>
                <h3 className="font-heading text-lg font-bold text-navy">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-cream">
            Let&apos;s talk about your business
          </h2>
          <p className="mt-4 text-cream/60">
            15 minutes. No pitch. Just an honest look at whether AI can move
            the needle for you.
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
