import { Quote } from "lucide-react";

export function CitationChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 6,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        background: "var(--gold-soft)",
        color: "var(--gold)",
        border: "1px solid color-mix(in oklch, var(--gold) 40%, transparent)",
      }}
    >
      <Quote size={11} />
      {label}
    </span>
  );
}
