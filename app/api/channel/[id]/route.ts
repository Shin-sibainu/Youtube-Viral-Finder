import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const sample = { id, title: "Studio K", subscribers: 3000, country: "JP" };
  return new Response(JSON.stringify(sample), { headers: { "content-type": "application/json" } });
}

