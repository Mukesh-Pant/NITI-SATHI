"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { documentsAPI } from "@/lib/api";
import type { LegalDocument } from "@/types";
import {
  Upload,
  Trash2,
  FileText,
  Search,
  Settings,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

type FilterTab = "All" | "Ready" | "Indexing" | "Errors";

function StatusBadge({
  status,
}: {
  status: "processing" | "ready" | "error";
}) {
  const map = {
    ready: { color: "#10b981", label: "Ready" },
    processing: { color: "#f59e0b", label: "Indexing" },
    error: { color: "#ef4444", label: "Error" },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 99,
        background: `color-mix(in oklch, ${s.color} 14%, transparent)`,
        color: s.color,
        fontSize: 11.5,
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        border: `1px solid color-mix(in oklch, ${s.color} 30%, transparent)`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 99,
          background: s.color,
          animation: status === "processing" ? "pulse 1.2s infinite" : "none",
        }}
      />
      {s.label}
    </span>
  );
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AdminDocumentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/chat");
      return;
    }
    loadDocuments();
  }, [user, router]);

  const loadDocuments = async () => {
    try {
      const { data } = await documentsAPI.list();
      setDocuments(data);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      setUploading(true);
      try {
        await documentsAPI.upload(file);
        toast.success(`${file.name} uploaded successfully`);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : `Failed to upload ${file.name}`;
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    }
    setShowUpload(false);
    loadDocuments();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/html": [".html", ".htm"],
    },
    maxSize: 50 * 1024 * 1024,
  });

  const handleDelete = async (id: string, filename: string) => {
    if (
      !confirm(
        `Delete "${filename}"? This will also remove it from the knowledge base.`
      )
    )
      return;
    try {
      await documentsAPI.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const filtered = documents.filter((d) => {
    const matchSearch = d.filename
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Ready" && d.status === "ready") ||
      (activeFilter === "Indexing" && d.status === "processing") ||
      (activeFilter === "Errors" && d.status === "error");
    return matchSearch && matchFilter;
  });

  const stats = [
    ["Total documents", String(documents.length)],
    [
      "Clauses indexed",
      documents.reduce((a, d) => a + d.chunk_count, 0).toLocaleString(),
    ],
    [
      "Storage used",
      formatSize(documents.reduce((a, d) => a + d.file_size, 0)),
    ],
    ["Last sync", "Just now"],
  ] as const;

  return (
    <div
      style={{
        overflow: "auto",
        height: "100%",
        background: "var(--bg)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "28px 36px 20px",
          borderBottom: "1px solid var(--border-faint)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Admin
          </div>
          <h1
            className="display"
            style={{ fontSize: 32, fontWeight: 500, marginBottom: 6 }}
          >
            Knowledge base
          </h1>
          <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>
            Upload and manage legal documents. Chunks are embedded and indexed
            automatically.
          </p>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="btn btn-accent"
          style={{ padding: "10px 16px", fontSize: 14, flexShrink: 0 }}
        >
          <Upload size={14} /> Upload document
        </button>
      </div>

      {/* Upload area (toggleable) */}
      {showUpload && (
        <div style={{ padding: "20px 36px 0" }}>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 14,
              padding: 32,
              textAlign: "center",
              cursor: "pointer",
              background: isDragActive ? "var(--accent-soft)" : "var(--bg-elev)",
              transition: "all 0.2s var(--ease)",
            }}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: 99, animation: "spin 0.8s linear infinite" }} />
                <p style={{ color: "var(--fg-muted)", fontSize: 14 }}>Uploading...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Upload size={28} style={{ color: "var(--fg-faint)" }} />
                <p style={{ fontWeight: 500, fontSize: 14 }}>
                  {isDragActive ? "Drop files here" : "Drag & drop or click to upload"}
                </p>
                <p style={{ fontSize: 13, color: "var(--fg-muted)" }}>
                  PDF, DOCX, or HTML (max 50MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div
        style={{
          padding: "20px 36px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
          borderBottom: "1px solid var(--border-faint)",
        }}
      >
        {stats.map(([label, value], i) => (
          <div
            key={label}
            style={{
              padding: "14px 20px",
              borderLeft:
                i === 0 ? "none" : "1px solid var(--border-faint)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--fg-muted)",
                marginBottom: 4,
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 500,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div
        style={{
          padding: "16px 36px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          borderBottom: "1px solid var(--border-faint)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{ position: "relative", flex: 1, maxWidth: 360 }}
        >
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-faint)",
            }}
          />
          <input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px 9px 34px",
              background: "var(--bg-elev)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 13,
              outline: "none",
              color: "var(--fg)",
            }}
          />
        </div>
        {(["All", "Ready", "Indexing", "Errors"] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveFilter(t)}
            style={{
              padding: "7px 14px",
              borderRadius: 99,
              fontSize: 13,
              border: "1px solid var(--border)",
              background: activeFilter === t ? "var(--fg)" : "transparent",
              color: activeFilter === t ? "var(--bg)" : "var(--fg-muted)",
              cursor: "pointer",
              transition: "all 0.2s var(--ease)",
            }}
          >
            {t}
          </button>
        ))}
        <button
          className="btn btn-ghost"
          style={{ marginLeft: "auto", padding: "7px 12px", fontSize: 13 }}
        >
          <Settings size={13} /> Sort
        </button>
      </div>

      {/* Document list */}
      <div
        style={{
          padding: "20px 36px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <div style={{ width: 28, height: 28, border: "3px solid var(--accent)", borderTopColor: "transparent", borderRadius: 99, animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              color: "var(--fg-faint)",
            }}
          >
            <FileText size={40} style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
              No documents found
            </p>
            <p style={{ fontSize: 13, color: "var(--fg-faint)" }}>
              {documents.length === 0
                ? "Upload legal documents to build the knowledge base"
                : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          filtered.map((doc, i) => (
            <div
              key={doc.id}
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                background: "var(--bg-elev)",
                border: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "40px 1fr auto auto auto",
                alignItems: "center",
                gap: 16,
                transition: "all 0.2s var(--ease)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-strong)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <FileText size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc.filename}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--fg-faint)",
                    fontFamily: "var(--font-mono)",
                    display: "flex",
                    gap: 14,
                  }}
                >
                  <span>{doc.file_type.toUpperCase()}</span>
                  <span>{formatSize(doc.file_size)}</span>
                  <span>{doc.chunk_count} chunks</span>
                  <span>
                    {new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <StatusBadge status={doc.status} />
              <button
                style={{
                  padding: 8,
                  borderRadius: 8,
                  color: "var(--fg-muted)",
                  transition: "background 0.15s var(--ease)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Eye size={15} />
              </button>
              <button
                onClick={() => handleDelete(doc.id, doc.filename)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  color: "var(--fg-muted)",
                  transition: "all 0.15s var(--ease)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "color-mix(in oklch, var(--accent) 12%, transparent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--fg-muted)";
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
