# Niti-Sathi — Frontend

Premium Next.js frontend for the Niti-Sathi legal AI chatbot. Built with the App Router, a bespoke design token system, and real-time SSE streaming.

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.1 | App Router, RSC, routing |
| React | 19 | UI framework |
| TypeScript | 5 | Type safety (strict mode) |
| Tailwind CSS | 4 | Utility classes |
| shadcn/ui | v4 | Base component primitives |
| framer-motion | latest | Scroll-reveal animations |
| lucide-react | latest | Icon system |
| next-themes | latest | `data-theme` attribute theme switching |
| react-markdown | latest | Markdown rendering in chat |
| remark-gfm | latest | GFM tables and strikethrough |
| rehype-sanitize | latest | XSS-safe HTML output |
| react-dropzone | latest | Document upload drag-and-drop |
| sonner | latest | Toast notifications |

## Typography

| CSS Variable | Font | Use |
| --- | --- | --- |
| `--font-sans` | Geist | Body text |
| `--font-mono` | Geist Mono | Code, chips, metadata |
| `--font-display` | Newsreader | Headings, display text |
| `--font-devanagari` | Noto Serif Devanagari | Nepali text |

## Theme System

Themes are applied via `[data-theme="light"]` / `[data-theme="dark"]` attribute selectors (not `.dark` class). The `ThemeProvider` uses `attribute="data-theme"` from `next-themes`.

Brand accent: `--accent: oklch(0.52 0.18 25)` — deep crimson.

## Directory Structure

```text
src/
├── app/
│   ├── (auth)/             # Login + signup pages
│   ├── (app)/              # Authenticated: chat, settings, admin
│   ├── pricing/            # Pricing tiers
│   ├── docs/               # Documentation
│   ├── about/              # Team + mission
│   ├── privacy/            # Privacy policy + disclaimer
│   ├── api/chat/           # SSE proxy to FastAPI backend
│   ├── globals.css         # Design tokens, utility classes, keyframes
│   ├── layout.tsx          # Font vars, ThemeProvider, Toaster
│   └── page.tsx            # Landing page
├── components/
│   ├── layout/             # Header, Footer, Sidebar, ThemeProvider, Reveal
│   ├── landing/            # Hero, Features, HowItWorks, SampleQA, Stats, CTA
│   ├── chat/               # ChatContainer, WelcomeScreen, MessageBubble, MessageInput
│   ├── auth/               # AuthPage (shared login/signup component)
│   └── ui/                 # Logo + shadcn/ui primitives
├── contexts/               # AuthContext, SidebarContext
├── hooks/                  # useChat (SSE streaming)
├── lib/                    # API client
└── types/                  # Shared TypeScript interfaces
```

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

## Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Key Conventions

- Components with `onMouseEnter`/`onMouseLeave` or hooks must declare `"use client"`.
- Hover effects are applied via inline JS style mutations (not Tailwind hover variants), so they can reference CSS custom properties at runtime.
- All auth flows go through `useAuth()` from `@/contexts/auth-context`.
- SSE chat streaming goes through the `/api/chat` Next.js route (proxied to FastAPI).
- Sidebar open/close state is shared via `SidebarContext` between `(app)/layout.tsx` and `ChatContainer`.
