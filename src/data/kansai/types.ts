// 「関西人分の1」のデータ型

// 生まれた土地のタイプ。高校の通い方やイベントの出方が変わる
export type AreaType =
  | "city" // 大都市
  | "suburb" // 住宅都市・ベッドタウン
  | "town" // 地方の中心都市・城下町
  | "countryside" // 里山・農村
  | "coast" // 海辺の町
  | "mountain"; // 山あいの町

export type FamilyId =
  | "office"
  | "shop"
  | "factory"
  | "farm"
  | "orchard"
  | "fishing"
  | "craft"
  | "public"
  | "inn"
  | "forest";

export type Family = {
  id: FamilyId;
  name: string; // 「〜の家」
  // 家業がある場合の呼び名（店・工場・田畑など）。会社員・公務員の家はなし
  trade?: string;
  help: string; // 子どもの頃に手伝った様子
  inherit: string; // 家業を継いだときの描写
};

export type Dialect = {
  name: string;
  lines: string[];
  note?: string; // ことばのまめ知識
};

export type Municipality = {
  name: string;
  pop: number; // 人口（万人、2020年国勢調査ベースの概数）
  type: AreaType;
  catch: string; // まちの一言紹介
  scene: string; // 子どもの頃の風景
  industry: string; // 地場産業
  specialty: string; // 名物・特産
  festival: string; // 毎年の楽しみ
  localJob: string; // 地元での仕事の例
  families: [FamilyId, number][]; // 生まれる家の重み
  fact: string; // まめ知識
  dialect?: Dialect; // 府県の標準と違う場合
};

export type Prefecture = {
  id: string;
  name: string;
  pop: number; // 人口（万人）
  hub: string; // 進学・就職で出ていく先の大都市
  food: string; // 府県を代表する味
  dialect: Dialect;
  fact: string;
  municipalities: Municipality[];
};
