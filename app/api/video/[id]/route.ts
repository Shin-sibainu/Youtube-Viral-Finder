import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const now = new Date();
  const sample = {
    videoId: id,
    title: `Sample Video ${id}`,
    channel: { id: "ch_1", title: "Studio K", subscribers: 3000 },
    publishedAt: new Date(now.getTime() - 86400000).toISOString(),
    views: 120000,
    duration: 482,
    isShorts: false,
  };
  return new Response(JSON.stringify(sample), { headers: { "content-type": "application/json" } });
}

