import { NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Proxy route that connects the Vercel AI SDK useChat hook to the FastAPI backend.
 * Forwards the request to FastAPI's SSE endpoint and re-streams the response.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, sessionId, language = "en" } = body;

  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  // Build query params for FastAPI SSE endpoint
  const params = new URLSearchParams({
    message,
    language,
    ...(sessionId && { session_id: sessionId }),
  });

  const backendUrl = `${API_BASE_URL}/chat/stream?${params.toString()}`;

  const backendResponse = await fetch(backendUrl, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!backendResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Backend request failed" }),
      { status: backendResponse.status }
    );
  }

  // Re-stream the SSE response from FastAPI as a readable stream
  // The frontend useChat hook will parse this as SSE
  return new Response(backendResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
