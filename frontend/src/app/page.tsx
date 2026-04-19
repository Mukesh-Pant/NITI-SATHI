import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SampleQA } from "@/components/landing/sample-qa";
import { Stats } from "@/components/landing/stats";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SampleQA />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
