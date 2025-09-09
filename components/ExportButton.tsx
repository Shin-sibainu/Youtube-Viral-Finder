"use client";

import { useState } from "react";

export default function ExportButton({ query }: { query: Record<string, any> }) {
  const [loading, setLoading] = useState(false);

  async function onExport() {
    try {
      setLoading(true);
      const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
      const res = await fetch(`${base}/api/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/csv" },
        body: JSON.stringify({ query, limit: 100 }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.download = `vs-ratio-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || "エクスポートに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-ghost" onClick={onExport} disabled={loading}>
      {loading ? "エクスポート中..." : "CSVエクスポート"}
    </button>
  );
}
