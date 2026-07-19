import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Section from "@/components/Section";
import CopyButton from "@/components/CopyButton";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "VibeShield — 社内AI開発を安全に進める仕組み | LePandaIvre",
  description:
    "現場の人がAIと一緒に業務アプリをどんどん作れるようにしながら、会社の大事なデータを壊さない・散らばらせないための「安全な土台」の設計提案です。",
};

const navItems = [
  { href: "#why", label: "なぜ必要？" },
  { href: "#architecture", label: "全体像" },
  { href: "#pillars", label: "3つの仕組み" },
  { href: "#prompt", label: "AIへの指示文" },
];

// 現場に配布する、AIへの基本指示文（コピーボタンでもこの内容を使う）
const promptText = `あなたは、当社の社内業務アプリづくりを手伝うアシスタントです。
コードを作るときは、次の3つのルールを必ず守ってください。

1.【必ずログインを通す】
   アプリを起動したとき、そしてデータをやり取りする前に、必ず会社が用意した
   共通ログインの仕組みを通してください。ログインなしの通信は作らないでください。

2.【職員・顧客などのデータは「見る専用の窓口」から取る】
   職員・顧客・取引先の情報が必要なときは、アプリの中に自前のデータを持たず、
   必ず会社が用意した「データ参照の窓口（読み取り専用API）」から
   その都度取得するコードを書いてください。

3.【データの保存は「共通のため場」だけ】
   アプリで入力したデータを保存するときは、自前のデータベースや
   バラバラの表計算ファイルを作ってはいけません。
   必ず会社が用意した「共通データ保存の窓口（保存用API）」を使って、
   決められた1か所にためるコードを書いてください。

このルールに反するコード（自前のデータ保存や、ログインなしの通信）は、
どんな理由があっても作らないでください。`;

function reveal(order: number): CSSProperties {
  return { "--reveal-delay": `${order * 90}ms` } as CSSProperties;
}

export default function VibeShieldPage() {
  return (
    <>
      {/* サブページ用ヘッダー：トップへ戻る導線とページ内ナビ */}
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <Link href="/" className="text-base font-bold">
            🐼 LePandaIvre
          </Link>
          <nav className="flex gap-3 text-sm text-muted sm:gap-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hidden transition-colors hover:text-accent sm:inline"
              >
                {item.label}
              </a>
            ))}
            <Link href="/" className="font-semibold text-accent">
              トップへ戻る
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ヒーロー */}
        <section className="relative overflow-hidden border-b border-line bg-accent-soft/60">
          <div
            aria-hidden
            className="hero-blob pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          />
          <div
            aria-hidden
            className="hero-blob-slow pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-5 py-20 sm:py-28">
            <p
              className="hero-rise text-sm font-semibold tracking-widest text-accent"
              style={{ "--rise-delay": "0ms" } as CSSProperties}
            >
              🛡️ VibeShield（バイブシールド）— 設計提案
            </p>
            <h1
              className="hero-rise mt-4 text-3xl font-bold leading-snug sm:text-5xl"
              style={{ "--rise-delay": "120ms" } as CSSProperties}
            >
              現場の「速さ」と、
              <br className="sm:hidden" />
              会社の「安心」を両立する
            </h1>
            <p
              className="hero-rise mt-8 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ "--rise-delay": "240ms" } as CSSProperties}
            >
              いま、プログラマーでなくてもAIに話しかけるだけで業務アプリを作れる時代になりました（いわゆる「バイブコーディング」）。VibeShieldは、この便利さを止めずに、会社の大事なデータを壊さない・散らばらせないための「安全な土台」の設計案です。
            </p>
            <div
              className="hero-rise mt-10 flex flex-wrap gap-4"
              style={{ "--rise-delay": "360ms" } as CSSProperties}
            >
              <a
                href="#architecture"
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:-translate-y-0.5 hover:opacity-85"
              >
                全体像を見る
              </a>
              <a
                href="#why"
                className="rounded-full border border-line bg-card px-6 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                なぜ必要？
              </a>
            </div>
          </div>
        </section>

        {/* なぜ必要？ */}
        <Section
          id="why"
          title="なぜ必要？"
          lead="AIで誰でもアプリを作れるのは素晴らしいこと。でも、野放しにすると会社としてはこんな心配があります。"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <article
              data-reveal
              style={reveal(0)}
              className="flex flex-col rounded-2xl border border-line bg-card p-6"
            >
              <h3 className="text-lg font-bold">⚠️ 野放しにした場合の心配ごと</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <li className="flex gap-2">
                  <span className="mt-0.5">✕</span>
                  <span>
                    AIが書いたコードが、職員や顧客の
                    <strong className="text-fg">大事なデータを壊してしまう</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5">✕</span>
                  <span>
                    ログインも記録もない自作アプリが増えて、
                    <strong className="text-fg">誰が何をしているか分からなくなる</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5">✕</span>
                  <span>
                    データが個人のパソコンやバラバラの表計算ファイルに
                    <strong className="text-fg">散らばってしまう</strong>
                  </span>
                </li>
              </ul>
            </article>
            <article
              data-reveal
              style={reveal(1)}
              className="flex flex-col rounded-2xl border border-accent/40 bg-card p-6"
            >
              <h3 className="text-lg font-bold text-accent-strong">
                🛡️ VibeShieldの考え方
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                <li className="flex gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>
                    大事なデータには直接触らせず、
                    <strong className="text-fg">「安全な窓口」を通してだけ</strong>
                    やり取りする
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>
                    どのアプリも共通のログインを通す。
                    <strong className="text-fg">誰がいつ使ったか記録が残る</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>
                    データの保存先を1か所に集めて、
                    <strong className="text-fg">散らばりを防ぐ</strong>
                  </span>
                </li>
              </ul>
            </article>
          </div>
        </Section>

        {/* 全体像 */}
        <Section
          id="architecture"
          title="全体像"
          lead="ポイントは「基幹システムに直接触らせない」こと。現場のアプリと大事なデータの間に、安全な窓口をはさみます。"
        >
          <div
            data-reveal
            className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5 sm:p-8"
          >
            {/* 上段：基幹システム */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg p-5">
              <div>
                <h3 className="font-bold">🏢 基幹システム（会社の大事なデータ）</h3>
                <p className="mt-1 text-xs text-muted">
                  職員・顧客・取引先の情報など。ここは絶対に壊せない場所。
                </p>
              </div>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                直接の書き込み禁止
              </span>
            </div>

            <p className="text-center text-xs text-muted">
              ↓ 必要なデータだけをコピーして渡す（読み取り専用）
            </p>

            {/* 中段：安全な窓口（API層） */}
            <div className="rounded-xl border-2 border-accent/50 bg-accent-soft/40 p-5">
              <p className="text-sm font-bold text-accent-strong">
                情報システム部門が用意する「安全な窓口」
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-line bg-card p-4 text-center">
                  <p className="text-2xl">🔑</p>
                  <h4 className="mt-1 text-sm font-bold">① 共通ログイン</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    すべての入り口。会社のアカウントでログインした人だけが使える。
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-card p-4 text-center">
                  <p className="text-2xl">👀</p>
                  <h4 className="mt-1 text-sm font-bold">② データを「見る」窓口</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    職員・顧客情報などのコピーを渡すだけ。元データは壊れない。
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-card p-4 text-center">
                  <p className="text-2xl">📦</p>
                  <h4 className="mt-1 text-sm font-bold">③ データを「ためる」窓口</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    アプリで入力したデータの保存先。1か所に集まるので散らばらない。
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted">
              ↑↓ やり取りは、すべてこの窓口を通してだけ行う
            </p>

            {/* 下段：現場のアプリ群 */}
            <div className="rounded-xl border border-line bg-bg p-5">
              <h3 className="font-bold">
                💻 現場のみなさんがAIと作るアプリたち
              </h3>
              <p className="mt-1 text-xs text-muted">
                プログラマーでなくてもOK。AIに話しかけて、どんどん作れる。
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-center text-xs sm:grid-cols-4">
                <li className="rounded-lg border border-line bg-card p-3">日報アプリ</li>
                <li className="rounded-lg border border-line bg-card p-3">備品の申請</li>
                <li className="rounded-lg border border-line bg-card p-3">顧客訪問メモ</li>
                <li className="rounded-lg border border-line bg-card p-3">予定表の連携</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 3つの仕組み */}
        <Section
          id="pillars"
          title="安心を支える3つの仕組み"
          lead="難しい仕掛けではなく、「入り口・見る・ためる」の3か所を押さえるだけ。これで現場の自由と会社の安心が両立します。"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: "🔑",
                title: "共通ログイン",
                description:
                  "どのアプリも、会社のアカウントでログインしないと使えないようにします。「誰が・いつ・どのアプリを使ったか」の記録が自動で残るので、管理する側も安心です。",
              },
              {
                emoji: "👀",
                title: "データを「見る」専用の窓口",
                description:
                  "職員や顧客の情報は、読み取り専用の窓口からだけ受け取ります。渡すのは元データのコピーなので、現場のアプリが失敗しても基幹システムのデータは壊れません。",
              },
              {
                emoji: "📦",
                title: "データを「ためる」共通の窓口",
                description:
                  "アプリで入力したデータは、共通の保存窓口を通して1か所に集めます。保存の「箱」の形は決めておき、中身は各アプリが自由に使える柔軟な設計です。",
              },
            ].map((pillar, i) => (
              <article
                key={pillar.title}
                data-reveal
                style={reveal(i)}
                className="flex flex-col rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold">
                  <span className="mr-2">{pillar.emoji}</span>
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed">{pillar.description}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* AIへの指示文 */}
        <Section
          id="prompt"
          title="現場に配る「AIへの指示文」"
          lead="アプリを作るとき、最初にAIへ渡す「お約束」の文章です。これを最初に渡しておくだけで、ルール違反のコードが作られるのを元から防げます。"
        >
          <div
            data-reveal
            className="overflow-hidden rounded-2xl border border-line bg-card"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="text-xs font-semibold text-muted">
                AIへの基本指示（配布用）
              </span>
              <CopyButton text={promptText} />
            </div>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed sm:p-6">
              {promptText}
            </pre>
          </div>
        </Section>

        {/* 保存データの形式（例） */}
        <Section
          id="data-format"
          title="保存窓口のデータ形式（例）"
          lead="保存の「箱」の形は全アプリ共通。中身（payload）は各アプリが自由に決められます。だから管理はシンプルなまま、現場は柔軟に使えます。"
        >
          <div className="grid items-start gap-6 md:grid-cols-2">
            <div data-reveal className="space-y-4">
              {[
                {
                  title: "管理がずっとシンプル",
                  description:
                    "アプリが増えても、保存の入れ物は1つのまま。システム管理側の手間が増えません。",
                },
                {
                  title: "AIと相性が良い形式",
                  description:
                    "中身はJSON（AIが最も得意とするデータの書き方）。現場のAIが安全に読み書きできます。",
                },
              ].map((point, i) => (
                <div key={point.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold">{point.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              data-reveal
              style={reveal(1)}
              className="overflow-hidden rounded-2xl border border-line bg-card"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="text-xs font-semibold text-muted">
                  保存するデータの例
                </span>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                  JSON形式
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed sm:text-sm">
{`{
  "アプリ名": "日報アプリ",
  "利用者": "user_9981a",
  "データの名前": "日報_2026_07_19",
  "中身": {
    "タイトル": "AI導入の検証報告",
    "進み具合": "85%",
    "メモ": "共通の窓口のおかげで、
            今日は現場だけで画面の
            改良まで完了できた。"
  }
}`}
              </pre>
            </div>
          </div>
        </Section>

        {/* ご相談 */}
        <section className="border-t border-line bg-accent-soft/40 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-5 text-center" data-reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">
              この仕組みの設計・構築をお手伝いします
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              便利なアプリを作るだけでなく、会社がAIの恩恵を安心して受け取り続けるための「土台」づくりから伴走します。医療システム歴25年の経験を活かし、要件整理から導入までご一緒できます。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/#contact"
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:-translate-y-0.5 hover:opacity-85"
              >
                相談してみる
              </Link>
              <Link
                href="/"
                className="rounded-full border border-line bg-card px-6 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                ポートフォリオトップへ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
