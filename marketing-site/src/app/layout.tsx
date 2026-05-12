import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Covenant AI Consulting — We Find Where AI Fits Your Business",
    template: "%s | Covenant AI Consulting",
  },
  description:
    "We passively capture your team's workflow, use AI to find bottlenecks, and build automations that save 20+ hours per week. Proven on our own business first.",
  metadataBase: new URL("https://covenantai.consulting"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AI consulting",
    "workflow automation",
    "AI agents",
    "business process optimization",
    "AI workflow analysis",
    "operational efficiency",
    "custom AI integrations",
    "business automation",
  ],
  openGraph: {
    title: "Covenant AI Consulting — We Find Where AI Fits Your Business",
    description:
      "We passively capture your team's workflow, use AI to find bottlenecks, and build automations that save 20+ hours per week.",
    type: "website",
    locale: "en_US",
    url: "https://covenantai.consulting",
    siteName: "Covenant AI Consulting",
  },
  twitter: {
    card: "summary_large_image",
    title: "Covenant AI Consulting — We Find Where AI Fits Your Business",
    description:
      "We passively capture your team's workflow, use AI to find bottlenecks, and build automations that save 20+ hours per week.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://covenantai.consulting/#organization",
      name: "Covenant AI Consulting",
      url: "https://covenantai.consulting",
      description:
        "We passively capture your team's workflow, use AI to find bottlenecks, and build automations that save 20+ hours per week. Proven on our own business first.",
      email: "hello@covenantai.consulting",
      areaServed: { "@type": "Country", name: "US" },
      priceRange: "$$",
      knowsAbout: [
        "AI Workflow Automation",
        "Business Process Optimization",
        "AI Agent Development",
        "Workflow Analysis",
        "Custom AI Integrations",
        "Answer Engine Optimization",
      ],
      sameAs: ["https://covenantsites.com"],
    },
    {
      "@type": "WebSite",
      name: "Covenant AI Consulting",
      url: "https://covenantai.consulting",
      publisher: { "@id": "https://covenantai.consulting/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does Covenant AI discover workflow inefficiencies?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We install a lightweight capture agent on your team's machines (with full consent) for two weeks. It passively records workflows — app usage, context switches, and data movement between systems. Our AI engine then analyzes this data to surface bottlenecks, repetitive tasks, and manual data transfers with time-impact estimates.",
          },
        },
        {
          "@type": "Question",
          name: "How much time can AI automation save my business?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most businesses lose 20-30 hours per week to tasks AI can handle. In our own case study, we reduced operational time from 22-31 hours per week down to approximately 2.5 hours — an 80-90% reduction.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the consulting engagement take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our three-phase process (Discover, Diagnose, Design & Build) typically takes about 3 weeks from zero to a fully deployed automation system with measurable results.",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "How Covenant AI Consulting Works",
      description:
        "Three phases to measurable AI automation results.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Discover",
          text: "We install a lightweight capture agent on your team's machines to passively record workflows for two weeks — app usage, screen activity, context switches, and data movement.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Diagnose",
          text: "Our AI engine analyzes the captured data to build a complete picture of how your business operates. Repetitive tasks, bottlenecks, and manual data transfers are surfaced automatically with time-impact estimates.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Design & Build",
          text: "We present a scored opportunity matrix showing exactly where AI automation delivers the highest ROI, then build working automation — custom AI agents, data integrations, and workflow engines — deployed and measured.",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
