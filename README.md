# LePandaIvre

Sadaharu Inoue / LePandaIvre のポートフォリオサイト。

医療IT × AI × 農業 —— 医療システム歴25年のエンジニア/PMとしての経歴、AI活用開発の実践、note「ガラムマサラ」での執筆活動、自然農法への取り組みをまとめたシングルページサイトです。

公開URL: https://sadaharuinoue.github.io/LePandaIvre/

## 技術構成

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- 静的エクスポート（`output: "export"`）で GitHub Pages に配信
- ダーク/ライトはOS設定（`prefers-color-scheme`）に自動追従

## 開発

```bash
npm install
npm run dev    # http://localhost:3000/LePandaIvre/ で確認
npm run build  # out/ に静的ファイルを生成
```

## コンテンツの更新方法

掲載内容はすべて `src/data/` のデータファイルに分離してあります。文言の修正・項目の追加はデータファイルの編集だけで完結します。

| ファイル | 内容 |
|---|---|
| `src/data/profile.ts` | 名前・キャッチコピー・自己紹介文 |
| `src/data/skills.ts` | スキル（3カテゴリ） |
| `src/data/projects.ts` | プロジェクト一覧 |
| `src/data/writing.ts` | note執筆テーマと代表記事 |
| `src/data/interests.ts` | 興味関心 |
| `src/data/links.ts` | note / X / GitHub などの外部リンク |

## デプロイ

`main` ブランチへの push で `.github/workflows/deploy.yml` が走り、GitHub Pages へ自動デプロイされます。

**初回のみ必要な設定**: リポジトリの Settings → Pages → 「Build and deployment」の Source を **GitHub Actions** に変更してください。
