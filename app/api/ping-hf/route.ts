// app/api/ping-hf/route.ts
import { pingSpace } from "@/lib/qwenChat";

export const runtime = "edge"; // or "nodejs"

export async function GET() {
  await pingSpace();
  return new Response("ok");
}
