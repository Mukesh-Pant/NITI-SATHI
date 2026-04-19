import { FileText, Languages, Shield, Zap, Lock, Globe } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";

const FEATURES = [
  {
    icon: FileText,
    title: "Citation-grounded answers",
    text: "Every response references the exact article, section, and clause from official Nepali legal texts — no hallucinations.",
  },
  {
    icon: Languages,
    title: "Bilingual by design",
    text: "Ask in English or नेपाली. Answers preserve legal terminology in both scripts for accuracy.",
  },
  {
    icon: Shield,
    title: "Retrieval-Augmented",
    text: "RAG over a vetted corpus: Constitution, Civil Code, Labor Act, Company Act, and more — indexed to clause level.",
  },
  {
    icon: Zap,
    title: "Instant reasoning",
    text: "Streaming responses. Typical answer arrives in under 2 seconds, with follow-up suggestions grounded in context.",
  },
  {
    icon: Lock,
    title: "Private by default",
    text: "Your conversations are encrypted and never used for training. Delete anytime, export anytime.",
  },
  {
    icon: Globe,
    title: "Always current",
    text: "Corpus synced with the Law Commission of Nepal. Amendments reflected within 24 hours of publication.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      style={{ padding: "120px 32px", borderTop: "1px solid var(--border)" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 64 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              — Why Niti-Sathi
            </div>
            <h2
              className="display"
              style={{ fontSize: "clamp(32px, 4.5vw, 54px)", marginBottom: 20 }}
            >
              Built for <em>evidence,</em>
              <br />
              not guesswork.
            </h2>
            <p style={{ fontSize: 17, color: "var(--fg-muted)", lineHeight: 1.55 }}>
              Most AI tools guess. Niti-Sathi retrieves. It is the only chat
              assistant purpose-built for Nepali legal research, with every
              claim traceable to a primary source.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 0,
            border: "1px solid var(--border)",
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div
                style={{
                  padding: 32,
                  background: "var(--bg-elev)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: 20,
                    color: "var(--accent)",
                    background: "var(--accent-soft)",
                  }}
                >
                  <f.icon size={18} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 500,
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "var(--fg-muted)",
                    fontSize: 14.5,
                    lineHeight: 1.6,
                  }}
                >
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
