/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/card/route.ts
import { profileSVG } from "@/app/lib/svg";

export async function GET() {
  const currentSVG = await profileSVG();

  return new Response(currentSVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=1000, stale-while-revalidate=60",
    },
  });
}

/* eslint-enable @typescript-eslint/no-explicit-any */
