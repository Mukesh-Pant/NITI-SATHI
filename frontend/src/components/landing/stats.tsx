import { Reveal } from "@/components/layout/reveal";

const STATS = [
  ["10,482", "Legal clauses indexed"],
  ["< 2s", "Typical response time"],
  ["98.4%", "Citation accuracy"],
  ["2 languages", "English + नेपाली"],
] as const;

export function Stats() {
  return (
    <section
      style={{
        padding: "80px 32px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-sunken)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48,
        }}
      >
        {STATS.map(([n, l], i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 5vw, 56px)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              >
                {n}
              </div>
              <div style={{ fontSize: 14, color: "var(--fg-muted)" }}>{l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
