import ResultsTable from "@/components/ResultsTable";
import ExportButton from "@/components/ExportButton";
import type { SearchResponse } from "@/lib/types";
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // do not cache in dev

export default async function ResultsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") qs.set(k, v);
  }

  const baseEnv = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
  const hdrs = headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("host") ?? "localhost:3000";
  const fallbackBase = `${proto}://${host}`;
  const base = baseEnv || fallbackBase;
  let res: Response;
  try {
    res = await fetch(`${base}/api/search?${qs.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (e: any) {
    return (
      <main>
        <div className="card" style={{ color: "#fda4af" }}>
          API接続に失敗しました。サーバー起動や NEXT_PUBLIC_API_BASE の設定を確認してください。
        </div>
      </main>
    );
  }

  let data: SearchResponse | null = null;
  let error: string | null = null;
  const src = res.headers.get("x-source") || (baseEnv ? "bff" : "next");
  if (!res.ok) {
    try {
      const body = await res.json();
      error = body?.error?.message || `API Error ${res.status}`;
    } catch {
      error = `API Error ${res.status}`;
    }
  } else {
    data = (await res.json()) as SearchResponse;
  }

  const query = Object.fromEntries(qs.entries());

  return (
    <main>
      <div className="toolbar">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="pill">region: {qs.get("region")}</span>
          <span className="pill">type: {qs.get("type") ?? "long"}</span>
          <span className="pill">from: {qs.get("from")}</span>
          <span className="pill">to: {qs.get("to")}</span>
          <span className="pill">sort: {qs.get("sort") ?? "ratio"}</span>
          {qs.get("q") ? <span className="pill">q: {qs.get("q")}</span> : null}
          <span className="pill">source: {src}</span>
        </div>
        <div className="spacer" />
        <ExportButton query={query} />
      </div>

      {error ? (
        <div className="card" style={{ color: "#fda4af" }}>
          エラー: {error}
        </div>
      ) : (
        <>
          {data && data.items && data.items.length === 0 ? (
            <div className="card" style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="brand-mark" aria-hidden />
                <strong>該当する動画が見つかりませんでした</strong>
              </div>
              <span className="muted">条件を少しゆるめて再検索してみてください（最低再生数や登録者数を下げる、期間を広げる 等）。</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="chip" href={`/results?${new URLSearchParams({ ...query, minViews: String(Math.max(0, Number(query.minViews ?? 0) / 2)) })}`}>最低再生数を半分に</a>
                <a className="chip" href={`/results?${new URLSearchParams({ ...query, minSubs: String(Math.max(0, Number(query.minSubs ?? 0) / 2)) })}`}>最低登録者数を半分に</a>
                <a className="chip" href={`/results?${new URLSearchParams({ ...query, period: "3m" })}`}>期間を3ヶ月に</a>
              </div>
            </div>
          ) : (
            <ResultsTable items={data?.items ?? []} />
          )}

          <div className="toolbar">
            <span className="muted">
              {data?.page ?? 1} / {Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 50)))} ページ （全 {data?.total ?? 0} 件）
            </span>
            <div className="spacer" />
            <a
              className="btn btn-ghost pill"
              href={`/results?${new URLSearchParams({ ...query, page: String(Math.max(1, (data?.page ?? 1) - 1)) })}`}
            >
              ◀ 前へ
            </a>
            <a
              className="btn btn-ghost pill"
              href={`/results?${new URLSearchParams({ ...query, page: String((data?.page ?? 1) + 1) })}`}
            >
              次へ ▶
            </a>
          </div>
        </>
      )}
    </main>
  );
}
