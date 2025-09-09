import { NextRequest } from "next/server";
import { generateMockResults } from "@/lib/mock";
import type { SearchQuery } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { query: SearchQuery; limit?: number };
    if (!body?.query) {
      return new Response(JSON.stringify({ error: { code: "BAD_REQUEST", message: "query が必要です" } }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const limit = Math.min(1000, Math.max(1, body.limit ?? 100));
    const data = generateMockResults(body.query, limit);

    const rows = [
      [
        "videoId",
        "title",
        "channelTitle",
        "channelId",
        "url",
        "publishedAt",
        "views",
        "subscribers",
        "ratio",
        "duration",
        "isShorts",
      ].join(","),
      ...data.items.map((v) =>
        [
          v.videoId,
          escapeCsv(v.title),
          escapeCsv(v.channel.title),
          v.channel.id,
          v.url,
          v.publishedAt,
          String(v.views),
          v.subscribers === null ? "" : String(v.subscribers),
          v.ratio.toFixed(1),
          String(v.duration),
          String(v.isShorts),
        ].join(",")
      ),
    ];
    const csv = rows.join("\n");
    return new Response(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="vs-ratio-export.csv"`,
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: { code: "BAD_REQUEST", message: "invalid body" } }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

function escapeCsv(s: string) {
  if (s.includes("\"") || s.includes(",") || s.includes("\n")) {
    return `"${s.replaceAll("\"", '""')}"`;
  }
  return s;
}

