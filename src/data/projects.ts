import type { Project } from "./types";

export const projects: Project[] = [
  {
    title: "月々1万円の罠 — リボ払い体験ゲーム",
    emoji: "💳",
    description:
      "「毎月のお支払いは1万円でOK」。新社会人になって24ヶ月、買いたいものや避けられない出費にリボ払いを使い続けるとどうなるのか。残高が増え、利息が元金を飲み込んでいく様子を、遊びながら体感できるブラウザゲームです。",
    tags: ["ブラウザゲーム", "金融リテラシー", "Next.js", "AI協働開発"],
    link: {
      label: "遊んでみる",
      url: "/revo/",
    },
  },
  {
    title: "関西人分の1 — もしも関西のどこかに生まれたら",
    emoji: "🎲",
    description:
      "関西2府4県のどこかに、人口の比率でランダムに生まれるテキスト人生シミュレーション。その土地の方言・地場産業・お祭りに触れながら、進学や就職で町を出るか、地元に残るかを選んでいきます。遊びながら関西の市町村のまめ知識が身につくブラウザゲームです。",
    tags: ["ブラウザゲーム", "地域・方言", "Next.js", "AI協働開発"],
    link: {
      label: "遊んでみる",
      url: "/kansai/",
    },
  },
  {
    title: "VibeShield — 社内AI開発を安全に進める仕組み",
    emoji: "🛡️",
    description:
      "現場の人がAIと一緒に業務アプリをどんどん作れるようにしながら、会社の大事なデータを壊さない・散らばらせないための「安全な土台」の設計提案。共通ログイン・見る専用の窓口・ためる専用の窓口の3つの仕組みと、現場に配るAIへの指示文まで設計しています。",
    tags: ["社内AI活用", "アーキテクチャ設計", "セキュリティ", "バイブコーディング"],
    link: {
      label: "提案ページを見る",
      url: "/vibeshield/",
    },
  },
  {
    title: "Garmin ウォッチフェイス自作",
    emoji: "⌚",
    description:
      "Garmin Instinct 3 AMOLED 向けのウォッチフェイスを Monkey C で開発。「体のアクセルと燃料」をコンセプトにしたダッシュボード設計で、AMOLEDの焼き付き対策やnullセーフ設計まで作り込み。AIとの協働開発の実践例です。",
    tags: ["Monkey C", "Garmin", "AI協働開発"],
  },
  {
    title: "Obsidian × AI ナレッジ運用システム",
    emoji: "📚",
    description:
      "PARA / Zettelkasten をベースにした Obsidian Vault に Claude Code を組み込み、デイリーノートのAIレビュー・タスク棚卸し・記録の自動集計まで回る自作システムを設計・運用。「書くときはゼロ判断、整理はAIに」の思想で継続しています。",
    tags: ["Obsidian", "Claude Code", "GTD", "Dataview"],
  },
  {
    title: "AIリサーチパイプライン",
    emoji: "🔬",
    description:
      "NotebookLM MCP + Gemini を組み込んだ構造化リサーチのパイプラインを構築。AIエージェント技術、不耕起栽培、自然農法などのテーマで、学術論文を含む40本超のサーベイノートを体系化しています。",
    tags: ["NotebookLM", "MCP", "Gemini", "リサーチ"],
  },
  {
    title: "自然農法への転換（半農半IT構想）",
    emoji: "🌱",
    description:
      "大阪・河内長野の実家の田畑を自然農法へ転換する実践プロジェクト。不耕起栽培や土壌マイクロバイオームを学術レベルで調べながら、手を動かして試しています。ITの仕事と農業を組み合わせた「半農半IT」が将来の構想です。",
    tags: ["自然農法", "不耕起栽培", "河内長野"],
  },
];
