import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-navy/5 bg-navy text-cream/60">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <span className="font-heading text-xl font-bold text-cream">
              Covenant<span className="text-gold">AI</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed">
              We discover your workflow. We diagnose the bottlenecks.
              We build the solution.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="transition-colors hover:text-cream">How It Works</Link></li>
              <li><Link href="/case-study" className="transition-colors hover:text-cream">Case Study</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-cream">Pricing</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-cream">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cream/40">
              Get Started
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/book" className="transition-colors hover:text-cream">Book a Discovery Call</Link></li>
              <li><a href="mailto:hello@covenantai.consulting" className="transition-colors hover:text-cream">hello@covenantai.consulting</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-cream/10 pt-8 text-center text-xs text-cream/30">
          &copy; {new Date().getFullYear()} Covenant AI Consulting. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
