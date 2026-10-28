import { emergencies, temptations, type Item } from "@/data/revo/events";

// ---- ゲームの前提（実在のカードを単純化したモデル） ----
export const MONTHS = 24;
export const SLIDE_UNIT = 5000; // 残高スライド：残高10万円ごとに加算する支払額
export const MONTHLY_SURPLUS = 30000; // 手取り − 生活費
export const START_CASH = 100000;
export const START_LIMIT = 500000;
export const LIMIT_STEP = 300000;
export const BONUSES: Record<number, number> = { 9: 80000, 15: 120000, 21: 150000 };

export type Config = {
  mode: "fixed" | "slide"; // 元利定額 / 残高スライド
  rate: number; // 実質年率（0.15 = 15%）
  payment: number; // 定額方式の毎月の支払額
};

export const defaultConfig: Config = {
  mode: "fixed",
  rate: 0.15,
  payment: 10000,
};

/** 残高に応じた毎月の支払額（利息を含む） */
export function paymentFor(config: Config, balance: number): number {
  if (config.mode === "fixed") return config.payment;
  return SLIDE_UNIT * Math.max(1, Math.ceil(balance / 100000));
}

/** 「月々◯◯」と謳われる金額の表記 */
export function payLabel(config: Config): string {
  const n = config.mode === "fixed" ? config.payment : SLIDE_UNIT;
  return n % 10000 === 0 ? `${n / 10000}万円` : `${n.toLocaleString()}円`;
}

/** イベント文中の {pay} を現在の設定に置き換える */
export function fill(text: string, config: Config): string {
  return text.replaceAll("{pay}", payLabel(config));
}

export type Method = "revo" | "cash" | "family" | "skip";

export type Purchase = {
  month: number;
  title: string;
  emoji: string;
  price: number;
  method: Method;
};

export type Settlement = {
  interest: number;
  payment: number;
  principal: number; // 負なら残高が増えた
  shortfall: number; // 生活費が足りずカードで払った額
};

export type Life = {
  config: Config;
  month: number; // 1〜MONTHS
  schedule: Scene[];
  cash: number;
  balance: number;
  limit: number;
  totalInterest: number;
  extraRepaid: number;
  joy: number;
  familyHelp: number;
  lastLimitOffer: number;
  purchases: Purchase[];
  history: { month: number; balance: number }[];
  bust: boolean;
};

export type Scene =
  | { kind: "temptation" | "emergency"; item: Item }
  | { kind: "bonus"; amount: number };

export type Choice = {
  label: string;
  hint?: string;
  disabled?: string; // 選べない理由
  apply: (life: Life) => { life: Life; text: string };
};

// ---- 計算 ----

export function monthlyInterest(balance: number, rate: number): number {
  return Math.round((balance * rate) / 12);
}

/** 今日から新規利用ゼロで、設定どおりの支払いを続けた場合 */
export function projection(
  balance: number,
  config: Config,
): { months: number; interest: number } | null {
  let b = balance;
  let interest = 0;
  for (let m = 1; m <= 1200; m++) {
    const i = monthlyInterest(b, config.rate);
    interest += i;
    const pay = Math.min(paymentFor(config, b), b + i);
    b = b + i - pay;
    if (b <= 0) return { months: m, interest };
    if (m === 1 && pay <= i) return null; // 元金が減らない
  }
  return null;
}

export const yen = (n: number) => `¥${Math.round(n).toLocaleString()}`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createLife(config: Config): Life {
  const bonusMonths = Object.keys(BONUSES).map(Number);
  const free = Array.from({ length: MONTHS }, (_, i) => i + 1).filter(
    (m) => m !== 1 && !bonusMonths.includes(m),
  );
  const emergencyMonths = new Set(shuffle(free).slice(0, 7));
  const em = shuffle(emergencies);
  const starter = temptations.find((t) => t.starter)!;
  const tp = shuffle(temptations.filter((t) => !t.starter));

  const schedule: Scene[] = [];
  for (let m = 1; m <= MONTHS; m++) {
    if (m === 1) schedule.push({ kind: "temptation", item: starter });
    else if (BONUSES[m]) schedule.push({ kind: "bonus", amount: BONUSES[m] });
    else if (emergencyMonths.has(m))
      schedule.push({ kind: "emergency", item: em.pop()! });
    else schedule.push({ kind: "temptation", item: tp.pop()! });
  }

  return {
    config,
    month: 1,
    schedule,
    cash: START_CASH,
    balance: 0,
    limit: START_LIMIT,
    totalInterest: 0,
    extraRepaid: 0,
    joy: 60,
    familyHelp: 0,
    lastLimitOffer: 0,
    purchases: [],
    history: [],
    bust: false,
  };
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function withPurchase(
  life: Life,
  item: Item,
  method: Method,
  patch: Partial<Life>,
): Life {
  return {
    ...life,
    ...patch,
    purchases: [
      ...life.purchases,
      {
        month: life.month,
        title: item.title,
        emoji: item.emoji,
        price: item.price,
        method,
      },
    ],
  };
}

export function choicesFor(life: Life): Choice[] {
  const scene = life.schedule[life.month - 1];

  if (scene.kind === "bonus") return bonusChoices(life, scene.amount);

  const { item } = scene;
  const overLimit = life.balance + item.price > life.limit;
  const lackCash = life.cash < item.price;

  const revo: Choice = {
    label: "リボ払いにする",
    hint: `${yen(item.price)}を購入。${life.config.mode === "fixed" ? `毎月のお支払いは${yen(life.config.payment)}のまま` : `月々のお支払いは${payLabel(life.config)}から`}`,
    disabled: overLimit ? "利用枠をオーバーしてしまう" : undefined,
    apply: (l) => ({
      life: withPurchase(l, item, "revo", {
        balance: l.balance + item.price,
        joy: clamp(l.joy + item.joy),
      }),
      text: fill(item.revoText, l.config),
    }),
  };
  const cash: Choice = {
    label: "お財布から現金で払う",
    hint: `貯金が${yen(item.price)}減ります`,
    disabled: lackCash ? "貯金が足りない" : undefined,
    apply: (l) => ({
      life: withPurchase(l, item, "cash", {
        cash: l.cash - item.price,
        joy: clamp(l.joy + item.joy),
      }),
      text: fill(item.cashText, l.config),
    }),
  };

  if (scene.kind === "temptation") {
    const skip: Choice = {
      label: "今回は見送る",
      apply: (l) => ({
        life: withPurchase(l, item, "skip", { joy: clamp(l.joy - 3) }),
        text: fill(item.skipText, l.config),
      }),
    };
    return [revo, cash, skip];
  }

  // 避けられない出費。どちらも選べなければ家族に頭を下げる
  const choices = [revo, cash];
  if (overLimit && lackCash) {
    choices.push({
      label: "家族に頭を下げて立て替えてもらう",
      hint: "ごきげん −15",
      apply: (l) => ({
        life: withPurchase(l, item, "family", {
          joy: clamp(l.joy - 15),
          familyHelp: l.familyHelp + 1,
        }),
        text: "電話口で「ごめん、ちょっと貸して」と言うのは、思った以上にしんどかった。",
      }),
    });
  }
  return choices;
}

function bonusChoices(life: Life, amount: number): Choice[] {
  const { balance } = life;
  const note = (l: Life, repay: number, spend: number, joy: number) => ({
    ...l,
    balance: l.balance - repay,
    extraRepaid: l.extraRepaid + repay,
    cash: l.cash + amount - repay - spend,
    joy: clamp(l.joy + joy),
  });

  const treat: Choice = {
    label: "ご褒美に使う（旅行や買い物に ¥80,000）",
    hint: "残りは貯金。ごきげん +12",
    apply: (l) => ({
      life: note(l, 0, 80000, 12),
      text: "ボーナスで思いきり遊んだ。最高の週末だった。",
    }),
  };

  if (balance <= 0) {
    return [
      {
        label: "全額貯金する",
        apply: (l) => ({
          life: note(l, 0, 0, 2),
          text: "通帳の数字が増えていくのは、それだけで安心する。",
        }),
      },
      treat,
    ];
  }

  const full = Math.min(balance, amount);
  const half = Math.min(balance, Math.round(amount / 2));
  return [
    {
      label: `ボーナスをリボの繰上返済に回す（${yen(full)}）`,
      hint: "残高が減り、これから払う利息も減ります",
      apply: (l) => ({
        life: note(l, full, 0, 3),
        text: `${yen(full)}を繰上返済。残高がぐっと減って、胸のつかえが少し取れた。`,
      }),
    },
    {
      label: `半分だけ返済、半分は貯金（返済 ${yen(half)}）`,
      apply: (l) => ({
        life: note(l, half, 0, 1),
        text: `${yen(half)}を返済に回し、残りは貯金へ。`,
      }),
    },
    treat,
  ];
}

/** 月末の締め処理。利息を計算して支払い、生活費の不足があればカードに乗る */
export function settle(life: Life): { life: Life; settlement: Settlement } {
  const interest = monthlyInterest(life.balance, life.config.rate);
  const payment = Math.min(
    paymentFor(life.config, life.balance),
    life.balance + interest,
  );
  const principal = payment - interest;
  let balance = life.balance + interest - payment;
  let cash = life.cash + MONTHLY_SURPLUS - payment;
  let shortfall = 0;
  if (cash < 0) {
    shortfall = -cash;
    balance += shortfall;
    cash = 0;
  }
  const pressure = Math.min(8, Math.floor(balance / 100000));
  const next: Life = {
    ...life,
    balance,
    cash,
    totalInterest: life.totalInterest + interest,
    joy: clamp(life.joy - pressure),
    history: [...life.history, { month: life.month, balance }],
    bust: balance > life.limit && shortfall > 0,
  };
  return { life: next, settlement: { interest, payment, principal, shortfall } };
}

export function extraRepay(life: Life, amount: number): Life {
  const x = Math.min(amount, life.balance, life.cash);
  if (x <= 0) return life;
  return {
    ...life,
    balance: life.balance - x,
    cash: life.cash - x,
    extraRepaid: life.extraRepaid + x,
    joy: clamp(life.joy + 1),
  };
}

/** 利用枠アップの案内が来るか */
export function limitOffered(life: Life): boolean {
  return (
    life.month < MONTHS &&
    life.balance >= life.limit * 0.6 &&
    life.month - life.lastLimitOffer >= 4
  );
}

// ---- エンディング ----

export type EndingResult = {
  title: string;
  subtitle: string;
  closing: string;
  revoTotal: number;
  revoCount: number;
  future: { months: number; interest: number } | null;
  neverEnds: boolean;
  comparisons: { label: string; count: number }[];
  lessons: string[];
};

const treats = [
  { label: "ちょっといい焼肉ディナー", price: 15000 },
  { label: "温泉旅行", price: 50000 },
  { label: "最新スマホ", price: 158000 },
];

export function ending(life: Life): EndingResult {
  const revos = life.purchases.filter((p) => p.method === "revo");
  const revoTotal = revos.reduce((s, p) => s + p.price, 0);
  const future = projection(life.balance, life.config);
  const fixed = life.config.mode === "fixed";
  const ratePct = Math.round(life.config.rate * 100);
  const neverEnds = life.balance > 0 && future === null;
  const lifetimeInterest =
    life.totalInterest + (future ? future.interest : 0);

  let title: string;
  let subtitle: string;
  let closing: string;
  if (life.bust) {
    title = "カードが止まった人";
    subtitle = "生活費さえカードで払い、枠も使い切りました";
    closing =
      (fixed
        ? `毎月の請求は${payLabel(life.config)}のまま。だから気づくのが遅れました。気づいたときには、利息だけで返済額の大半が消えていました。`
        : "残高が増えるたびに毎月の請求も膨らみ、生活費まで圧迫されました。借金で借金を返す状態に陥っていました。") +
      "ここまで来る前に、カード会社や消費生活センターに相談すれば道はあります。";
  } else if (life.balance <= 0 && life.totalInterest === 0) {
    title = "リボ知らずの堅実派";
    subtitle = "利息は1円も払いませんでした";
    closing =
      "ほしいものを我慢する場面もあったはず。でも、24ヶ月後のあなたには借金も利息もありません。それが一番の贅沢かもしれません。";
  } else if (life.balance <= 0) {
    title = "リボ卒業生";
    subtitle = `${yen(life.totalInterest)}の授業料で、完済しました`;
    closing =
      "リボの仕組みを知って、自分の力で返し切ったあなたは強い。払った利息は「勉強代」と思って、次からは使い方を選べます。";
  } else if (neverEnds) {
    title = "永久リボの住人";
    subtitle = `毎月${yen(life.config.payment)}を払っても、元金が1円も減りません`;
    closing =
      "毎月きちんと払っているのに、残高は減らない。これがリボ払いのいちばん怖いところです。「月々の支払いは変わらない」という安心は、終わりの見えない返済と引き換えでした。";
  } else if (life.balance < 150000) {
    title = "ちょっとリボ体験者";
    subtitle = "まだ引き返せる場所にいます";
    closing =
      "今の残高なら、完済まで見えています。利息の重さを実感できたうちに、繰上返済で早めに片づけましょう。";
  } else if (life.balance < 400000) {
    title = "リボの沼の入り口に立つ人";
    subtitle = "気づけば、毎月の返済の3割以上が利息です";
    closing =
      `月々${payLabel(life.config)}なら払える。その感覚のまま買い続けた結果が、この残高です。新しく買う前に、まず残高を減らす。それだけで未来がだいぶ軽くなります。`;
  } else {
    title = "リボ地獄の住人";
    subtitle = "返済のほとんどが利息に消えています";
    closing =
      "ひとつひとつの買い物は小さくても、積み重なると返済額の大半が利息になります。もしこれが現実なら、今すぐカード会社へ連絡して返済計画を見直しましょう。";
  }

  const comparisons = treats
    .map((t) => ({
      label: t.label,
      count: Math.floor(lifetimeInterest / t.price),
    }))
    .filter((c) => c.count > 0);

  const lessons = [
    fixed
      ? "リボ払いは「毎月の支払額が一定」なので、買い物を重ねても請求額が変わらず、借りている実感が薄くなります。"
      : "残高スライド方式は返済が進みやすい反面、残高が増えると毎月の支払額も増え、生活費を圧迫します。足りない分をカードで払うと、さらに残高が増えます。",
    `手数料は年${ratePct}%。残高が増えるほど、毎月の支払額のうち利息の割合が増え、元金がなかなか減りません。（年15%前後が一般的です）`,
    "「利用枠アップ」「ポイント○倍」「手数料キャンペーン」は、リボの利用を増やすための案内であることがほとんどです。",
    "対策：①カードの支払い方法を「一括」にしておく ②リボになっていないか明細を確認する ③残高があるうちは新規利用を止める ④余裕ができたら繰上返済する。",
    "返済に困ったら、早めにカード会社や、消費者ホットライン「188」（いやや）へ相談を。",
  ];

  return {
    title,
    subtitle,
    closing,
    revoTotal,
    revoCount: revos.length,
    future,
    neverEnds,
    comparisons,
    lessons,
  };
}
