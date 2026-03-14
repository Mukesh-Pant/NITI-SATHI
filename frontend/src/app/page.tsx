"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  Scale,
  FileText,
  Globe,
  ArrowRight,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">NITI-SATHI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {user ? (
              <Link href="/chat">
                <Button>Open Chat <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-6">
            <Scale className="mr-2 h-4 w-4 text-primary" />
            AI-Powered Legal Assistant for Nepal
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Your Legal Questions,{" "}
            <span className="text-primary">Answered Instantly</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Get reliable, citation-based answers about Nepali law and governance.
            Powered by AI and backed by official legal documents including the
            Constitution of Nepal.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={user ? "/chat" : "/signup"}>
              <Button size="lg" className="text-lg px-8 py-6">
                Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why NITI-SATHI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Citation-Based Answers</h3>
                <p className="text-muted-foreground">
                  Every response references specific articles, sections, and clauses
                  from official Nepali legal documents.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bilingual Support</h3>
                <p className="text-muted-foreground">
                  Ask questions and receive answers in both English and Nepali
                  (नेपाली) for broader accessibility.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trustworthy & Grounded</h3>
                <p className="text-muted-foreground">
                  Powered by RAG technology — answers are grounded in actual legal
                  texts, not AI hallucination.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", title: "Ask Your Question", desc: "Type your legal question in English or Nepali about any aspect of Nepali law and governance." },
              { step: "2", title: "AI Retrieves & Analyzes", desc: "Our RAG system searches through official legal documents to find the most relevant articles and sections." },
              { step: "3", title: "Get Cited Answers", desc: "Receive a clear, accurate answer with references to the exact legal sources for verification." },
            ].map((item) => (
              <div key={item.step}>
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-semibold">NITI-SATHI</span>
              <span className="text-muted-foreground text-sm">
                | AI Chatbot for Nepali Law & Governance
              </span>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              <p>Far Western University, School of Engineering</p>
              <p>Minor Project 2025 | Computer Engineering</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
