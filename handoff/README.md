# Niti-Sathi Frontend — Handoff Reference

> **Migration status: COMPLETE.** All design assets in this directory have been fully implemented into the Next.js frontend. This folder is kept as a design reference only.

## What's inside

```text
handoff/
├── Niti-Sathi Redesign.html      ← visual reference (open in browser)
├── design/
│   ├── tokens.css                ← color / type / radius / shadow tokens
│   ├── icons.js                  ← stroke icon set + logo SVG
│   ├── shell.jsx                 ← Header + Footer source
│   ├── landing.jsx               ← Hero, features, how-it-works, stats, CTA
│   ├── chat.jsx                  ← Sidebar, welcome, conversation, composer
│   └── pages.jsx                 ← Admin, auth, pricing, docs, about, privacy
└── CLAUDE_CODE_PROMPT.md         ← original migration instructions
```

## Implementation mapping

| Design file | Implemented at |
| --- | --- |
| `design/tokens.css` | `frontend/src/app/globals.css` |
| `design/shell.jsx` → Header | `frontend/src/components/layout/header.tsx` |
| `design/shell.jsx` → Footer | `frontend/src/components/layout/footer.tsx` |
| `design/landing.jsx` | `frontend/src/app/page.tsx` + `frontend/src/components/landing/*` |
| `design/chat.jsx` → Sidebar | `frontend/src/components/layout/sidebar.tsx` |
| `design/chat.jsx` → Welcome | `frontend/src/components/chat/welcome-screen.tsx` |
| `design/chat.jsx` → Conversation | `frontend/src/components/chat/chat-container.tsx` + `message-bubble.tsx` |
| `design/chat.jsx` → Composer | `frontend/src/components/chat/message-input.tsx` |
| `design/pages.jsx` → AdminDocs | `frontend/src/app/(app)/admin/documents/page.tsx` |
| `design/pages.jsx` → AuthPage | `frontend/src/components/auth/auth-page.tsx` |
| `design/pages.jsx` → PricingPage | `frontend/src/app/pricing/page.tsx` |
| `design/pages.jsx` → DocsPage | `frontend/src/app/docs/page.tsx` |
| `design/pages.jsx` → AboutPage | `frontend/src/app/about/page.tsx` |
| `design/pages.jsx` → PrivacyPage | `frontend/src/app/privacy/page.tsx` |

## Key implementation notes

- Icons: migrated from custom `Icon` component to `lucide-react`
- Theme: `next-themes` uses `attribute="data-theme"` (not `attribute="class"`)
- Fonts: Geist, Geist Mono, Newsreader, Noto Serif Devanagari via `next/font/google`
- Scroll reveals: `framer-motion` `whileInView` in `components/layout/reveal.tsx`
- Sidebar state: shared via `SidebarContext` between app layout and chat container
- Brand accent: `oklch(0.52 0.18 25)` — deep crimson
