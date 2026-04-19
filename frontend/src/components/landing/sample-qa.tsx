import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";

const SAMPLES = [
  {
    q: "What are my fundamental rights under the Constitution of Nepal?",
    cat: "Constitution",
    np: false,
  },
  { q: "How do I register a private company?", cat: "Corporate", np: false },
  {
    q: "नागरिकता प्राप्तिका आधारहरू के के हुन्?",
    cat: "Citizenship",
    np: true,
  },
  {
    q: "What does Article 17 say about the right to freedom?",
    cat: "Rights",
    np: false,
  },
  {
    q: "Labor rights for contract workers in Nepal?",
    cat: "Labor",
    np: false,
  },
  {
    q: "Procedure for filing a writ petition at the Supreme Court?",
    cat: "Judicial",
    np: false,
  },
];

export function SampleQA() {
  return (
    <section
      style={{ padding: "120px 32px", borderTop: "1px solid var(--border)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 48,
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>
                — Ask anything
              </div>
              <h2
                className="display"
                style={{ fontSize: "clamp(32px, 4.5vw, 54px)" }}
              >
                Try a question <em>we hear often.</em>
              </h2>
            </div>
            <Link
              href="/chat"
              className="btn btn-ghost"
            >
              Open chat <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 14,
          }}
        >
          {SAMPLES.map((s, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <Link
                href="/chat"
                className="sample-card"
                style={{
                  padding: 24,
                  background: "var(--bg-elev)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  cursor: "pointer",
                  transition: "all 0.3s var(--ease)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  minHeight: 140,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="chip" style={{ fontSize: 10 }}>
                    {s.cat}
                  </span>
                  <ArrowUpRight
                    size={15}
                    style={{ color: "var(--fg-faint)" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: s.np
                      ? "var(--font-devanagari)"
                      : "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  "{s.q}"
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
