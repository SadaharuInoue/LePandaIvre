import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import KansaiGame from "@/components/kansai/KansaiGame";

export const metadata: Metadata = {
  title: "関西人分の1 — もしも関西のどこかに生まれたら | LePandaIvre",
  description:
    "関西2府4県のどこかに、人口の比率でランダムに生まれるテキスト人生シミュレーション。方言、地場産業、お祭り、進学や就職で町を出るか残るか——選んだ道で人生が描かれます。",
};

export default function KansaiPage() {
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
        <KansaiGame />
      </main>
      <Footer />
    </>
  );
}
