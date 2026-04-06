import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description:
    "Schedule a free 15-minute call to find out where AI can save your business 20+ hours per week.",
};

export default function Book() {
  return (
    <>
      <section className="bg-navy py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Get Started
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold text-cream sm:text-5xl">
              Book a Discovery Call
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cream/60">
              15 minutes. No sales pitch. We&apos;ll ask about your biggest
              operational pain points and tell you honestly whether AI consulting
              is the right fit.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-3xl px-6">
          {/* Placeholder for Cal.com or Calendly embed */}
          <div className="rounded-2xl border-2 border-dashed border-navy/10 bg-white p-12 text-center">
            <div className="mx-auto max-w-sm">
              <svg className="mx-auto h-12 w-12 text-navy/20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <h2 className="mt-6 font-heading text-xl font-bold text-navy">
                Scheduling Widget Goes Here
              </h2>
              <p className="mt-3 text-sm text-navy/50">
                This is where the Cal.com or Calendly embed will live.
                Once configured, visitors can pick a time slot directly.
              </p>
              <div className="mt-8">
                <a
                  href="mailto:hello@covenantai.consulting"
                  className="inline-block rounded-lg bg-navy px-8 py-3 font-semibold text-cream transition-all hover:bg-navy-light"
                >
                  Email Us Directly
                </a>
              </div>
              <p className="mt-3 text-xs text-navy/30">
                hello@covenantai.consulting
              </p>
            </div>
          </div>

          {/* What to expect */}
          <div className="mt-16">
            <h3 className="font-heading text-xl font-bold text-navy">
              What to expect on the call
            </h3>
            <ul className="mt-6 space-y-4">
              {[
                "We'll ask about your team size, main tools, and biggest operational pain points",
                "We'll share relevant examples of what AI automation looks like for businesses like yours",
                "We'll give an honest assessment of whether a workflow audit makes sense for you right now",
                "If it's a fit, we'll outline next steps and timeline. If it's not, we'll tell you why and what to focus on instead",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-navy/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
