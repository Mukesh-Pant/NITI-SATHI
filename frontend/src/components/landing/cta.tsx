import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";

export function CTA() {
  return (
    <section
      style={{
        padding: "120px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 900px 500px at 50% 50%, oklch(0.52 0.18 25 / 0.1), transparent 70%)",
        }}
      />
      <Reveal>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            className="display"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 24 }}
          >
            Ready to ask with <em>confidence?</em>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "var(--fg-muted)",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.55,
            }}
          >
            Free for students, researchers, and citizens of Nepal. No card
            required.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/chat"
              className="btn btn-accent"
              style={{ padding: "14px 24px", fontSize: 15 }}
            >
              Start chatting <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="btn btn-ghost"
              style={{ padding: "14px 24px", fontSize: 15 }}
            >
              See pricing
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
