"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { sessionsAPI } from "@/lib/api";
import type { Session } from "@/types";
import {
  Plus,
  MessageSquare,
  Search,
  MoreHorizontal,
  Settings,
  LogOut,
  FileText,
  PanelLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

export function Sidebar({ open, onClose, onNewChat }: SidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await sessionsAPI.list();
      setSessions(data);
    } catch {
      // not logged in or error
    }
  };

  const handleNewChat = () => {
    onNewChat();
    router.push("/chat");
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await sessionsAPI.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (pathname === `/chat/${id}`) router.push("/chat");
      toast.success("Chat deleted");
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  // Group sessions by relative date
  const now = Date.now();
  const todayStr = new Date().toDateString();
  const yestStr = new Date(now - 86400000).toDateString();
  const week7 = now - 7 * 86400000;

  const filtered = sessions.filter((s) =>
    search ? s.title?.toLowerCase().includes(search.toLowerCase()) : true
  );

  const groups: { section: string; items: Session[] }[] = [];
  const todayItems = filtered.filter(
    (s) => new Date(s.updated_at).toDateString() === todayStr
  );
  const yestItems = filtered.filter(
    (s) => new Date(s.updated_at).toDateString() === yestStr
  );
  const week7Items = filtered.filter((s) => {
    const d = new Date(s.updated_at).getTime();
    return (
      d < new Date(yestStr).getTime() && d > week7
    );
  });
  const olderItems = filtered.filter(
    (s) => new Date(s.updated_at).getTime() <= week7
  );

  if (todayItems.length) groups.push({ section: "Today", items: todayItems });
  if (yestItems.length) groups.push({ section: "Yesterday", items: yestItems });
  if (week7Items.length) groups.push({ section: "Previous 7 days", items: week7Items });
  if (olderItems.length) groups.push({ section: "Earlier", items: olderItems });

  const initials =
    user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <aside
      style={{
        background: "var(--bg-sunken)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
        width: open ? 280 : 0,
        transition: "width 0.3s var(--ease)",
        flexShrink: 0,
      }}
    >
      {/* Top bar: logo + collapse */}
      <div
        style={{
          padding: "16px 16px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <Logo size={20} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            Niti<span style={{ color: "var(--accent)" }}>·</span>Sathi
          </span>
        </Link>
        <button
          onClick={onClose}
          style={{
            color: "var(--fg-muted)",
            padding: 6,
            borderRadius: 6,
            transition: "background 0.15s var(--ease)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
          title="Collapse sidebar"
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* New chat button */}
      <div style={{ padding: "0 12px 12px", flexShrink: 0 }}>
        <button
          onClick={handleNewChat}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-elev)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13.5,
            fontWeight: 500,
            transition: "all 0.2s var(--ease)",
            whiteSpace: "nowrap",
            color: "var(--fg)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-strong)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <Plus size={14} /> New chat
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--fg-faint)",
              border: "1px solid var(--border)",
              padding: "2px 5px",
              borderRadius: 4,
            }}
          >
            ⌘K
          </span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "0 12px 10px", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-faint)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 30px",
              background: "transparent",
              border: "1px solid var(--border-faint)",
              borderRadius: 8,
              fontSize: 13,
              outline: "none",
              color: "var(--fg)",
            }}
          />
        </div>
      </div>

      {/* Session list */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "4px 8px 8px",
        }}
      >
        {groups.length === 0 && (
          <p
            style={{
              fontSize: 13,
              color: "var(--fg-faint)",
              textAlign: "center",
              padding: "32px 16px",
              fontFamily: "var(--font-mono)",
            }}
          >
            No conversations yet
          </p>
        )}
        {groups.map((group) => (
          <div key={group.section} style={{ marginBottom: 16 }}>
            <div
              className="eyebrow"
              style={{
                fontSize: 10.5,
                padding: "6px 8px 4px",
                letterSpacing: "0.18em",
              }}
            >
              {group.section}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === `/chat/${item.id}`;
              return (
                <Link
                  key={item.id}
                  href={`/chat/${item.id}`}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    fontSize: 13.5,
                    color: isActive ? "var(--fg)" : "var(--fg-muted)",
                    background: isActive ? "var(--bg-hover)" : "transparent",
                    transition: "all 0.15s var(--ease)",
                    position: "relative",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        background: "var(--accent)",
                        borderRadius: 99,
                      }}
                    />
                  )}
                  <MessageSquare
                    size={13}
                    style={{ color: "var(--fg-faint)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title || "New Chat"}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User card */}
      <div
        style={{
          padding: 10,
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div
          onClick={() => setUserMenuOpen((v) => !v)}
          style={{
            padding: "10px 10px",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            transition: "all 0.2s var(--ease)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 99,
              background:
                "linear-gradient(135deg, var(--accent), oklch(0.4 0.18 25))",
              display: "grid",
              placeItems: "center",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.full_name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--fg-faint)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.role === "admin" ? "Admin" : "Free plan"}
            </div>
          </div>
          <MoreHorizontal size={14} style={{ color: "var(--fg-muted)" }} />
        </div>

        {/* Dropdown */}
        {userMenuOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 4px)",
              left: 10,
              right: 10,
              background: "var(--bg-elev)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              zIndex: 50,
            }}
          >
            {user?.role === "admin" && (
              <button
                onClick={() => {
                  router.push("/admin/documents");
                  setUserMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13.5,
                  color: "var(--fg-muted)",
                  transition: "all 0.15s var(--ease)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.color = "var(--fg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--fg-muted)";
                }}
              >
                <FileText size={14} /> Manage Documents
              </button>
            )}
            <button
              onClick={() => {
                router.push("/settings");
                setUserMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13.5,
                color: "var(--fg-muted)",
                transition: "all 0.15s var(--ease)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
                e.currentTarget.style.color = "var(--fg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--fg-muted)";
              }}
            >
              <Settings size={14} /> Settings
            </button>
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "4px 0",
              }}
            />
            <button
              onClick={() => {
                logout();
                setUserMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13.5,
                color: "oklch(0.577 0.245 27.325)",
                transition: "all 0.15s var(--ease)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
