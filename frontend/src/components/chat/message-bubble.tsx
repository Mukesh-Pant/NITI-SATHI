"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { Scale, User, Copy, Check, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Message, Citation } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [citationsExpanded, setCitationsExpanded] = useState(false);
  const isUser = message.role === "user";

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex gap-3 px-4 py-6", isUser ? "bg-background" : "bg-muted/30")}>
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback className={cn(
          "text-xs",
          isUser ? "bg-primary text-primary-foreground" : "bg-emerald-600 text-white"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {isUser ? "You" : "NITI-SATHI"}
        </p>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
          {isStreaming && !message.content && (
            <span className="inline-flex gap-1">
              <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 bg-primary rounded-full animate-bounce" />
            </span>
          )}
          {isStreaming && message.content && (
            <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-0.5" />
          )}
        </div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && !isStreaming && (
          <div className="mt-3">
            <button
              onClick={() => setCitationsExpanded(!citationsExpanded)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <FileText className="h-3.5 w-3.5" />
              {message.citations.length} source{message.citations.length > 1 ? "s" : ""}
              {citationsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {citationsExpanded && (
              <div className="mt-2 space-y-2">
                {message.citations.map((citation, i) => (
                  <CitationCard key={i} citation={citation} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy button */}
        {!isUser && message.content && !isStreaming && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={copyContent}
          >
            {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  );
}

function CitationCard({ citation, index }: { citation: Citation; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-3 bg-background text-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-start gap-2 w-full text-left"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium shrink-0">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{citation.document_name}</p>
          {citation.page_number && (
            <p className="text-xs text-muted-foreground">Page {citation.page_number}</p>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="mt-2 pl-7">
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {citation.chunk_text}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Relevance: {(citation.relevance_score * 100).toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
}
