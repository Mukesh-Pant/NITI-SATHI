"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const COLUMNS = [
  {
    title: "Product",
    items: [
      ["Chat", "/chat"],
      ["How it works", "/#how-it-works"],
      ["Pricing", "/pricing"],
      ["Changelog", "/about"],
      ["Roadmap", "/about"],
    ],
  },
  {
    title: "Resources",
    items: [
      ["Documentation", "/docs"],
      ["API reference", "/docs"],
      ["Legal corpus", "/docs"],
      ["Research", "/about"],
      ["Blog", "/about"],
    ],
  },
  {
    title: "Company",
    items: [
      ["About", "/about"],
      ["Contact", "/about"],
      ["Careers", "/about"],
      ["Press kit", "/about"],
      ["Partners", "/about"],
    ],
  },
  {
    title: "Legal",
    items: [
      ["Privacy", "/privacy"],
      ["Terms", "/privacy"],
      ["Disclaimer", "/privacy"],
      ["Security", "/privacy"],
      ["Responsible AI", "/privacy"],
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-sunken)",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 32px 32px",
        }}
      >
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
            gap: 48,
            marginBottom: 56,
          }}
        >
          {/* Brand col */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <Logo size={24} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                Niti<span style={{ color: "var(--accent)" }}>·</span>Sathi
              </span>
            </div>
            <p
              style={{
                color: "var(--fg-muted)",
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              Cited, grounded answers about Nepali law and governance. Built on
              verified legal corpus.
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {(
                [
                  ["github", Github],
                  ["twitter", Twitter],
                  ["linkedin", Linkedin],
                ] as const
              ).map(([name, Icon]) => (
                <a
                  key={name}
                  href="#"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid var(--border)",
                    color: "var(--fg-muted)",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--fg)";
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--fg-muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {col.title}
              </div>
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
                {col.items.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{
                        fontSize: 14,
                        color: "var(--fg-muted)",
                        transition: "color 0.2s var(--ease)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--fg)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--fg-muted)")
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: 28,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
              color: "var(--fg-faint)",
            }}
          >
            <span>© 2026 Niti-Sathi. All rights reserved.</span>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: 99,
                background: "var(--border-strong)",
              }}
            />
            <span>Far Western University, School of Engineering</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  background: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
