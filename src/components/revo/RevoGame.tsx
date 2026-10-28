"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import {
  defaultConfig,
  fill,
  paymentFor,
  payLabel,
  MONTHS,
  LIMIT_STEP,
  choicesFor,
  createLife,
  ending,
  extraRepay,
  limitOffered,
  projection,
  settle,
  yen,
  type Config,
  type Life,
  type Method,
  type Settlement,
} from "./engine";

type Phase =
  | { name: "event" }
  | {
      name: "settle";
      text: string;
      settlement: Settlement;
      offer: boolean;
    };

export default function RevoGame() {
  const [life, setLife] = useState<Life | null>(null);
  const [phase, setPhase] = useState<Phase>({ name: "event" });
  const [finished, setFinished] = useState(false);
  const [config, setConfig] = useState<Config>(defaultConfig);

  function start() {
    setLife(createLife(config));
    setPhase({ name: "event" });
    setFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!life) return <TitleScreen config={config} onChange={setConfig} onStart={start} />;

  if (finished) {
    return <Ending life={life} onRestart={() => setLife(null)} />;
  }

  function choose(index: number) {
    if (!life) return;
    const choice = choicesFor(life)[index];
    const applied = choice.apply(life);
    const settled = settle(applied.life);
    setLife(settled.life);
    setPhase({
      name: "settle",
      text: applied.text,
      settlement: settled.settlement,
      offer: limitOffered(settled.life),
    });
  }

  function answerOffer(accept: boolean) {
    if (!life || phase.name !== "settle") return;
    setLife({
      ...life,
      limit: accept ? life.limit + LIMIT_STEP : life.limit,
      lastLimitOffer: life.month,
    });
    setPhase({ ...phase, offer: false });
  }

  function repay(amount: number) {
    if (!life) return;
    setLife(extraRepay(life, amount));
  }

  function next() {
    if (!life) return;
    if (life.bust || life.month >= MONTHS) {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLife({ ...life, month: life.month + 1 });
    setPhase({ name: "event" });
  }

  const scene = life.schedule[life.month - 1];

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 md:grid-cols-[1fr_280px]">
      <div className="min-w-0">
        <Progress month={life.month} />
        {phase.name === "event" ? (
          <EventCard life={life} onChoose={choose} />
        ) : (
          <SettleCard
            key={`settle-${life.month}`}
            life={life}
            text={phase.text}
            settlement={phase.settlement}
            offer={phase.offer}
            onOffer={answerOffer}
            onRepay={repay}
            onNext={next}
            last={life.bust || life.month >= MONTHS}
            sceneTitle={scene.kind === "bonus" ? "ボーナス" : scene.item.title}
          />
        )}
      </div>
      <aside className="space-y-6">
        <StatsPanel life={life} />
      </aside>
    </div>
  );
}

const choiceBtn = (active: boolean) =>
  `rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
    active
      ? "border-accent bg-accent text-accent-contrast"
      : "border-line bg-card hover:border-accent hover:text-accent"
  }`;

function TitleScreen({
  config,
  onChange,
  onStart,
}: {
  config: Config;
  onChange: (c: Config) => void;
  onStart: () => void;
}) {
  const fixed = config.mode === "fixed";
  return (
    <section className="relative overflow-hidden border-b border-line bg-accent-soft/60">
      <div
        aria-hidden
        className="hero-blob pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <p className="text-sm font-semibold tracking-widest text-accent">
          リボ払いを体感する24ヶ月
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-snug sm:text-6xl">
          月々1万円の罠
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
          {fixed
            ? `「毎月のお支払いは、ずっと${payLabel(config)}でOK」。`
            : `「毎月のお支払いは、${payLabel(config)}から。残高に合わせて無理なく」。`}
          <br />
          新社会人のあなたは、クレジットカードを手に入れました。これから2年間、買いたくなるもの・避けられない出費が次々とやってきます。
          <br />
          リボ払いを使うか、現金で払うか、がまんするか。選んだ結果が、毎月の「明細」に現れます。
        </p>
        <ul className="mt-6 max-w-2xl space-y-1 text-sm leading-relaxed text-muted">
          <li>・手取り月24万円、生活費21万円。毎月の余裕は3万円</li>
          <li>・貯金は10万円からスタート</li>
          <li>
            ・リボ手数料は年{Math.round(config.rate * 100)}%、
            {fixed
              ? `毎月の支払いは${payLabel(config)}で固定`
              : "毎月の支払いは残高10万円ごとに5,000円ずつ増える"}
          </li>
        </ul>

        <div className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-line bg-card p-5">
          <p className="text-xs font-semibold tracking-widest text-muted">
            難易度の設定
          </p>
          <div>
            <p className="text-sm font-semibold">返済方式</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={fixed}
                onClick={() => onChange({ ...config, mode: "fixed" })}
                className={choiceBtn(fixed)}
              >
                元利定額方式
              </button>
              <button
                type="button"
                aria-pressed={!fixed}
                onClick={() => onChange({ ...config, mode: "slide" })}
                className={choiceBtn(!fixed)}
              >
                残高スライド方式
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {fixed
                ? "毎月の支払額がずっと一定。ラクに見えますが、残高が増えると元金が減らなくなります。"
                : "残高が増えるほど毎月の支払額も増えます。返済は進みやすい反面、生活費を圧迫します。"}
            </p>
          </div>
          {fixed && (
            <div>
              <p className="text-sm font-semibold">毎月の支払額</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[10000, 20000, 30000].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={config.payment === n}
                    onClick={() => onChange({ ...config, payment: n })}
                    className={choiceBtn(config.payment === n)}
                  >
                    {yen(n)}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">
                少額ほど罠にはまりやすく、3万円だと毎月の余裕がゼロになります。
              </p>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">実質年率</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[0.12, 0.15, 0.18].map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={config.rate === r}
                  onClick={() => onChange({ ...config, rate: r })}
                  className={choiceBtn(config.rate === r)}
                >
                  年{Math.round(r * 100)}%
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="button"
            onClick={onStart}
            className="rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-contrast transition hover:-translate-y-0.5 hover:opacity-85"
          >
            💳 カードを受け取る
          </button>
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted">
          ※ 実際のカードの仕組みを単純化した教育目的のゲームです。手数料率や返済方式はカード会社・契約によって異なります。登場する人物・出来事はフィクションです。
        </p>
      </div>
    </section>
  );
}

function Progress({ month }: { month: number }) {
  const pct = Math.round(((month - 1) / MONTHS) * 100);
  return (
    <div className="mb-6">
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>
          {month}ヶ月目 / {MONTHS}ヶ月
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EventCard({
  life,
  onChoose,
}: {
  life: Life;
  onChoose: (index: number) => void;
}) {
  const scene = life.schedule[life.month - 1];
  const choices = choicesFor(life);
  const isBonus = scene.kind === "bonus";

  return (
    <article
      key={`event-${life.month}`}
      className="hero-rise rounded-2xl border border-line bg-card p-6 sm:p-8"
    >
      <p className="text-sm font-semibold text-accent">
        {life.month}ヶ月目
        {scene.kind === "emergency" && "・避けられない出費"}
        {scene.kind === "bonus" && "・ボーナス月"}
      </p>
      <h2 className="mt-1 text-2xl font-bold">
        <span className="mr-2">{isBonus ? "💰" : scene.item.emoji}</span>
        {isBonus ? "ボーナスが出ました" : scene.item.title}
      </h2>
      <p className="mt-5 leading-relaxed">
        {isBonus
          ? `ボーナスの手取りは${yen(scene.amount)}。${
              life.balance > 0
                ? `カードのリボ残高は${yen(life.balance)}。使い道は自由です。`
                : "使い道は自由です。"
            }`
          : fill(scene.item.body, life.config)}
      </p>
      {!isBonus && (
        <p className="mt-4 text-lg font-bold">{yen(scene.item.price)}</p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {choices.map((c, i) => (
          <button
            key={c.label}
            type="button"
            disabled={!!c.disabled}
            onClick={() => onChoose(i)}
            className="rounded-xl border border-line bg-bg px-5 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent-strong disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:border-line disabled:hover:text-fg"
          >
            {c.label}
            {(c.hint || c.disabled) && (
              <span className="mt-0.5 block text-xs font-normal text-muted">
                {c.disabled ? `※ ${c.disabled}` : c.hint}
              </span>
            )}
          </button>
        ))}
      </div>
    </article>
  );
}

function SettleCard({
  life,
  text,
  settlement,
  offer,
  onOffer,
  onRepay,
  onNext,
  last,
  sceneTitle,
}: {
  life: Life;
  text: string;
  settlement: Settlement;
  offer: boolean;
  onOffer: (accept: boolean) => void;
  onRepay: (amount: number) => void;
  onNext: () => void;
  last: boolean;
  sceneTitle: string;
}) {
  const { interest, payment, principal, shortfall } = settlement;
  const interestPct = payment > 0 ? Math.min(100, Math.round((interest / payment) * 100)) : 0;
  const stuck = interest >= payment && payment > 0;
  const proj = life.balance > 0 ? projection(life.balance, life.config) : undefined;
  const longProj = proj === null || (proj !== undefined && proj.months > MONTHS);
  const repayOptions = [10000, 30000, 50000].filter(
    (a) => a <= life.cash && a <= life.balance,
  );
  const canRepayAll = life.balance > 0 && life.cash >= life.balance;

  return (
    <article className="hero-rise rounded-2xl border border-line bg-card p-6 sm:p-8">
      <p className="text-sm font-semibold text-accent">
        {life.month}ヶ月目・月末の明細
      </p>
      <h2 className="mt-1 text-2xl font-bold">📄 {sceneTitle}の結果</h2>
      <p className="mt-5 leading-relaxed">{text}</p>

      <div className="mt-6 rounded-xl border border-line bg-bg p-5">
        <p className="text-xs font-semibold tracking-widest text-muted">
          今月のお支払い
        </p>
        <p className="mt-1 text-3xl font-bold">{yen(payment)}</p>
        <div
          className="mt-4 flex h-5 overflow-hidden rounded-full bg-line text-[11px] font-semibold"
          role="img"
          aria-label={`支払いのうち利息 ${yen(interest)}、元金 ${yen(Math.max(0, principal))}`}
        >
          <div
            className="flex items-center justify-center bg-red-600 text-white transition-all duration-700"
            style={{ width: `${interestPct}%` }}
          >
            {interestPct >= 15 && `利息 ${interestPct}%`}
          </div>
          <div
            className="flex flex-1 items-center justify-center bg-accent text-accent-contrast"
          >
            {100 - interestPct >= 15 && "元金"}
          </div>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
          <dt className="text-muted">利息（リボ手数料）</dt>
          <dd className="text-right font-semibold text-red-600 dark:text-red-400">
            {yen(interest)}
          </dd>
          <dt className="text-muted">元金に充てた額</dt>
          <dd className="text-right font-semibold">{yen(Math.max(0, principal))}</dd>
        </dl>
        {stuck && (
          <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">
            ⚠ 今月の支払いは、すべて利息に消えました。元金は1円も減っていません。
          </p>
        )}
        {shortfall > 0 && (
          <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">
            ⚠ 生活費が足りず、{yen(shortfall)}をカードで払いました。借金で借金を返す状態です。
          </p>
        )}
      </div>

      {life.balance > 0 && proj !== undefined && (
        <p
          className={`mt-4 text-sm leading-relaxed ${
            longProj ? "font-semibold text-red-600 dark:text-red-400" : "text-muted"
          }`}
        >
          {proj === null
            ? `今日から1円も使わなくても、毎月${yen(life.config.payment)}ずつでは元金が減りません。永遠に終わりません。`
            : `今日から新しく使わなくても、完済まであと${proj.months}ヶ月（${(proj.months / 12).toFixed(1)}年）、利息はあと${yen(proj.interest)}かかります。`}
        </p>
      )}

      {life.balance > 0 && repayOptions.length + (canRepayAll ? 1 : 0) > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold">貯金から繰上返済する？</p>
          <p className="mt-0.5 text-xs text-muted">
            早く返すほど、これから払う利息が減ります。（貯金 {yen(life.cash)}）
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {repayOptions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => onRepay(a)}
                className="rounded-full border border-line bg-bg px-4 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent"
              >
                {yen(a)}返済
              </button>
            ))}
            {canRepayAll && (
              <button
                type="button"
                onClick={() => onRepay(life.balance)}
                className="rounded-full border border-accent bg-accent-soft px-4 py-1.5 text-xs font-semibold text-accent-strong transition hover:opacity-80"
              >
                全額返済（{yen(life.balance)}）
              </button>
            )}
          </div>
        </div>
      )}

      {offer && (
        <div className="mt-6 rounded-xl border border-amber-500/60 bg-amber-500/10 p-5">
          <p className="text-sm font-bold">
            ✉ カード会社からのお知らせ
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            「いつもご利用ありがとうございます。審査なしで、利用限度額を{yen(life.limit)}から
            {yen(life.limit + LIMIT_STEP)}に引き上げました！」
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOffer(true)}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent"
            >
              ありがたく受け取る
            </button>
            <button
              type="button"
              onClick={() => onOffer(false)}
              className="rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold transition hover:border-accent hover:text-accent"
            >
              必要ないので断る
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          type="button"
          onClick={onNext}
          disabled={offer}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-85 disabled:opacity-40"
        >
          {last ? "24ヶ月の結果を見る →" : "次の月へ →"}
        </button>
        {offer && (
          <span className="ml-3 text-xs text-muted">
            お知らせに返事をしてください
          </span>
        )}
      </div>
    </article>
  );
}

function StatsPanel({ life }: { life: Life }) {
  const usedPct = Math.min(100, Math.round((life.balance / life.limit) * 100));
  return (
    <div className="rounded-2xl border border-line bg-card p-5 text-sm">
      <p className="text-xs font-semibold tracking-widest text-muted">
        いまの状況
      </p>
      <dl className="mt-3 space-y-3">
        <div>
          <dt className="text-xs text-muted">
            {life.config.mode === "fixed" ? "毎月のお支払い" : "今月のお支払い目安"}
          </dt>
          <dd className="text-xl font-bold">
            {yen(paymentFor(life.config, life.balance))}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">貯金</dt>
          <dd className="font-semibold">{yen(life.cash)}</dd>
        </div>
        <div>
          <dt className="flex justify-between text-xs text-muted">
            <span>リボ残高</span>
            <span>
              枠 {yen(life.limit)}
            </span>
          </dt>
          <dd className="font-semibold text-red-600 dark:text-red-400">{yen(life.balance)}</dd>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>
        <div>
          <dt className="text-xs text-muted">これまでに払った利息</dt>
          <dd className="font-semibold text-red-600 dark:text-red-400">{yen(life.totalInterest)}</dd>
        </div>
        <div>
          <dt className="flex justify-between text-xs text-muted">
            <span>ごきげん</span>
            <span>{life.joy}</span>
          </dt>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${life.joy}%` }}
            />
          </div>
        </div>
      </dl>
    </div>
  );
}

const methodLabel: Record<Method, string> = {
  revo: "リボ",
  cash: "現金",
  family: "家族に立て替え",
  skip: "見送り",
};

function Ending({ life, onRestart }: { life: Life; onRestart: () => void }) {
  const e = ending(life);
  const shareText = `月々1万円の罠｜${life.config.mode === "fixed" ? `定額${yen(life.config.payment)}` : "残高スライド"}・年${Math.round(life.config.rate * 100)}%で「${e.title}」になりました。利息は合計${yen(
    life.totalInterest + (e.future?.interest ?? 0),
  )}。 #月々1万円の罠 https://sadaharuinoue.github.io/LePandaIvre/revo/`;
  const revos = life.purchases.filter((p) => p.method === "revo");
  const lifetimeInterest = life.totalInterest + (e.future?.interest ?? 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-10">
      <article className="hero-rise rounded-2xl border border-accent/40 bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-accent">
          {life.bust ? `${life.month}ヶ月目で終了` : `${MONTHS}ヶ月が経ちました`}
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
          {e.title}
        </h2>
        <p className="mt-2 text-muted">{e.subtitle}</p>
        <p className="mt-5 leading-relaxed">{e.closing}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-85"
          >
            💳 もう一度やってみる
          </button>
          <CopyButton text={shareText} />
          <span className="text-xs text-muted">結果をコピーしてシェア</span>
        </div>
      </article>

      <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h3 className="text-lg font-bold">🧾 最終明細</h3>
        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm sm:text-base">
          <dt className="text-muted">リボで買ったもの</dt>
          <dd className="text-right font-semibold">
            {e.revoCount}件・{yen(e.revoTotal)}
          </dd>
          <dt className="text-muted">払った利息</dt>
          <dd className="text-right font-semibold text-red-600 dark:text-red-400">
            {yen(life.totalInterest)}
          </dd>
          <dt className="text-muted">いまのリボ残高</dt>
          <dd className="text-right font-semibold">{yen(life.balance)}</dd>
          {life.balance > 0 && (
            <>
              <dt className="text-muted">完済までに、さらにかかる利息</dt>
              <dd className="text-right font-semibold text-red-600 dark:text-red-400">
                {e.future
                  ? `${yen(e.future.interest)}（あと${e.future.months}ヶ月）`
                  : "終わりません"}
              </dd>
            </>
          )}
          <dt className="text-muted">繰上返済した額</dt>
          <dd className="text-right font-semibold">{yen(life.extraRepaid)}</dd>
        </dl>
        {lifetimeInterest > 0 && (
          <p className="mt-5 text-sm leading-relaxed">
            利息の合計は
            <strong className="text-red-600 dark:text-red-400"> {yen(lifetimeInterest)}</strong>
            {e.neverEnds ? "（今後も増え続けます）" : ""}。これは
            {e.comparisons.length > 0
              ? e.comparisons
                  .map((c) => `${c.label}${c.count}回分`)
                  .join("、")
              : "コーヒー数杯分"}
            に相当します。何も得られなかったお金です。
          </p>
        )}
      </section>

      {life.history.length > 1 && <BalanceChart life={life} />}

      <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h3 className="text-lg font-bold">🛍 あなたの買い物</h3>
        <ul className="mt-4 divide-y divide-line text-sm">
          {life.purchases.map((p, i) => (
            <li key={i} className="flex items-center gap-3 py-2">
              <span aria-hidden>{p.emoji}</span>
              <span className="min-w-0 flex-1 truncate">
                {p.month}ヶ月目 {p.title}
              </span>
              <span className="shrink-0 text-muted">{yen(p.price)}</span>
              <span
                className={`w-16 shrink-0 text-right text-xs font-semibold ${
                  p.method === "revo" ? "text-red-600 dark:text-red-400" : "text-muted"
                }`}
              >
                {methodLabel[p.method]}
              </span>
            </li>
          ))}
        </ul>
        {revos.length === 0 && (
          <p className="mt-3 text-sm text-muted">リボ払いは使いませんでした。</p>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h3 className="text-lg font-bold">💡 リボ払いのここが怖い</h3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed">
          {e.lessons.map((l) => (
            <li key={l} className="flex gap-2">
              <span className="text-accent">●</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          ※ このゲームは仕組みを単純化した教育・啓発目的のもので、特定のカード会社や金融商品を指すものではありません。実際の条件は契約内容をご確認ください。
        </p>
      </section>
    </div>
  );
}

function BalanceChart({ life }: { life: Life }) {
  const data = life.history;
  const max = Math.max(...data.map((d) => d.balance), life.limit * 0.2, 1);
  const w = 600;
  const h = 160;
  const pad = 8;
  const step = (w - pad * 2) / Math.max(1, MONTHS - 1);
  const points = data.map((d, i) => {
    const x = pad + i * step;
    const y = h - pad - (d.balance / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  const area = `${pad},${h - pad} ${points.join(" ")} ${pad + (data.length - 1) * step},${h - pad}`;

  return (
    <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
      <h3 className="text-lg font-bold">📈 リボ残高の推移</h3>
      <p className="mt-1 text-xs text-muted">
        毎月のお支払いが同じでも、残高はこんなふうに動いていました。
      </p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`リボ残高の推移。最終残高は${yen(life.balance)}`}
      >
        <polygon points={area} className="fill-red-600/15" />
        <polyline
          points={points.join(" ")}
          fill="none"
          className="stroke-red-600"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>1ヶ月目</span>
        <span>最大 {yen(Math.max(...data.map((d) => d.balance)))}</span>
        <span>{data.length}ヶ月目</span>
      </div>
    </section>
  );
}
