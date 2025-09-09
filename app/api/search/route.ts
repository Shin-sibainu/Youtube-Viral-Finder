import { NextRequest } from "next/server";
import { generateMockResults } from "@/lib/mock";
import type { SearchQuery } from "@/lib/types";

function json(data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), { ...init, headers: { "content-type": "application/json", ...(init?.headers || {}) } });
}

function bad(message: string) {
  return json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams;

  const region = q.get("region");
  const from = q.get("from");
  const to = q.get("to");
  if (!region || !from || !to) return bad("region/from/to は必須です");

  const type = (q.get("type") as any) ?? "long";
  if (!["long", "short", "any"].includes(type)) return bad("type が不正です");

  const minViews = Number(q.get("minViews") ?? "10000");
  const minSubs = Number(q.get("minSubs") ?? "1000");
  const subsFloor = Number(q.get("subsFloor") ?? "1000");
  const sort = (q.get("sort") as any) ?? "ratio";
  if (!["ratio", "views", "subs", "publishedAt"].includes(sort)) return bad("sort が不正です");

  const page = Math.max(1, Number(q.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(10, Number(q.get("pageSize") ?? "50")));

  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return bad("from/to はISO8601で指定してください");
  if (fromDate > toDate) return bad("from ≤ to を満たしてください");
  if (minViews < 0 || minSubs < 0) return bad("minViews/minSubs は0以上");

  const titleQ = q.get("q") || undefined;
  const query: SearchQuery = { region, from, to, q: titleQ, type, minViews, minSubs, subsFloor: subsFloor as any, sort, page, pageSize };

  // M0: return mock results; M1: proxy to Cloudflare Worker BFF
  const data = generateMockResults(query, 250);
  return json(data, { status: 200 });
}
