import Image from "next/image";
import Link from "next/link";
import { fmtDuration, fmtNumber } from "@/lib/utils";
import type { VideoItem } from "@/lib/types";

export default function ResultsTable({ items }: { items: VideoItem[] }) {
  return (
    <div className="card table-card scroll-x">
      <table>
        <thead>
          <tr>
            <th>サムネ</th>
            <th>タイトル</th>
            <th>チャンネル</th>
            <th>再生数</th>
            <th>登録者数</th>
            <th>V/S比</th>
            <th>投稿日</th>
            <th>長さ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.videoId}>
              <td>
                <Link href={v.url} target="_blank">
                  {/* Use standard img to avoid domain config issues in dev */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumbnail} alt="thumb" width={120} height={68} style={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                </Link>
              </td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 520 }}>
                  <Link className="line-clamp-2" href={v.url} target="_blank">{v.title} ↗</Link>
                  <span className="pill">{v.isShorts ? "Shorts" : "長尺"}</span>
                </div>
              </td>
              <td>
                <Link href={v.channel.url} target="_blank">{v.channel.title} ↗</Link>
              </td>
              <td className="num">{fmtNumber(v.views)}</td>
              <td className="num">{v.subscribers === null ? <span className="muted">非公開</span> : fmtNumber(v.subscribers)}</td>
              <td>
                <span className={v.ratio >= 1 ? "badge badge-green" : "badge badge-blue"}>
                  {v.ratio.toFixed(1)}x
                </span>
              </td>
              <td>{new Date(v.publishedAt).toLocaleDateString("ja-JP")}</td>
              <td>{fmtDuration(v.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
