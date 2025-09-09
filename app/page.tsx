import SearchForm from "@/components/SearchForm";

export default function Page() {
  return (
    <main>
      <section className="hero">
        <h2>
          視聴数 ÷ 登録者数（V/S比）で伸び動画を発見
          <span className="label-beta">ベータ</span>
        </h2>
        <p className="lead">話題化の兆しを、チャンネル規模に左右されずに掴む。条件を選んで「検索」を押すだけ。</p>
      </section>

      <SearchForm />

      <div style={{ height: 12 }} />
      <section id="how">
        <div className="card">
          <div className="steps">
            <div className="step">
              <span className="step-index">1</span>
              <p>地域・期間・種別を選びます。迷ったら「1ヶ月・長尺」でOK。</p>
            </div>
            <div className="step">
              <span className="step-index">2</span>
              <p>最低再生数・登録者数でノイズを除去。デフォルト推奨値があります。</p>
            </div>
            <div className="step">
              <span className="step-index">3</span>
              <p>V/S比の高い順で一覧表示。気になる動画を開いて確認しましょう。</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
