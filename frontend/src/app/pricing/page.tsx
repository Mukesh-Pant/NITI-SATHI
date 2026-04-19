import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const tiers = [
  {
    name: "Citizen",
    price: "Free",
    desc: "For students, researchers, and everyday questions.",
    features: [
      "50 messages / month",
      "All public legal corpus",
      "English + Nepali",
      "Citation links",
      "Community support",
    ],
    cta: "Start free",
    featured: false,
    href: "/signup",
  },
  {
    name: "Advocate",
    price: "NPR 1,200",
    per: "/ month",
    desc: "For legal professionals and serious researchers.",
    features: [
      "Unlimited messages",
      "Priority retrieval (2x faster)",
      "Export to PDF / DOCX",
      "Cross-reference search",
      "Upload your own briefs",
      "Email support",
    ],
    cta: "Start 14-day trial",
    featured: true,
    href: "/signup",
  },
  {
    name: "Firm",
    price: "Custom",
    desc: "For law firms and government offices.",
    features: [
      "Everything in Advocate",
      "SSO + SAML",
      "Private corpus upload",
      "Audit logs",
      "On-prem deployment",
      "Dedicated success manager",
    ],
    cta: "Talk to sales",
    featured: false,
    href: "/about",
  },
];

export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <Header />
      <main style={{ padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            — Pricing
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(40px, 5.5vw, 64px)", marginBottom: 18 }}
          >
            Built for <em>every seat</em> at the table.
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "var(--fg-muted)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.55,
            }}
          >
            From first-year law students to federal ministries — pricing that
            scales with how you use it.
          </p>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            alignItems: "center",
          }}
        >
          {tiers.map((t) => (
            <div
              key={t.name}
              style={{
                padding: 32,
                borderRadius: 18,
                background: t.featured ? "var(--fg)" : "var(--bg-elev)",
                color: t.featured ? "var(--bg)" : "var(--fg)",
                border: "1px solid " + (t.featured ? "var(--fg)" : "var(--border)"),
                boxShadow: t.featured ? "var(--shadow-lg)" : "var(--shadow-sm)",
                position: "relative",
                transform: t.featured ? "scale(1.02)" : "none",
              }}
            >
              {t.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 24,
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: "var(--accent)",
                    color: "white",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Most popular
                </span>
              )}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  opacity: 0.7,
                  marginBottom: 20,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                <span className="display" style={{ fontSize: 46, fontWeight: 500 }}>
                  {t.price}
                </span>
                {t.per && (
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{t.per}</span>
                )}
              </div>
              <p
                style={{
                  fontSize: 14,
                  opacity: 0.75,
                  marginBottom: 24,
                  lineHeight: 1.55,
                }}
              >
                {t.desc}
              </p>
              <Link
                href={t.href}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: 10,
                  background: t.featured ? "var(--accent)" : "transparent",
                  color: t.featured ? "white" : "inherit",
                  border:
                    "1px solid " + (t.featured ? "var(--accent)" : "currentColor"),
                  fontSize: 14,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s var(--ease)",
                  textDecoration: "none",
                }}
              >
                {t.cta} <ArrowRight size={14} />
              </Link>
              <div
                style={{
                  height: 1,
                  background: "currentColor",
                  opacity: 0.12,
                  margin: "24px 0",
                }}
              />
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {t.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      fontSize: 13.5,
                    }}
                  >
                    <Check
                      size={14}
                      style={{ color: "var(--accent)", flexShrink: 0 }}
                    />
                    <span style={{ opacity: 0.9 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
