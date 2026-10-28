import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import RevoGame from "@/components/revo/RevoGame";

export const metadata: Metadata = {
  title: "月々1万円の罠 — リボ払い体験ゲーム | LePandaIvre",
  description:
    "「毎月のお支払いは1万円でOK」。新社会人になって24ヶ月、買いたいもの・避けられない出費にリボ払いを使い続けたら、残高と利息はどうなる？ リボ払いの怖さを遊んで体感できるブラウザゲームです。",
};

export default function RevoPage() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" className="text-base font-bold">
            🐼 LePandaIvre
          </Link>
          <Link href="/" className="text-sm font-semibold text-accent">
            トップへ戻る
          </Link>
        </div>
      </header>
      <main className="min-h-[70vh]">
        <RevoGame />
      </main>
      <Footer />
    </>
  );
}
