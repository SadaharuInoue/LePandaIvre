import { families } from "@/data/kansai/families";
import { kansaiPopulation, prefectures } from "@/data/kansai/prefectures";
import type {
  AreaType,
  Dialect,
  Family,
  Municipality,
  Prefecture,
} from "@/data/kansai/types";

export type StatKey = "tsunagari" | "yutori" | "challenge" | "kokoro";
export type Stats = Record<StatKey, number>;

export const statLabels: Record<StatKey, string> = {
  tsunagari: "地元とのつながり",
  yutori: "暮らしのゆとり",
  challenge: "挑戦",
  kokoro: "心の満ち足り",
};

// 暮らしの拠点：地元 / 関西の都市 / 東京
export type Base = "home" | "hub" | "tokyo";

export type LogEntry = { age: string; title: string; text: string };

export type Life = {
  seed: number;
  pref: Prefecture;
  muni: Municipality;
  family: Family;
  stats: Stats;
  base: Base;
  returned: boolean; // 一度外に出て地元に戻った
  inherited: boolean; // 家業を継いだ
  helpedFamily: boolean; // 18歳で家業に入った
  newPath: boolean; // 第二の人生で新しいことを始めた
  log: LogEntry[];
};

export type Outcome = {
  text: string;
  delta?: Partial<Stats>;
  patch?: Partial<Life>;
};

export type Choice = { label: string; apply: () => Outcome };

export type Scene = {
  age: string;
  title: string;
  body: string[];
  choices: Choice[];
};

// ---- 乱数：1つの人生の中では同じ場面で同じ結果になるよう、シード＋場面名で決める ----
function rand(seed: number, salt: string): number {
  let h = seed ^ 0x9e3779b9;
  for (let i = 0; i < salt.length; i++) {
    h = Math.imul(h ^ salt.charCodeAt(i), 0x85ebca6b);
    h ^= h >>> 13;
  }
  h = Math.imul(h ^ (h >>> 16), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function pick<T>(items: T[], r: number): T {
  return items[Math.floor(r * items.length)];
}

function weighted<T>(items: [T, number][], r: number): T {
  const total = items.reduce((sum, [, w]) => sum + w, 0);
  let x = r * total;
  for (const [item, w] of items) {
    x -= w;
    if (x < 0) return item;
  }
  return items[items.length - 1][0];
}

// ---- 誕生 ----
export function createLife(prefId?: string): Life {
  const seed = Math.floor(Math.random() * 2 ** 31);
  const pref = prefId
    ? prefectures.find((p) => p.id === prefId)!
    : weighted(
        prefectures.map((p) => [p, p.pop] as [Prefecture, number]),
        rand(seed, "pref"),
      );
  const muni = weighted(
    pref.municipalities.map((m) => [m, m.pop] as [Municipality, number]),
    rand(seed, "muni"),
  );
  const family = families[weighted(muni.families, rand(seed, "family"))];
  return {
    seed,
    pref,
    muni,
    family,
    stats: { tsunagari: 40, yutori: 40, challenge: 40, kokoro: 40 },
    base: "home",
    returned: false,
    inherited: false,
    helpedFamily: false,
    newPath: false,
    log: [],
  };
}

export function applyOutcome(life: Life, scene: Scene, outcome: Outcome): Life {
  const stats = { ...life.stats };
  for (const [key, value] of Object.entries(outcome.delta ?? {})) {
    const k = key as StatKey;
    stats[k] = Math.max(0, Math.min(100, stats[k] + (value ?? 0)));
  }
  const log = outcome.text
    ? [...life.log, { age: scene.age, title: scene.title, text: outcome.text }]
    : life.log;
  return { ...life, ...outcome.patch, stats, log };
}

// ---- ヘルパー ----
export function dialectOf(life: Life): Dialect {
  return life.muni.dialect ?? life.pref.dialect;
}

const rural: AreaType[] = ["countryside", "mountain", "coast", "town"];
const isRural = (life: Life) => rural.includes(life.muni.type);
const isHub = (life: Life) => life.muni.name.startsWith(life.pref.hub);
// 府県の中心都市生まれなら「関西の都市で暮らす」＝地元にいる
const atHome = (life: Life) =>
  life.base === "home" || (life.base === "hub" && isHub(life));

export function rarity(muni: Municipality): number {
  return Math.round(kansaiPopulation / muni.pop);
}

// ---- 場面 ----
function birth(life: Life): Scene {
  const { pref, muni, family } = life;
  return {
    age: "0歳",
    title: "誕生",
    body: [
      `あなたは${pref.name}${muni.name}の、${family.name}に生まれました。`,
      `${muni.name}——${muni.catch}。`,
      `関西に住む約${kansaiPopulation.toLocaleString()}万人のうち、${muni.name}の人口は約${muni.pop < 1 ? Math.round(muni.pop * 10000).toLocaleString() : muni.pop + "万"}人。あなたは関西人の「約${rarity(muni).toLocaleString()}人に1人」です。`,
    ],
    choices: [{ label: "人生をはじめる", apply: () => ({ text: "" }) }],
  };
}

function childhood(life: Life): Scene {
  const { muni, family } = life;
  const dialect = dialectOf(life);
  const line = pick(dialect.lines, rand(life.seed, "line"));
  const speaker = pick(
    ["おばあちゃん", "おじいちゃん", "お母さん", "お父さん", "近所のおばちゃん"],
    rand(life.seed, "speaker"),
  );
  const playText: Record<AreaType, string> = {
    city: "路地や公園を自転車で走りまわり、近所のおっちゃん・おばちゃんにすっかり顔を覚えられた。",
    suburb: "団地や公園で、学年のちがう子とも一緒に日が暮れるまで遊んだ。",
    town: "城跡や商店街が遊び場だった。駄菓子屋のおばちゃんは、みんなの名前を知っていた。",
    countryside: "田んぼや川で日が暮れるまで遊んだ。虫とりと秘密基地の場所は、今でも覚えている。",
    coast: "海辺で貝を拾い、港を出入りする船を眺めて育った。泳ぎは誰に教わったか覚えていない。",
    mountain: "山の中が遊び場だった。木登りと沢遊びで、すり傷の絶えない毎日だった。",
  };
  const choices: Choice[] = [
    {
      label: "外を走りまわっていた",
      apply: () => ({
        text: playText[muni.type],
        delta: { tsunagari: 10, kokoro: 10 },
      }),
    },
    {
      label: "本や図鑑に夢中だった",
      apply: () => ({
        text: `図書館に通いつめ、遠い国や宇宙のことを夢見ていた。いつか${muni.name}の外の世界を見てみたい、と思った。`,
        delta: { challenge: 15, kokoro: 5 },
      }),
    },
  ];
  if (family.trade) {
    choices.push({
      label: `家の${family.trade}を手伝っていた`,
      apply: () => ({
        text: `${family.help}家の仕事を通して、${muni.name}の暮らしが何に支えられているかを肌で知った。`,
        delta: { tsunagari: 10, yutori: 5, kokoro: 5 },
      }),
    });
  } else {
    choices.push({
      label: "地域の行事に参加していた",
      apply: () => ({
        text: `毎年「${muni.festival}」を楽しみにし、子ども会の準備にも加わった。地域の大人たちにかわいがられて育った。`,
        delta: { tsunagari: 15, kokoro: 5 },
      }),
    });
  }
  return {
    age: "0〜12歳",
    title: "子ども時代",
    body: [
      `${muni.scene}。それが、あなたのいちばん古い記憶の風景です。`,
      `「${line}」——${speaker}の口ぐせは${dialect.name}でした。`,
      `毎年の楽しみは「${muni.festival}」。名物の${muni.specialty}は、よそから来た人に自慢したくなる味でした。`,
    ],
    choices,
  };
}

function teens(life: Life): Scene {
  const { pref, muni } = life;
  const hub = isHub(life) ? "遠くの" : `${pref.hub}方面の`;
  const specialSchool: Record<AreaType, string> = {
    city: "工業・商業",
    suburb: "工業・商業",
    town: "工業・商業",
    countryside: "農業・工業",
    coast: "水産・商業",
    mountain: "農林・工業",
  };
  return {
    age: "13〜18歳",
    title: "高校選び",
    body: isRural(life)
      ? [
          "中学校は学年でも人数が少なく、みんな幼なじみ。",
          `高校をどこにするかは、毎日の通学距離をどこまで伸ばすかの選択でもある。${pref.hub}方面まで出れば、選べる学校はぐっと増える。`,
        ]
      : [
          "中学では部活に打ち込んだ。進路を決める時期がやってきた。",
          "電車やバスで通える範囲に、いろんなタイプの高校がある。",
        ],
    choices: [
      {
        label: "地元の高校へ",
        apply: () => ({
          text: isRural(life)
            ? "地元の高校へ。少人数で、先生との距離も近かった。この地域に高校を残そうとがんばる大人たちの思いも知った。"
            : "家から自転車で通える高校へ。このとき仲良くなった友だちとは、一生のつきあいになった。",
          delta: { tsunagari: 10, kokoro: 5 },
        }),
      },
      {
        label: `電車で${hub}進学校へ`,
        apply: () => ({
          text: isRural(life)
            ? "片道1時間以上の電車通学。車窓の景色と参考書が友だちだった。"
            : "電車で少し遠くの進学校へ。いろんな街から集まった同級生に刺激を受けた。",
          delta: { challenge: 15, yutori: 5 },
        }),
      },
      {
        label: `専門を学べる高校へ（${specialSchool[muni.type]}など）`,
        apply: () => ({
          text: `${specialSchool[muni.type]}などを学べる高校へ。${muni.industry}の現場を見学し、手に職をつける面白さを知った。`,
          delta: { yutori: 10, tsunagari: 5 },
        }),
      },
    ],
  };
}

function eighteen(life: Life): Scene {
  const { pref, muni, family } = life;
  const choices: Choice[] = [
    {
      label: "地元で働きはじめる",
      apply: () => ({
        text: `${muni.localJob}で働きはじめた。初めてのお給料で、家族に${pref.food}をごちそうした。`,
        delta: { tsunagari: 15, yutori: 5 },
        patch: { base: "home" },
      }),
    },
    {
      label: "関西の大学・専門学校へ",
      apply: () => ({
        text: "京都・大阪・神戸——関西には大学がたくさんある。いろんな府県から来た友だちと、それぞれの「地元あるある」で盛り上がった。同じ関西でも、ことばも常識もけっこう違う。",
        delta: { challenge: 10, kokoro: 10 },
        patch: { base: "hub" },
      }),
    },
    {
      label: "東京の大学へ",
      apply: () => ({
        text: "新幹線で東京へ。「関西弁ってほんまに使うんや」と言われ、自分が関西人だということを初めて意識した。",
        delta: { challenge: 20, tsunagari: -5 },
        patch: { base: "tokyo" },
      }),
    },
  ];
  if (family.trade) {
    choices.push({
      label: `家の${family.trade}に入る`,
      apply: () => ({
        text: `家の${family.trade}に入った。親や先輩の背中から、ことばにならないコツを少しずつ学んでいった。`,
        delta: { tsunagari: 15, yutori: 5, challenge: 5 },
        patch: { base: "home", helpedFamily: true },
      }),
    });
  }
  return {
    age: "18歳",
    title: "卒業後の道",
    body: isRural(life)
      ? [
          "高校卒業。同級生の多くは、進学や就職で町を出ていく。",
          `駅のホームで「たまには帰ってきいや」と見送られる友だちもいた。あなたはどうする？`,
        ]
      : ["高校卒業。選べる道はたくさんある。", "あなたはどうする？"],
    choices,
  };
}

function work(life: Life): Scene {
  const { pref, muni, family } = life;
  let body: string[];
  let choices: Choice[];
  const uturn: Choice = {
    label: "地元に戻って就職する（Uターン）",
    apply: () => ({
      text: `${muni.name}に戻り、${muni.localJob}で働きはじめた。外で学んだことを地元で試すのが楽しかった。`,
      delta: { tsunagari: 15, kokoro: 10 },
      patch: { base: "home", returned: true },
    }),
  };

  if (life.base === "home") {
    body = [
      `地元で働いて数年。${muni.name}のことが、だんだん「大人の目」で見えてきた。`,
    ];
    choices = [
      {
        label: "このまま地元で働き続ける",
        apply: () => ({
          text: "地元の仕事を続けた。顔なじみのお客さんや仲間に支えられ、任されることが少しずつ増えていった。",
          delta: { tsunagari: 10, yutori: 10 },
        }),
      },
      {
        label: `一度、${isHub(life) ? "東京" : pref.hub}に出てみる`,
        apply: () =>
          isHub(life)
            ? {
                text: "思いきって東京に出た。人の多さと仕事の速さに驚いたが、地元で鍛えた粘り強さが役に立った。",
                delta: { challenge: 20, yutori: 5, tsunagari: -5 },
                patch: { base: "tokyo" },
              }
            : {
                text: `${pref.hub}に出て働きはじめた。人の多さと仕事の速さに驚いたが、${muni.name}で育った粘り強さが役に立った。`,
                delta: { challenge: 15, yutori: 5 },
                patch: { base: "hub" },
              },
      },
    ];
    if (family.trade) {
      choices.push(
        life.helpedFamily
          ? {
              label: `${family.trade}に新しい風を入れる`,
              apply: () => ({
                text: `SNSでの発信やネット販売を始め、家の${family.trade}を新しいやり方で広げていった。親は最初こそ渋い顔をしたが、注文が増えると何も言わなくなった。`,
                delta: { challenge: 10, yutori: 10 },
                patch: { inherited: true },
              }),
            }
          : {
              label: `家の${family.trade}を継ぐ`,
              apply: () => ({
                text: family.inherit,
                delta: { tsunagari: 15, kokoro: 5 },
                patch: { inherited: true },
              }),
            },
      );
    }
  } else if (life.base === "hub") {
    body = [
      "卒業の年。関西には仕事も多い。どこで働くか、選ぶときが来た。",
    ];
    choices = [
      {
        label: isHub(life) ? `地元の${muni.name}で就職する` : "関西の都市で就職する",
        apply: () => ({
          text: "関西の都市部で就職した。満員電車にも慣れ、休みの日は友だちと食べ歩き。",
          delta: { yutori: 15, challenge: 5 },
        }),
      },
      {
        label: "東京で就職する",
        apply: () => ({
          text: "東京の会社に就職した。仕事の規模の大きさに鍛えられた。関西出身の同僚とは、なぜか自然と集まるようになった。",
          delta: { challenge: 20, yutori: 10, tsunagari: -5 },
          patch: { base: "tokyo" },
        }),
      },
    ];
    if (!isHub(life)) choices.push(uturn);
  } else {
    body = [
      "卒業の年。東京の生活にもすっかり慣れた。",
      `それでも帰省のたびに、${pref.food}の味が恋しくなる。`,
    ];
    choices = [
      {
        label: "東京で就職する",
        apply: () => ({
          text: "東京で就職した。忙しい毎日の中で、関西のことばはだんだん「よそ行き」と「地元用」の使い分けになった。",
          delta: { yutori: 15, challenge: 10 },
        }),
      },
      {
        label: "関西に戻って就職する",
        apply: () => ({
          text: "関西の会社に就職した。新幹線を降りて関西のことばが聞こえた瞬間、「帰ってきた」と思った。",
          delta: { yutori: 10, kokoro: 10 },
          patch: { base: "hub" },
        }),
      },
    ];
    if (!isHub(life)) choices.push(uturn);
  }
  return { age: "22〜30歳", title: "はたらく", body, choices };
}

function midlife(life: Life): Scene {
  const { muni } = life;
  const dialect = dialectOf(life);
  const where: Record<Base, string> = {
    home: `${muni.name}での暮らしも、すっかり板についた。`,
    hub: "関西の都市で、仕事も暮らしも落ち着いてきた。",
    tokyo: "東京暮らしも長くなった。",
  };
  return {
    age: "30〜45歳",
    title: "暮らしをつくる",
    body: [`30代。${where[life.base]}`, "何を大事にして暮らしていこう？"],
    choices: [
      {
        label: "家庭を持ち、子育てに奮闘する",
        apply: () => ({
          text:
            atHome(life)
              ? `子どもが生まれた。近くに住む親や近所の人に助けられての子育て。「${muni.festival}」に、今度は親として子どもを連れていった。`
              : `子どもが生まれた。保育園の送り迎えに追われる毎日。帰省すると、祖父母が孫に${dialect.name}で話しかけていて、なんだか嬉しかった。`,
          delta: { tsunagari: 10, kokoro: 10, yutori: -5 },
        }),
      },
      {
        label: "自分のペースで、好きなことを大事にする",
        apply: () => ({
          text: "自分の時間を大切にした。旅に出たり、趣味の仲間と出会ったり。自分にとっての「ちょうどいい」がわかってきた。",
          delta: { kokoro: 15, challenge: 5 },
        }),
      },
      {
        label: "地域の活動に関わる",
        apply: () => ({
          text:
            life.base === "home" && isRural(life)
              ? "消防団や祭りの役員を引き受けた。大変だけれど、地域の人に頼られる存在になった。"
              : "町内会や子ども食堂の手伝いを始めた。住んでいる街に、知り合いがどんどん増えていった。",
          delta: { tsunagari: 20, kokoro: 5, yutori: -5 },
        }),
      },
      {
        label: "学び直して、新しい仕事に挑む",
        apply: () => ({
          text: "仕事の合間に学び直し、思いきって転職した。新しい分野で、もう一度ゼロから。",
          delta: { challenge: 15, yutori: 5 },
        }),
      },
    ],
  };
}

function later(life: Life): Scene {
  const { muni, family } = life;
  const newThings = [
    "関西の別のまちへ移り住み、小さな店を開いた。",
    "農業を始めた。土に触れる暮らしは、思っていた以上に奥が深かった。",
    `${muni.specialty}を全国に届ける小さな会社を立ち上げた。`,
    "これまでの経験を活かして、若い人の相談に乗る仕事を始めた。",
  ];
  const choices: Choice[] = [];
  if (!atHome(life)) {
    choices.push({
      label: `${muni.name}に帰る`,
      apply: () => ({
        text: `${muni.name}に戻った。子どもの頃に遊んだ場所を歩くと、町は少し変わり、少し変わっていなかった。「おかえり」と言ってくれる人がまだいた。`,
        delta: { tsunagari: 20, kokoro: 10 },
        patch: { base: "home", returned: true },
      }),
    });
  } else {
    choices.push({
      label: "地元の次の世代を支える",
      apply: () => ({
        text: `若い人に仕事を教え、地域の行事を引き継いでいった。${family.trade && life.inherited ? `家の${family.trade}も、次の担い手が見えてきた。` : ""}「あの人に聞いたらええ」と言われる存在になった。`,
        delta: { tsunagari: 15, kokoro: 10 },
      }),
    });
  }
  choices.push(
    {
      label: "今の場所で、根を張って暮らす",
      apply: () => ({
        text: "慣れた街で、慣れた人たちと暮らし続けた。行きつけの店、いつもの散歩道。それが何よりの財産になった。",
        delta: { kokoro: 10, yutori: 10 },
      }),
    },
    {
      label: "第二の人生で新しいことを始める",
      apply: () => ({
        text: pick(newThings, rand(life.seed, "newpath")),
        delta: { challenge: 15, kokoro: 10 },
        patch: { newPath: true },
      }),
    },
  );
  return {
    age: "50〜65歳",
    title: "これからの人生",
    body: [
      "50代。親は年を重ね、自分の体にも少しずつ変化が出てきた。",
      "この先の人生を、どこで、どう過ごそう？",
    ],
    choices,
  };
}

// ---- 人生のゆらぎ（選べない出来事）。つらい出来事も、その先の姿まで描く ----
type LifeEvent = {
  id: string;
  when: (life: Life, late: boolean) => boolean;
  text: (life: Life) => string;
  delta: Partial<Stats>;
};

const events: LifeEvent[] = [
  {
    id: "school",
    when: (l) => isRural(l) && l.muni.type !== "town",
    text: () =>
      "通っていた小学校が、近くの学校と統合されることになった。寂しさもあったが、閉校式には卒業生が全国から集まり、懐かしい顔ぶれと再会できた。",
    delta: { tsunagari: 10, kokoro: 5 },
  },
  {
    id: "rest",
    when: () => true,
    text: (l) =>
      `仕事に追われ、心と体が疲れてしまった時期があった。思いきって休み、実家で${l.pref.food}を食べて、少しずつ元気を取り戻した。無理をしすぎない働き方を覚えた。`,
    delta: { yutori: -5, kokoro: 5 },
  },
  {
    id: "care",
    when: (_, late) => late,
    text: () =>
      "親の介護が始まった。ひとりで抱え込まず、きょうだいや介護サービス、近所の人の力を借りて乗りきった。",
    delta: { tsunagari: 10, yutori: -5 },
  },
  {
    id: "typhoon",
    when: (l) => ["coast", "countryside", "mountain"].includes(l.muni.type),
    text: (l) =>
      `大きな台風が${l.muni.name}を通りすぎた。みんなで片づけに汗を流し、次の季節にはいつもの風景が戻ってきた。`,
    delta: { tsunagari: 10 },
  },
  {
    id: "merger",
    when: (l) => l.base !== "home" || !l.inherited,
    text: () =>
      "勤め先の会社が合併し、仕事の環境が大きく変わった。戸惑いもあったが、新しい仲間との出会いが転機になった。",
    delta: { challenge: 10, yutori: -5 },
  },
  {
    id: "slump",
    when: (l) => l.inherited,
    text: (l) =>
      `家の${l.family.trade}の売れ行きが落ち込んだ時期があった。ネット販売を始めてみると、思いがけず遠くの町から注文が届くようになった。`,
    delta: { challenge: 10, yutori: 5 },
  },
  {
    id: "newcomers",
    when: (l) => isRural(l),
    text: (l) =>
      `${l.muni.name}に若い移住者がやってきた。古い家がカフェになり、地元の良さを「外の人の目」で教えてもらった。`,
    delta: { kokoro: 10, tsunagari: 5 },
  },
  {
    id: "reunion",
    when: () => true,
    text: (l) =>
      `同窓会で昔の友だちと再会した。「${l.muni.festival}」の思い出話で盛り上がり、「また地元で何かやろう」と約束した。`,
    delta: { tsunagari: 10, kokoro: 5 },
  },
  {
    id: "illness",
    when: (_, late) => late,
    text: () =>
      "思いがけず病気が見つかり、入院することになった。早めの治療で回復し、健康診断の大切さと、見舞いに来てくれた人のありがたさが身にしみた。",
    delta: { kokoro: 5, yutori: -5 },
  },
  {
    id: "trip",
    when: () => true,
    text: (l) =>
      `久しぶりに${pick(
        prefectures.filter((p) => p.id !== l.pref.id),
        rand(l.seed, "trip"),
      ).name}を旅した。同じ関西でも、ことばも食べ物もこんなに違うのかと改めて驚いた。`,
    delta: { kokoro: 10 },
  },
];

function lifeEvent(late: boolean) {
  return (life: Life): Scene => {
    const used = life.log.map((e) => e.title);
    const pool = events.filter(
      (e) => e.when(life, late) && !used.includes(eventTitle(e.id)),
    );
    const ev = pick(pool, rand(life.seed, late ? "ev2" : "ev1"));
    return {
      age: late ? "46〜50歳" : "30歳ごろ",
      title: eventTitle(ev.id),
      body: [ev.text(life)],
      choices: [
        {
          label: "次へ",
          apply: () => ({ text: ev.text(life), delta: ev.delta }),
        },
      ],
    };
  };
}

// ログで同じ出来事が2度起きないよう、出来事ごとに見出しを分ける
function eventTitle(id: string): string {
  const titles: Record<string, string> = {
    school: "母校の閉校",
    rest: "立ち止まった時期",
    care: "親の介護",
    typhoon: "台風のあと",
    merger: "会社の合併",
    slump: "家業のピンチ",
    newcomers: "新しい住人",
    reunion: "同窓会",
    illness: "病気と回復",
    trip: "関西の旅",
  };
  return titles[id];
}

export const steps: ((life: Life) => Scene)[] = [
  birth,
  childhood,
  teens,
  eighteen,
  work,
  lifeEvent(false),
  midlife,
  lifeEvent(true),
  later,
];

// ---- エンディング ----
export function ending(life: Life) {
  const { muni, family, stats } = life;
  let title: string;
  if (life.inherited && atHome(life)) {
    title = `${family.trade}を次の世代へつなぐ人`;
  } else if (life.newPath) {
    title = "人生の後半に新しい扉を開いた人";
  } else if (life.returned) {
    title = `${muni.name}に帰ってきた人`;
  } else if (atHome(life)) {
    title = `${muni.name}の灯をともし続ける人`;
  } else if (life.base === "tokyo") {
    title = "東京で関西のこころを持ち続ける人";
  } else {
    title = "関西の真ん中で生きる人";
  }

  const top = (Object.keys(stats) as StatKey[]).reduce((a, b) =>
    stats[b] > stats[a] ? b : a,
  );
  const subtitles: Record<StatKey, string> = {
    tsunagari: "人とのつながりに恵まれた人生",
    yutori: "堅実で、暮らしにゆとりのある人生",
    challenge: "挑戦を重ねた人生",
    kokoro: "心の満ち足りた人生",
  };

  const closing: Record<Base, string> = {
    home: life.returned
      ? `一度はふるさとを離れ、また${muni.name}に戻ってきました。外で見たものが、ふるさとを見る目を変えてくれました。`
      : `生まれた${muni.name}で、人生の大半を過ごしました。`,
    hub: "関西の都市で暮らし、ふるさととは「近すぎず遠すぎず」の距離で付き合ってきました。",
    tokyo: "東京で暮らしながらも、関西のことばと味は、ずっとあなたの一部でした。",
  };

  const dialect = dialectOf(life);
  const facts = [life.pref.fact, muni.fact, dialect.note].filter(
    (f): f is string => Boolean(f),
  );

  return {
    title,
    subtitle: subtitles[top],
    closing: closing[atHome(life) ? "home" : life.base],
    facts,
  };
}
