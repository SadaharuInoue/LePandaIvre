"use client";

import { useState } from "react";

// テキストをクリップボードにコピーする小さなボタン。
// コピー成功後は2秒間だけ表示を切り替えてフィードバックする。
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では何もしない
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
        copied
          ? "bg-accent text-accent-contrast"
          : "border border-line bg-card hover:border-accent hover:text-accent"
      }`}
    >
      {copied ? "✓ コピーしました" : "コピーする"}
    </button>
  );
}
