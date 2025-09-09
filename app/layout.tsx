import "./globals.css";
import type { ReactNode } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "V/S Radar | YouTube Ratio Finder",
  description: "Find rising videos by views/subscribers ratio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <nav className="site-nav">
            <div className="brand">
              <span className="brand-mark" aria-hidden />
              <strong>V/S Radar</strong>
            </div>
            <div className="nav-actions">
              <a className="nav-link" href="#how">使い方</a>
              <a className="nav-link" href="#quick">クイック検索</a>
              <ThemeToggle />
              <a className="cta" href="#">サインイン</a>
            </div>
          </nav>
          {children}
          <footer style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="muted">MVP prototype — dummy data</span>
            <a className="pill" href="https://nextjs.org" target="_blank" rel="noreferrer">Built with Next.js</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
