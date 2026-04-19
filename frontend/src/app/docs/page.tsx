import { Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const nav = [
  {
    group: "Getting started",
    items: ["Introduction", "Quickstart", "Your first question"],
  },
  {
    group: "Concepts",
    items: ["How RAG works", "Citations", "Nepali language support"],
  },
  {
    group: "API",
    items: ["Authentication", "Endpoints", "Rate limits", "Webhooks"],
  },
  {
    group: "Guides",
    items: ["For advocates", "For students", "For government"],
  },
];

export default function DocsPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <Header />
      <main>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 32px",
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: 48,
          }}
        >
          <aside>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              Documentation
            </div>
            {nav.map(({ group, items }) => (
              <div key={group} style={{ marginBottom: 20 }}>
                <div
                  style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: "var(--fg)" }}
                >
                  {group}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {items.map((item, i) => (
                    <li
                      key={item}
                      style={{
                        padding: "5px 10px",
                        marginLeft: -10,
                        borderRadius: 6,
                        fontSize: 13,
                        color:
                          i === 0 && group === "Getting started"
                            ? "var(--accent)"
                            : "var(--fg-muted)",
                        background:
                          i === 0 && group === "Getting started"
                            ? "var(--accent-soft)"
                            : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <article>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Getting started
            </div>
            <h1
              className="display"
              style={{ fontSize: 44, fontWeight: 500, marginBottom: 16 }}
            >
              Introduction
            </h1>
            <p
              style={{
                fontSize: 17,
                color: "var(--fg-muted)",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Niti-Sathi is a retrieval-augmented legal assistant. It answers
              questions about Nepali law by retrieving the most relevant clauses
              from a vetted corpus and composing a cited response — so you can
              verify every claim.
            </p>

            <h2
              className="display"
              style={{ fontSize: 28, fontWeight: 500, marginBottom: 12 }}
            >
              What&apos;s in the corpus
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--fg)",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              The public corpus is assembled from primary sources published by
              the Government of Nepal and the Law Commission. All text is indexed
              at the clause level.
            </p>

            <div
              style={{
                padding: 18,
                borderRadius: 12,
                background: "var(--code-bg)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--fg)",
                lineHeight: 1.7,
                marginBottom: 24,
                whiteSpace: "pre",
              }}
            >
              <span style={{ color: "var(--fg-faint)" }}>{"// curl example"}</span>
              {"\n"}
              <span style={{ color: "var(--accent)" }}>POST</span>
              {" /v1/chat\nAuthorization: Bearer $NITI_API_KEY\n\n"}
              {'{ "message": "What are fundamental rights?", "lang": "en" }'}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 18,
                borderRadius: 12,
                border: "1px dashed var(--border)",
                gap: 14,
              }}
            >
              <Sparkles
                size={18}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              <div style={{ flex: 1, fontSize: 14 }}>
                <strong>Tip:</strong>{" "}
                <span style={{ color: "var(--fg-muted)" }}>
                  Ask in the language the answer would be written in — this
                  improves retrieval precision by ~23%.
                </span>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
