import { FileText, Send } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { CitationChip } from "./citation-chip";

function DemoAsk() {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: "var(--bg-sunken)",
        border: "1px solid var(--border-faint)",
        fontSize: 13,
        fontFamily: "var(--font-mono)",
        color: "var(--fg-muted)",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span style={{ color: "var(--accent)" }}>›</span>
      <span>How do I register a company?</span>
      <span style={{ marginLeft: "auto" }}>
        <Send size={14} />
      </span>
    </div>
  );
}

function DemoRetrieve() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {(
        [
          ["Company Act 2063", "§4", 94],
          ["Companies Rules 2067", "§2", 87],
          ["Civil Code 2074", "§105", 61],
        ] as const
      ).map(([doc, sec, score], i) => (
        <div
          key={i}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            background: "var(--bg-sunken)",
            border: "1px solid var(--border-faint)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
          }}
        >
          <FileText size={13} style={{ color: "var(--fg-faint)" }} />
          <span style={{ flex: 1 }}>
            {doc}{" "}
            <span style={{ color: "var(--fg-faint)" }}>/ {sec}</span>
          </span>
          <span style={{ color: "var(--accent)" }}>{score}%</span>
        </div>
      ))}
    </div>
  );
}

function DemoVerify() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      <CitationChip label="Company Act §4" />
      <CitationChip label="Company Act §5" />
      <CitationChip label="Civil Code §105" />
      <span className="chip" style={{ fontSize: 11 }}>
        + 2 more
      </span>
    </div>
  );
}

const STEPS = [
  {
    num: "01",
    title: "You ask",
    text: "Frame your question in English or Nepali, casual or formal. No legal jargon required.",
    demo: <DemoAsk />,
  },
  {
    num: "02",
    title: "We retrieve",
    text: "Our retrieval engine scans 10,000+ legal clauses to find the most relevant passages.",
    demo: <DemoRetrieve />,
  },
  {
    num: "03",
    title: "You verify",
    text: "Answer arrives with every source cited. Click any citation to read the original text.",
    demo: <DemoVerify />,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "120px 32px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-sunken)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              — How it works
            </div>
            <h2
              className="display"
              style={{ fontSize: "clamp(32px, 4.5vw, 54px)" }}
            >
              Three steps, <em>one source of truth.</em>
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="card" style={{ padding: 32 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--accent)",
                    }}
                  >
                    {s.num}
                  </span>
                  <span
                    style={{ flex: 1, height: 1, background: "var(--border)" }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 500,
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--fg-muted)",
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  {s.text}
                </p>
                <div style={{ minHeight: 140 }}>{s.demo}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
