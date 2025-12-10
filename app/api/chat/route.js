// app/api/chat/route.js
import { NextResponse } from "next/server";
import { chatOnce } from "../../lib/qwenChat";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body?.message;
    const history = body?.history || [];

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    const { reply, history: newHistory } = await chatOnce(message, history);

    return NextResponse.json({
      reply,
      history: newHistory,
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Failed to reach the model server. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}
