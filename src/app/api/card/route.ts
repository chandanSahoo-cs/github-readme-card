/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/card/route.ts
import { fetchedData, profileSVG, type UserProfile } from "@/app/lib/svg";
let currentSVG: string | null = null;
let currentSVGTime = 0;

let currentProfileData: UserProfile | null = null;

// const BUFFER_TIME = 1000 * 60 * 60;
const BUFFER_TIME = 1000
const INTERVAL_TIME = 1000;

setInterval(async () => {
  const fetchProfileData = await fetchedData();
  if (fetchProfileData !== currentProfileData) {
    currentProfileData = fetchProfileData;
  }
}, INTERVAL_TIME);

export async function GET() {
  const now = Date.now();

  if (!currentSVG || now - currentSVGTime > BUFFER_TIME) {
    currentSVG = await profileSVG();
    currentSVGTime = now;
  }

  return new Response(currentSVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}

/* eslint-enable @typescript-eslint/no-explicit-any */
