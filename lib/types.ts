export type VideoItem = {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: { id: string; title: string; url: string };
  publishedAt: string; // ISO8601
  views: number;
  subscribers: number | null; // null means hidden; subsFloor applies
  ratio: number; // views / max(subscribers, subsFloor)
  duration: number; // seconds
  isShorts: boolean;
  url: string;
};

export type SearchQuery = {
  region: string;
  from: string; // ISO8601
  to: string;   // ISO8601
  q?: string;
  type?: "long" | "short" | "any";
  minViews?: number;
  minSubs?: number;
  subsFloor?: 500 | 1000 | 5000 | number;
  sort?: "ratio" | "views" | "subs" | "publishedAt";
  categoryId?: number;
  page?: number;
  pageSize?: number;
};

export type SearchResponse = {
  items: VideoItem[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiError = {
  error: { code: string; message: string; requestId?: string };
};
