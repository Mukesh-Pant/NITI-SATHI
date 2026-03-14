export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
  preferred_language: "en" | "ne";
  is_active: boolean;
  created_at: string;
}

export interface Citation {
  document_name: string;
  chunk_text: string;
  article_section?: string;
  page_number?: number;
  relevance_score: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  language: "en" | "ne";
  created_at: string;
}

export interface Session {
  id: string;
  title: string | null;
  language: "en" | "ne";
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface SessionDetail extends Session {
  messages: Message[];
}

export interface LegalDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  status: "processing" | "ready" | "error";
  error_message?: string;
  uploaded_at: string;
}

export interface ChatResponse {
  response: string;
  citations: Citation[];
  session_id: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}
