/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/card/route.ts
import { profileSVG } from "@/app/lib/svg";
let latestSVG: string | null = null;
let latestSVGTime = 0;
const BUFFER_TIME = 1000 * 60 * 60;

export async function GET() {
  const now = Date.now();

  if (!latestSVG || now - latestSVGTime > BUFFER_TIME) {
    latestSVG = await profileSVG();
    latestSVGTime = now;
  }

  return new Response(latestSVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}

/* eslint-enable @typescript-eslint/no-explicit-any */
