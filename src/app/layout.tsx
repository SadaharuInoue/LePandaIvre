import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sadaharu Inoue / LePandaIvre — ポートフォリオ",
  description:
    "医療IT × AI × 農業。医療システム歴25年のエンジニア/PM、AI活用開発の実践者、そして自然農法に挑む「半農半IT」志望。note「ガラムマサラ」で120本以上執筆。",
  openGraph: {
    title: "Sadaharu Inoue / LePandaIvre — ポートフォリオ",
    description:
      "医療IT × AI × 農業。医療システム歴25年のエンジニア/PM、AI活用開発の実践者、そして自然農法に挑む「半農半IT」志望。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
