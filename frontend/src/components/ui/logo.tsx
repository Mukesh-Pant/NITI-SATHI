"use client";

interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Logo({ size = 20, color, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <g
        stroke={color || "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M16 4v24" />
        <path d="M8 8h16" />
        <path
          d="M5 15l3-7 3 7a3 3 0 11-6 0z"
          fill={color || "currentColor"}
          fillOpacity="0.08"
        />
        <path
          d="M21 15l3-7 3 7a3 3 0 11-6 0z"
          fill={color || "currentColor"}
          fillOpacity="0.08"
        />
      </g>
    </svg>
  );
}
