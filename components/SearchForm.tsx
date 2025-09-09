"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toISOEnd, toISOStart } from "@/lib/utils";

type Period = "1w" | "1m" | "3m" | "custom";

export default function SearchForm() {
  const router = useRouter();
  const [region, setRegion] = useState("JP");
  const [period, setPeriod] = useState<Period>("1m");
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState("");
  const [type, setType] = useState<"long" | "short" | "any">("long");
  const [q, setQ] = useState("");
  const [minViews, setMinViews] = useState(10000);
  const [minSubs, setMinSubs] = useState(1000);
  const [subsFloor, setSubsFloor] = useState<500 | 1000 | 5000>(1000);
  const [sort, setSort] = useState<"ratio" | "views" | "subs" | "publishedAt">("ratio");
  const [error, setError] = useState<string | null>(null);

  function calcPresetRange(p: Period) {
    const now = new Date();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
    const start = new Date(end);
    if (p === "1w") start.setUTCDate(start.getUTCDate() - 7);
    if (p === "1m") start.setUTCMonth(start.getUTCMonth() - 1);
    if (p === "3m") start.setUTCMonth(start.getUTCMonth() - 3);
    return { fromISO: start.toISOString(), toISO: end.toISOString() };
  }

  function buildQuery() {
    let fromISO: string | null = null;
    let toISO: string | null = null;

    if (period === "custom") {
      fromISO = toISOStart(from || "");
      toISO = toISOEnd(to || "");
    } else {
      const preset = calcPresetRange(period);
      fromISO = preset.fromISO;
      toISO = preset.toISO;
    }

    if (!fromISO || !toISO) {
      setError("日付範囲が不正です");
      return null;
    }
    if (new Date(fromISO) > new Date(toISO)) {
      setError("from ≤ to を満たしてください");
      return null;
    }
    if (minViews < 0 || minSubs < 0) {
      setError("minViews と minSubs は0以上");
      return null;
    }

    const params = new URLSearchParams({
      region,
      from: fromISO,
      to: toISO,
      type,
      minViews: String(minViews),
      minSubs: String(minSubs),
      subsFloor: String(subsFloor),
      sort,
      page: "1",
      pageSize: "50",
    });
    if (q) params.set("q", q);
    return params.toString();
  }

  function buildQueryFrom(overrides: Partial<{
    region: string;
    period: Period;
    type: "long" | "short" | "any";
    minViews: number;
    minSubs: number;
    subsFloor: 500 | 1000 | 5000;
    sort: "ratio" | "views" | "subs" | "publishedAt";
  }>) {
    const p = overrides.period ?? period;
    const { fromISO, toISO } = p === "custom"
      ? { fromISO: toISOStart(overrides.from as any)!, toISO: toISOEnd(overrides.to as any)! }
      : calcPresetRange(p);
    const params = new URLSearchParams({
      region: overrides.region ?? region,
      from: fromISO,
      to: toISO,
      type: overrides.type ?? type,
      minViews: String(overrides.minViews ?? minViews),
      minSubs: String(overrides.minSubs ?? minSubs),
      subsFloor: String(overrides.subsFloor ?? subsFloor),
      sort: overrides.sort ?? sort,
      page: "1",
      pageSize: "50",
    });
    return params.toString();
  }

  function quickSearch(preset: "jp1m" | "shorts1w" | "us3m") {
    const qs =
      preset === "jp1m"
        ? buildQueryFrom({ region: "JP", period: "1m", type: "long", minViews: 10000, minSubs: 1000, subsFloor: 1000, sort: "ratio" })
        : preset === "shorts1w"
        ? buildQueryFrom({ region: "JP", period: "1w", type: "short", minViews: 5000, minSubs: 500, subsFloor: 1000, sort: "ratio" })
        : buildQueryFrom({ region: "US", period: "3m", type: "any", minViews: 30000, minSubs: 2000, subsFloor: 5000, sort: "ratio" });
    router.push(`/results?${qs}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const qs = buildQuery();
    if (!qs) return;
    router.push(`/results?${qs}`);
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <div className="quick-row" id="quick" style={{ marginBottom: 8 }}>
        <button type="button" className="chip" onClick={() => quickSearch("jp1m")}>クイック: JP・1ヶ月・長尺</button>
        <button type="button" className="chip" onClick={() => quickSearch("shorts1w")}>クイック: JP・1週間・Shorts</button>
        <button type="button" className="chip" onClick={() => quickSearch("us3m")}>クイック: US・3ヶ月・全部</button>
      </div>

      <div className="grid grid-3">
        <div className="col field">
          <label>地域 (region)</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="JP">JP</option>
            <option value="US">US</option>
            <option value="GB">GB</option>
            <option value="KR">KR</option>
          </select>
          <div className="hint">対象国のトレンドを抽出します。</div>
        </div>

        <div className="col field">
          <label>期間プリセット</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
            <option value="1w">1週間</option>
            <option value="1m">1ヶ月</option>
            <option value="3m">3ヶ月</option>
            <option value="custom">カスタム</option>
          </select>
          <div className="hint">カスタム選択で日付指定が可能です。</div>
        </div>

        {period === "custom" && (
          <>
            <div className="col field">
              <label>From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="col field">
              <label>To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </>
        )}

        <div className="col field">
          <label>種別</label>
          <div className="segmented" role="tablist" aria-label="Type">
            <button type="button" role="tab" aria-selected={type === "long"} className={type === "long" ? "active" : ""} onClick={() => setType("long")}>長尺</button>
            <button type="button" role="tab" aria-selected={type === "short"} className={type === "short" ? "active" : ""} onClick={() => setType("short")}>Shorts</button>
            <button type="button" role="tab" aria-selected={type === "any"} className={type === "any" ? "active" : ""} onClick={() => setType("any")}>両方</button>
          </div>
          <div className="hint">Shorts だけ、または長尺に絞り込み。</div>
        </div>

        <div className="col field" style={{ minWidth: 260 }}>
          <label>タイトルに含むキーワード</label>
          <input
            type="text"
            placeholder="例: Vibe Coding"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="hint">タイトル部分一致でフィルタします。</div>
        </div>

        <div className="col field">
          <label>最低再生数</label>
          <input placeholder="10,000" min={0} type="number" value={minViews} onChange={(e) => setMinViews(parseInt(e.target.value || "0", 10))} />
          <div className="hint">ノイズ除去の目安: 5,000〜30,000</div>
        </div>
        <div className="col field">
          <label>最低登録者数</label>
          <input placeholder="1,000" min={0} type="number" value={minSubs} onChange={(e) => setMinSubs(parseInt(e.target.value || "0", 10))} />
          <div className="hint">未知の小規模チャンネルを外す目安</div>
        </div>
        <div className="col field">
          <label>登録者下駄</label>
          <select value={subsFloor} onChange={(e) => setSubsFloor(parseInt(e.target.value, 10) as any)}>
            <option value={500}>500</option>
            <option value={1000}>1,000</option>
            <option value={5000}>5,000</option>
          </select>
          <div className="hint">V/S比の計算で分母の下限に使用</div>
        </div>

        <div className="col field">
          <label>並び替え</label>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="ratio">V/S比（降順）</option>
            <option value="views">再生数</option>
            <option value="subs">登録者数</option>
            <option value="publishedAt">投稿日</option>
          </select>
          <div className="hint">まずは V/S 比から確認するのがおすすめ</div>
        </div>
      </div>

      {error && (
        <div style={{ color: "#fda4af", marginTop: 10 }}>{error}</div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button className="btn btn-primary" type="submit">検索</button>
        <button className="btn btn-ghost" type="reset" onClick={() => window.location.reload()}>リセット</button>
      </div>
    </form>
  );
}
