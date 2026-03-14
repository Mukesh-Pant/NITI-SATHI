"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { sessionsAPI } from "@/lib/api";
import type { Session } from "@/types";
import {
  Scale,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  FileText,
  Trash2,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await sessionsAPI.list();
      setSessions(data);
    } catch {
      // Not logged in or error
    }
  };

  const createNewChat = () => {
    router.push("/chat");
    setMobileOpen(false);
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
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

  // Group sessions by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const grouped: { label: string; sessions: Session[] }[] = [];
  const todaySessions = sessions.filter(
    (s) => new Date(s.updated_at).toDateString() === today
  );
  const yesterdaySessions = sessions.filter(
    (s) => new Date(s.updated_at).toDateString() === yesterday
  );
  const olderSessions = sessions.filter(
    (s) =>
      new Date(s.updated_at).toDateString() !== today &&
      new Date(s.updated_at).toDateString() !== yesterday
  );

  if (todaySessions.length) grouped.push({ label: "Today", sessions: todaySessions });
  if (yesterdaySessions.length) grouped.push({ label: "Yesterday", sessions: yesterdaySessions });
  if (olderSessions.length) grouped.push({ label: "Previous", sessions: olderSessions });

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-muted/50">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">NITI-SATHI</span>
        </div>
        <Button onClick={createNewChat} className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>

      {/* Session List */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2">
          {grouped.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                {group.label}
              </p>
              {group.sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/chat/${session.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted group",
                    pathname === `/chat/${session.id}` && "bg-muted"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate flex-1">
                    {session.title || "New Chat"}
                  </span>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Link>
              ))}
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No conversations yet
            </p>
          )}
        </div>
      </ScrollArea>

      {/* Footer - User Menu */}
      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-muted text-left" />
          }>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { router.push("/settings"); setMobileOpen(false); }}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <DropdownMenuItem onClick={() => { router.push("/admin/documents"); setMobileOpen(false); }}>
                <FileText className="mr-2 h-4 w-4" /> Manage Documents
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-72 border-r shrink-0">
        {sidebarContent}
      </div>
    </>
  );
}
