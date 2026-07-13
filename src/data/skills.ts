import type { SkillCategory } from "./types";

export const skills: SkillCategory[] = [
  {
    title: "上流工程・プロジェクトマネジメント",
    emoji: "🧭",
    summary:
      "医療機器・医療情報システム歴 約25年。発注者側に立った上流支援が専門領域です。",
    items: [
      "ベンダー選定・RFP作成",
      "要件定義・基本設計",
      "サーバー / システム移行PM",
      "リリース管理・保守運用",
      "費用交渉・ベンダーコントロール",
      "医療ドメイン知識（医療機器・医療情報システム）",
    ],
  },
  {
    title: "開発・インフラ",
    emoji: "🛠️",
    summary:
      "業務システムの堅実なスタックから、モダンなWeb開発まで。設計〜開発〜テスト〜リリースを一通り。",
    items: [
      "C# / PostgreSQL",
      "Next.js / React / TypeScript",
      "Go / Prisma",
      "Docker",
      "Ubuntu Server 構築（Samba, Tailscale VPN）",
      "Git / GitHub",
    ],
  },
  {
    title: "AI活用開発",
    emoji: "🤖",
    summary:
      "生成AIを「試す」段階から「日常の道具」として使い込む段階へ。開発・リサーチ・ナレッジ運用に組み込んでいます。",
    items: [
      "Claude Code の実務活用",
      "NotebookLM + Gemini による自動リサーチパイプライン構築",
      "Garmin Monkey C ウォッチフェイスのAI協働開発",
      "ローカルLLM（Ollama）の検証",
      "RAG・マルチエージェント等のAIエージェント技術サーベイ",
    ],
  },
];
