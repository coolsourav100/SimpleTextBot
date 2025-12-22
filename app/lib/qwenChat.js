// lib/qwenChat.js

// You can override this via env: HF_SPACE_URL
const SPACE_URL =
  process.env.HF_SPACE_URL ||
  "https://coolsourav100-qwen-px-0-1.hf.space";
const API_BASE = "/gradio_api/call/chat";

// Helper to add a timeout around fetch
function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => {
    clearTimeout(id);
  });
}

export async function chatOnce(message, history = []) {
  const payload = { data: [message, history] };

  try {
    // STEP 1: Queue the job
    const callRes = await fetchWithTimeout(
      `${SPACE_URL}${API_BASE}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      15000 // 15s timeout for queue call
    );

    if (!callRes.ok) {
      const text = await callRes.text().catch(() => "");
      throw new Error(
        `HF queue error: HTTP ${callRes.status} ${callRes.statusText} - ${text}`
      );
    }

    const callData = await callRes.json();
    const eventId = callData.event_id;

    if (!eventId) {
      throw new Error("HF response missing event_id");
    }

    // STEP 2: Stream the result
    const streamRes = await fetchWithTimeout(
      `${SPACE_URL}${API_BASE}/${eventId}`,
      {},
      60000 // 60s timeout for generation
    );

    if (!streamRes.ok) {
      const text = await streamRes.text().catch(() => "");
      throw new Error(
        `HF stream error: HTTP ${streamRes.status} ${streamRes.statusText} - ${text}`
      );
    }

    const text = await streamRes.text();

    // SSE parsing
    const lines = text.split("\n");
    let newHistory = null;

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const raw = line.slice(6).trim();
      if (!raw || raw === "[DONE]") continue;

      try {
        const parsed = JSON.parse(raw);
        // Gradio returns ["", history]
        if (Array.isArray(parsed) && parsed.length >= 2) {
          newHistory = parsed[1];
        }
      } catch (e) {
        console.error("Failed to parse HF SSE chunk:", e);
      }
    }

    if (!Array.isArray(newHistory) || newHistory.length === 0) {
      console.error("Full SSE text from HF:", text);
      throw new Error("HF returned no valid history in SSE response");
    }

    // Extract last assistant message
    const lastMsg = newHistory[newHistory.length - 1];
    let reply = "";

    if (lastMsg && lastMsg.role === "assistant" && Array.isArray(lastMsg.content)) {
      for (const item of lastMsg.content) {
        if (item.type === "text") {
          reply = item.text;
          break;
        }
      }
    }

    if (!reply) {
      reply = "(HF returned an empty response)";
    }

    return { reply, history: newHistory };
  } catch (err) {
    console.error("❌ Error in chatOnce:", err);

    // Normalize error message for the API route
    if (String(err.message || "").includes("The user aborted a request")) {
      throw new Error(
        "Connection to HuggingFace Space timed out. Please try again."
      );
    }

    throw new Error(
      `Failed to contact HuggingFace Space: ${err.message || "Unknown error"}`
    );
  }
}




// Very small "ping" to keep / wake the Space
export async function pingSpace() {
  const payload = { data: ["ping", []] };

  try {
    const res = await fetchWithTimeout(
      `${SPACE_URL}${API_BASE}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      5000
    );

  
    console.log("HF ping status", res.status);
  } catch (err) {
    console.error("HF ping failed:", err);
  }
}
