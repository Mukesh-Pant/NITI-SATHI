"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { toast } from "sonner";

interface AuthPageProps {
  mode: "login" | "signup";
}

function FormField({
  label,
  type,
  placeholder,
  hint,
  value,
  onChange,
  required,
  minLength,
}: {
  label: string;
  type: string;
  placeholder: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12.5,
          marginBottom: 6,
          color: "var(--fg-muted)",
          fontWeight: 500,
        }}
      >
        <span>{label}</span>
        {hint && (
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>
            {hint}
          </span>
        )}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg-elev)",
          fontSize: 14,
          outline: "none",
          transition: "all 0.2s var(--ease)",
          color: "var(--fg)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent)";
          e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border)";
          e.target.style.boxShadow = "none";
        }}
      />
    </label>
  );
}

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (isSignup && password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, fullName);
        toast.success("Account created!");
      } else {
        await login(email, password);
        toast.success("Welcome back!");
      }
      router.push("/chat");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isSignup
          ? "Signup failed"
          : "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-grid"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg)",
      }}
    >
      {/* Left — visual panel */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--bg-sunken)",
          borderRight: "1px solid var(--border)",
          padding: 48,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Background gradients */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
              radial-gradient(ellipse 600px 400px at 30% 30%, oklch(0.52 0.18 25 / 0.15), transparent 60%),
              radial-gradient(ellipse 500px 300px at 80% 80%, oklch(0.72 0.10 78 / 0.08), transparent 60%)
            `,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            width: "fit-content",
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
        </Link>

        {/* Testimonial */}
        <div style={{ position: "relative" }}>
          <blockquote
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.25,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            "Finally, a research tool that cites its sources. Niti-Sathi has cut
            my legal prep time by{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              half.
            </em>
            "
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 99,
                background:
                  "linear-gradient(135deg, var(--accent), oklch(0.42 0.18 25))",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 600,
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                Sudeep Adhikari
              </div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>
                Advocate, Kathmandu District Court
              </div>
            </div>
          </div>
        </div>

        {/* Compliance row */}
        <div
          style={{
            position: "relative",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
            display: "flex",
            gap: 20,
          }}
        >
          <span>SOC 2 Type II</span>
          <span>GDPR-ready</span>
          <span>End-to-end encrypted</span>
        </div>
      </div>

      {/* Right — form */}
      <div
        style={{
          padding: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 380, width: "100%" }}>
          <h1
            className="display"
            style={{ fontSize: 36, fontWeight: 500, marginBottom: 8 }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p
            style={{
              color: "var(--fg-muted)",
              fontSize: 14.5,
              marginBottom: 32,
            }}
          >
            {isSignup
              ? "Free for students and citizens of Nepal. No card required."
              : "Sign in to continue your legal research."}
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {isSignup && (
              <FormField
                label="Full name"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={setFullName}
                required
              />
            )}
            <FormField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              required
            />
            <FormField
              label="Password"
              type="password"
              placeholder="••••••••"
              hint={!isSignup ? "Forgot?" : undefined}
              value={password}
              onChange={setPassword}
              required
              minLength={8}
            />
            {isSignup && (
              <FormField
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
              style={{
                padding: "12px 16px",
                justifyContent: "center",
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: 99,
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : null}
              {isSignup ? "Create account" : "Sign in"}{" "}
              <ArrowRight size={14} />
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              fontSize: 13.5,
              color: "var(--fg-muted)",
              textAlign: "center",
            }}
          >
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              style={{
                color: "var(--accent)",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </div>

          {isSignup && (
            <p
              style={{
                marginTop: 20,
                fontSize: 11.5,
                color: "var(--fg-faint)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              By continuing, you agree to our{" "}
              <Link
                href="/privacy"
                style={{ textDecoration: "underline", color: "inherit" }}
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                style={{ textDecoration: "underline", color: "inherit" }}
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
