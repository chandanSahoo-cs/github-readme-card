/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/card/route.ts
import { profileSVG } from "@/app/lib/svg";

export async function GET() {
  const svg = await profileSVG();
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}

/* eslint-enable @typescript-eslint/no-explicit-any */
