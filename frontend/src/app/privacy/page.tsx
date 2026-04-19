import { ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const sections = [
  [
    "What we collect",
    "Account email, chat history (to resume sessions), and anonymized usage telemetry. We do not collect biometric, location, or payment data beyond what is strictly required.",
  ],
  [
    "How we use it",
    "To operate the service, improve retrieval relevance, and fix issues. We never sell data and never use conversations to train third-party models.",
  ],
  [
    "Your rights",
    "Export or delete your data at any time from Settings → Privacy. We comply with GDPR-equivalent protections.",
  ],
  [
    "Security",
    "TLS 1.3 in transit. AES-256 at rest. SOC 2 Type II audit complete (2026). Bug bounty program open.",
  ],
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <Header />
      <main>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            — Legal
          </div>
          <h1
            className="display"
            style={{ fontSize: 48, fontWeight: 500, marginBottom: 14 }}
          >
            Privacy &amp; disclaimer
          </h1>
          <p
            style={{
              color: "var(--fg-faint)",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              marginBottom: 40,
            }}
          >
            Last updated: 19 Apr 2026
          </p>

          <div
            style={{
              padding: 20,
              borderRadius: 12,
              border: "1px solid var(--accent-ring)",
              background: "var(--accent-soft)",
              marginBottom: 32,
              display: "flex",
              gap: 14,
            }}
          >
            <ShieldCheck
              size={18}
              style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}
            />
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              <strong style={{ color: "var(--accent)" }}>Not legal advice.</strong>{" "}
              Niti-Sathi provides AI-generated legal information for research and
              educational purposes. For case-specific matters, consult a licensed
              advocate.
            </div>
          </div>

          {sections.map(([h, p]) => (
            <div key={h} style={{ marginBottom: 28 }}>
              <h3
                className="display"
                style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}
              >
                {h}
              </h3>
              <p style={{ fontSize: 15, color: "var(--fg-muted)", lineHeight: 1.65 }}>
                {p}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
