"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import { kansaiPopulation, prefectures } from "@/data/kansai/prefectures";
import {
  applyOutcome,
  createLife,
  ending,
  rarity,
  statLabels,
  steps,
  type Life,
  type Outcome,
  type Scene,
  type StatKey,
} from "./engine";

export default function KansaiGame() {
  const [life, setLife] = useState<Life | null>(null);
  const [step, setStep] = useState(0);
  // 選んだ直後の結果。表示してから「次へ」で次の場面に進む
  const [result, setResult] = useState<{ scene: Scene; outcome: Outcome } | null>(
    null,
  );

  function start(prefId?: string) {
    setLife(createLife(prefId));
    setStep(0);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function choose(scene: Scene, outcome: Outcome) {
    if (!life) return;
    setLife(applyOutcome(life, scene, outcome));
    // 文章のない選択（誕生・出来事）はそのまま次へ
    if (outcome.text && scene.choices.length > 1) {
      setResult({ scene, outcome });
    } else {
      setStep(step + 1);
    }
  }

  function next() {
    setResult(null);
    setStep(step + 1);
  }

  if (!life) return <TitleScreen onStart={start} />;

  const finished = step >= steps.length;
  const scene = finished ? null : steps[step](life);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 md:grid-cols-[1fr_280px]">
      <div className="min-w-0">
        <Progress step={step} />
        {finished ? (
          <Ending life={life} onRestart={() => setLife(null)} />
        ) : result ? (
          <SceneCard
            key={`result-${step}`}
            age={result.scene.age}
            title={result.scene.title}
            body={[result.outcome.text]}
            delta={result.outcome.delta}
          >
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-85"
            >
              次へ →
            </button>
          </SceneCard>
        ) : (
          scene && (
            <SceneCard
              key={`scene-${step}`}
              age={scene.age}
              title={scene.title}
              body={scene.body}
            >
              <div className="flex flex-col gap-3">
                {scene.choices.map((choice) => (
                  <button
                    key={choice.label}
                    type="button"
                    onClick={() => choose(scene, choice.apply())}
                    className={
                      scene.choices.length > 1
                        ? "rounded-xl border border-line bg-bg px-5 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent-strong"
                        : "self-start rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-85"
                    }
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </SceneCard>
          )
        )}
      </div>

      <aside className="space-y-6">
        <Profile life={life} />
        <StatsPanel life={life} />
      </aside>
    </div>
  );
}

function TitleScreen({ onStart }: { onStart: (prefId?: string) => void }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-accent-soft/60">
      <div
        aria-hidden
        className="hero-blob pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:py-28">
        <p className="text-sm font-semibold tracking-widest text-accent">
          テキストで遊ぶ人生シミュレーション
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-snug sm:text-6xl">
          関西人分の1
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
          もしも、関西のどこかに生まれたら——。
          <br />
          生まれる場所は、2府4県・約{kansaiPopulation.toLocaleString()}
          万人の人口の比率でランダムに決まります。その土地のことば、地場産業、お祭り。進学や就職で町を出るか、地元に残るか。選んだ道で、あなたの人生が描かれていきます。
        </p>
        <div className="mt-10">
          <button
            type="button"
            onClick={() => onStart()}
            className="rounded-full bg-accent px-8 py-3 text-base font-semibold text-accent-contrast transition hover:-translate-y-0.5 hover:opacity-85"
          >
            🎲 生まれる
          </button>
        </div>
        <div className="mt-8">
          <p className="text-sm text-muted">生まれる府県を選ぶこともできます</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {prefectures.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onStart(p.id)}
                className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted">
          ※ 人口は2020年国勢調査をもとにした概数です。登場する市町村は各府県の一部で、人生の物語はフィクションです。
        </p>
      </div>
    </section>
  );
}

function Progress({ step }: { step: number }) {
  const pct = Math.min(100, Math.round((step / steps.length) * 100));
  return (
    <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden>
      <div
        className="h-full rounded-full bg-accent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SceneCard({
  age,
  title,
  body,
  delta,
  children,
}: {
  age: string;
  title: string;
  body: string[];
  delta?: Outcome["delta"];
  children: React.ReactNode;
}) {
  return (
    <article
      className="hero-rise rounded-2xl border border-line bg-card p-6 sm:p-8"
    >
      <p className="text-sm font-semibold text-accent">{age}</p>
      <h2 className="mt-1 text-2xl font-bold">{title}</h2>
      <div className="mt-5 space-y-3 leading-relaxed">
        {body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {delta && <DeltaChips delta={delta} />}
      <div className="mt-8">{children}</div>
    </article>
  );
}

function DeltaChips({ delta }: { delta: NonNullable<Outcome["delta"]> }) {
  const entries = Object.entries(delta).filter(([, v]) => v) as [
    StatKey,
    number,
  ][];
  if (entries.length === 0) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <li
          key={key}
          className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong"
        >
          {statLabels[key]} {value > 0 ? `+${value}` : value}
        </li>
      ))}
    </ul>
  );
}

function Profile({ life }: { life: Life }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 text-sm">
      <p className="text-xs font-semibold tracking-widest text-muted">
        あなたのふるさと
      </p>
      <p className="mt-2 text-lg font-bold">
        {life.pref.name}
        {life.muni.name}
      </p>
      <p className="mt-1 text-muted">{life.family.name}に生まれる</p>
      <p className="mt-3 text-xs text-muted">
        関西人の約{rarity(life.muni).toLocaleString()}人に1人
      </p>
    </div>
  );
}

function StatsPanel({ life }: { life: Life }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-xs font-semibold tracking-widest text-muted">
        人生のものさし
      </p>
      <ul className="mt-3 space-y-3">
        {(Object.keys(statLabels) as StatKey[]).map((key) => (
          <li key={key}>
            <div className="flex justify-between text-xs">
              <span>{statLabels[key]}</span>
              <span className="text-muted">{life.stats[key]}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${life.stats[key]}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        どれが高いほど良い、というものではありません。あなたの人生の「かたち」です。
      </p>
    </div>
  );
}

function Ending({ life, onRestart }: { life: Life; onRestart: () => void }) {
  const { title, subtitle, closing, facts } = ending(life);
  const shareText = `関西人分の1｜${life.pref.name}${life.muni.name}の${life.family.name}に生まれ、「${title}」になりました。 #関西人分の1 https://sadaharuinoue.github.io/LePandaIvre/kansai/`;

  return (
    <div className="space-y-6">
      <article className="hero-rise rounded-2xl border border-accent/40 bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-accent">人生のエンディング</p>
        <h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-muted">{subtitle}</p>
        <p className="mt-5 leading-relaxed">{closing}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          どの道にも、うまくいった日とそうでない日があります。別の場所に生まれていたら、別の選択をしていたら——もう一度生まれて、確かめてみてください。
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-contrast transition hover:opacity-85"
          >
            🎲 もう一度生まれる
          </button>
          <CopyButton text={shareText} />
          <span className="text-xs text-muted">結果をコピーしてシェア</span>
        </div>
      </article>

      <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h3 className="text-lg font-bold">📜 あなたの人生のあゆみ</h3>
        <ol className="mt-5 space-y-5 border-l-2 border-line pl-5">
          {life.log.map((entry) => (
            <li key={entry.title} className="relative">
              <span className="absolute -left-[27px] top-2 h-3 w-3 rounded-full border-2 border-card bg-accent" />
              <p className="text-xs font-semibold text-accent">
                {entry.age}・{entry.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{entry.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <h3 className="text-lg font-bold">💡 この人生で出会った関西のまめ知識</h3>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed">
          {facts.map((fact) => (
            <li key={fact} className="flex gap-2">
              <span className="text-accent">●</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
