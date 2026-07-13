import type { Project } from "./types";

export const projects: Project[] = [
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
