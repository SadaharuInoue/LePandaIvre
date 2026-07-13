import type { NextConfig } from "next";

// GitHub Pages (https://sadaharuinoue.github.io/LePandaIvre/) 向け静的エクスポート設定
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/LePandaIvre",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
