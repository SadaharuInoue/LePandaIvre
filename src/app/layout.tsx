import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sadaharu Inoue / LePandaIvre — ポートフォリオ",
  description:
    "ITコンサルティング × AI実践 × 農業。医療システム歴25年。ベンダー選定・要件定義・移行PMからAI活用支援まで、ITの困りごとを上流から伴走します。note「ガラムマサラ」で120本以上執筆。",
  openGraph: {
    title: "Sadaharu Inoue / LePandaIvre — ポートフォリオ",
    description:
      "ITコンサルティング × AI実践 × 農業。医療システム歴25年。ベンダー選定・要件定義・移行PMからAI活用支援まで、ITの困りごとを上流から伴走します。",
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
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
