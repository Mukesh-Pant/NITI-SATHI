"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { Logo } from "@/components/ui/logo";
import { CitationChip } from "./citation-chip";

function HeroCursor() {
  const [text, setText] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const questions = useMemo(
    () => [
      "What are my fundamental rights under the Constitution?",
      "How do I register a private company in Nepal?",
      "नागरिकता कसरी प्राप्त गर्ने?",
      "What does Article 17 say about freedom?",
      "Labor rights for contract employees?",
    ],
    []
  );

  useEffect(() => {
    const current = questions[qIdx];
    let i = 0;
    let mode: "typing" | "pause" | "deleting" = "typing";
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (mode === "typing") {
        if (i <= current.length) {
          setText(current.slice(0, i));
          i++;
          timer = setTimeout(tick, 32 + Math.random() * 30);
        } else {
          mode = "pause";
          timer = setTimeout(tick, 1800);
        }
      } else if (mode === "pause") {
        mode = "deleting";
        tick();
      } else {
        if (i >= 0) {
          setText(current.slice(0, i));
          i--;
          timer = setTimeout(tick, 14);
        } else {
          setQIdx((q) => (q + 1) % questions.length);
        }
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, [qIdx, questions]);

  return (
    <span style={{ fontFamily: "var(--font-sans)" }}>
      {text}
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1em",
          background: "var(--accent)",
          verticalAlign: "-2px",
          marginLeft: 2,
          animation: "blink 1s step-end infinite",
        }}
      />
    </span>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      style={{
        width: 4,
        height: 4,
        borderRadius: 99,
        background: "var(--accent)",
        display: "inline-block",
        animation: `pulse 1.2s ${delay}s infinite`,
      }}
    />
  );
}

function HeroChatPreview() {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 20,
        background: "var(--bg-elev)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
        maxWidth: 780,
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: "1px solid var(--border-faint)",
          background: "var(--bg-sunken)",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#28c840" }} />
        <span
          style={{
            marginLeft: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--fg-faint)",
          }}
        >
          niti-sathi.np / chat
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-faint)",
          }}
        >
          ● live
        </span>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* User message */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 99,
              background: "var(--bg-sunken)",
              border: "1px solid var(--border)",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--fg-muted)",
              flexShrink: 0,
            }}
          >
            Y
          </div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div
              style={{
                fontSize: 13,
                color: "var(--fg-muted)",
                marginBottom: 6,
                fontFamily: "var(--font-mono)",
              }}
            >
              you · asking
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.55 }}>
              <HeroCursor />
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border-faint)" }} />

        {/* Assistant message */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 99,
              background: "linear-gradient(135deg, var(--accent), oklch(0.45 0.18 25))",
              display: "grid",
              placeItems: "center",
              color: "white",
              flexShrink: 0,
            }}
          >
            <Logo size={16} color="white" />
          </div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div
              style={{
                fontSize: 13,
                color: "var(--fg-muted)",
                marginBottom: 6,
                fontFamily: "var(--font-mono)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              niti-sathi · responding{" "}
              <span style={{ display: "inline-flex", gap: 3 }}>
                <Dot delay={0} />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
              </span>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.65, color: "var(--fg)" }}>
              Nepali citizenship may be acquired through{" "}
              <strong>descent, birth, naturalization, or honorary grant</strong>, as
              established in the Constitution.
            </div>
            <div
              style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
            >
              <CitationChip label="Constitution of Nepal · Article 11(2)(a)" />
              <CitationChip label="Article 11(3)" />
              <CitationChip label="Citizenship Act · §3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: 60,
        paddingBottom: 100,
      }}
    >
      {/* Mesh gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 800px 400px at 20% 10%, oklch(0.52 0.18 25 / 0.12), transparent 60%),
            radial-gradient(ellipse 700px 500px at 85% 30%, oklch(0.72 0.10 78 / 0.08), transparent 60%),
            radial-gradient(ellipse 600px 400px at 50% 90%, oklch(0.52 0.18 25 / 0.06), transparent 60%)
          `,
        }}
      />
      {/* Grid lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
        }}
      >
        <div
          style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}
        >
          {/* Badge */}
          <Reveal>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 6px 6px 14px",
                border: "1px solid var(--border)",
                borderRadius: 999,
                background: "var(--bg-elev)",
                marginBottom: 32,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--fg-muted)" }}>
                New · Article-level citations
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                Read more <ArrowRight size={12} />
              </span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={0.1}>
            <h1
              className="display"
              style={{
                fontSize: "clamp(44px, 7vw, 88px)",
                marginBottom: 24,
              }}
            >
              Nepali law,
              <br />
              answered with <em>proof.</em>
            </h1>
          </Reveal>

          {/* Subhead */}
          <Reveal delay={0.2}>
            <p
              style={{
                fontSize: 19,
                color: "var(--fg-muted)",
                maxWidth: 640,
                margin: "0 auto 40px",
                lineHeight: 1.55,
              }}
            >
              Niti-Sathi is an AI legal assistant grounded in the Constitution
              of Nepal, Civil Code, and official statutes. Every answer cites
              its source — article, section, clause.
            </p>
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={0.3}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginBottom: 64,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/chat"
                className="btn btn-accent"
                style={{ padding: "14px 22px", fontSize: 15 }}
              >
                Start chatting free <ArrowRight size={15} />
              </Link>
              <Link
                href="/docs"
                className="btn btn-ghost"
                style={{ padding: "14px 22px", fontSize: 15 }}
              >
                <BookOpen size={15} /> Read the docs
              </Link>
            </div>
          </Reveal>

          {/* Chat preview */}
          <Reveal delay={0.4}>
            <HeroChatPreview />
          </Reveal>
        </div>

        {/* Trust strip */}
        <Reveal delay={0.5}>
          <div style={{ marginTop: 72, textAlign: "center" }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              Grounded in official sources
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {[
                "Constitution of Nepal (2072)",
                "National Civil Code (2074)",
                "Labor Act (2074)",
                "Company Act (2063)",
                "Muluki Ain",
              ].map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    color: "var(--fg-muted)",
                    fontStyle: "italic",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
