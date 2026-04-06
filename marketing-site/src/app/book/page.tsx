import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";

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
              15 minutes. No sales pitch. Just an honest look at whether AI
              consulting is the right fit for your business.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <BookingForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-navy/5 bg-white p-8">
                <h3 className="font-heading text-lg font-bold text-navy">
                  What to expect
                </h3>
                <ul className="mt-6 space-y-5">
                  {[
                    {
                      icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
                      title: "15 minutes",
                      desc: "Quick and focused — we respect your time",
                    },
                    {
                      icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
                      title: "We ask, you talk",
                      desc: "Tell us your pain points — we listen for patterns",
                    },
                    {
                      icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
                      title: "Honest assessment",
                      desc: "We'll tell you if AI consulting is right — or not",
                    },
                    {
                      icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                      title: "No obligation",
                      desc: "Zero pressure. Walk away with clarity either way",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={item.icon}
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-navy">{item.title}</p>
                        <p className="mt-0.5 text-sm text-navy/50">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
