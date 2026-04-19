import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const stats = [
  ["10,482", "Clauses indexed"],
  ["18", "Primary sources"],
  ["2,400+", "Weekly active users"],
  ["98.4%", "Citation accuracy"],
];

const team = [
  ["Mukesh Pant", "Founder / Engineer"],
  ["Anisha Sharma", "Legal Researcher"],
  ["Rajan Thapa", "ML Engineer"],
  ["Pranisha KC", "Design"],
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <Header />
      <main>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px" }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            — About
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(40px, 5.5vw, 64px)",
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            Justice should be <em>accessible.</em>
          </h1>
          <p
            style={{
              fontSize: 19,
              color: "var(--fg-muted)",
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            Niti-Sathi started as a minor project at Far Western University&apos;s
            School of Engineering. Today it&apos;s used by students, advocates, and
            citizens across Nepal to make sense of a legal system that can feel
            opaque.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              margin: "48px 0",
            }}
          >
            {stats.map(([n, l]) => (
              <div key={l} className="card" style={{ padding: 24 }}>
                <div
                  className="display"
                  style={{ fontSize: 36, fontWeight: 500, marginBottom: 6 }}
                >
                  {n}
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>{l}</div>
              </div>
            ))}
          </div>

          <h2
            className="display"
            style={{ fontSize: 32, fontWeight: 500, marginBottom: 16 }}
          >
            The team
          </h2>
          <p
            style={{
              color: "var(--fg-muted)",
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            A small team of engineers and legal researchers in Kathmandu.
            We&apos;re supported by Far Western University and advised by practicing
            advocates.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
            }}
          >
            {team.map(([n, r]) => (
              <div
                key={n}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 99,
                    background:
                      "linear-gradient(135deg, var(--accent), oklch(0.4 0.18 25))",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {n[0]}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{r}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
