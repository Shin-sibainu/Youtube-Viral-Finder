import { type SearchQuery, type SearchResponse, type VideoItem } from "@/lib/types";

// Deterministic PRNG for reproducible mock data
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]) {
  return arr[Math.floor(rng() * arr.length)];
}

const sampleTitles = [
  "最強の朝ルーティンで人生が変わる",
  "プロが教える簡単レシピ",
  "1週間で腕立て伏せ100回できる方法",
  "爆速で英語を伸ばす勉強法",
  "これはやばい。最新ガジェットレビュー",
  "Vlog｜休日にやって良かったこと",
  "知らないと損する節約術",
  "筋トレ初心者がまずやるべきこと",
  "1分でわかる世界のニュース",
  "神エイムを手に入れる練習法",
];

const sampleChannels = [
  { id: "ch_1", title: "Studio K", country: "JP" },
  { id: "ch_2", title: "Cooking Lab", country: "JP" },
  { id: "ch_3", title: "Daily Hacks", country: "JP" },
  { id: "ch_4", title: "Game Sensei", country: "JP" },
  { id: "ch_5", title: "Study Boost", country: "JP" },
];

export function generateMockResults(query: SearchQuery, total = 200): SearchResponse {
  const seedBase = (query.region + query.from + query.to + (query.type ?? "long")).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = mulberry32(seedBase);

  const minViews = Math.max(0, query.minViews ?? 10000);
  const minSubs = Math.max(0, query.minSubs ?? 1000);
  const subsFloor = (query.subsFloor ?? 1000) as number;
  const type = query.type ?? "long";

  const items: VideoItem[] = [];
  for (let i = 0; i < total; i++) {
    const ch = pick(rng, sampleChannels);
    const isShorts = type === "short" ? true : type === "long" ? false : rng() > 0.5;
    const duration = isShorts ? Math.max(10, Math.floor(rng() * 60)) : Math.max(61, Math.floor(rng() * 1800));

    const subscribersRaw = Math.floor(rng() * 200_000);
    const subscribers = subscribersRaw < minSubs ? minSubs + Math.floor(rng() * 50_000) : subscribersRaw;
    const subsFinal = subscribers === 0 ? null : subscribers; // some channels may hide subs; treat few as null
    const hide = rng() < 0.1; // 10% hide

    const effectiveSubs = Math.max(hide ? subsFloor : (subsFinal ?? subsFloor), subsFloor);
    const viewsBase = Math.max(minViews, Math.floor(effectiveSubs * (0.2 + rng() * 5))); // ratio 0.2x - 5x
    const views = viewsBase + Math.floor(rng() * 50_000);

    // Published within the range, roughly spread
    const fromTime = Date.parse(query.from);
    const toTime = Date.parse(query.to);
    const publishedAt = new Date(fromTime + rng() * Math.max(0, toTime - fromTime)).toISOString();

    const videoId = `vid_${i + 1}`;
    const title = pick(rng, sampleTitles);
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const ratio = views / effectiveSubs;
    items.push({
      videoId,
      title,
      thumbnail,
      channel: { id: ch.id, title: ch.title, url: `https://www.youtube.com/channel/${ch.id}` },
      publishedAt,
      views,
      subscribers: hide ? null : subscribers,
      ratio: Math.round(ratio * 10) / 10,
      duration,
      isShorts,
      url,
    });
  }

  // Filter by type
  const qLower = (query.q || "").toLowerCase();
  const filtered = items.filter((v) => {
    if (type === "short") return v.isShorts;
    if (type === "long") return !v.isShorts;
    return true;
  });

  const filteredByQ = qLower ? filtered.filter((v) => v.title.toLowerCase().includes(qLower)) : filtered;

  // Sorting
  const sort = query.sort ?? "ratio";
  filteredByQ.sort((a, b) => {
    const primary =
      sort === "ratio"
        ? b.ratio - a.ratio
        : sort === "views"
        ? b.views - a.views
        : sort === "subs"
        ? (b.subscribers ?? 0) - (a.subscribers ?? 0)
        : Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    if (primary !== 0) return primary;
    // secondary key for stability: views desc
    return b.views - a.views;
  });

  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(10, query.pageSize ?? 50));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return { items: filteredByQ.slice(start, end), page, pageSize, total: filteredByQ.length };
}
