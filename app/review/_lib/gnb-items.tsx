import { Blocks, Compass, Home, UserRoundSearch } from "lucide-react";

import { createSpriteIcon } from "@/lib/sprite-icon";
import type { GnbItem } from "@/components/app/gnb";

const AssetIcon = createSpriteIcon("asset-icon");

/**
 * `/review/*` 전용 GNB 항목 + 라우팅 맵. 라이브 사이트(gabrielle-ai.com) 카피본
 * 4개(Self/Compass/Content Studio/Know Thyself)를 서로 오갈 수 있게 한다 —
 * Dashboard는 이번 조사 범위 밖이라 인덱스(`/review`)로 보낸다.
 */
export const REVIEW_GNB_ITEMS: GnbItem[] = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "assets", icon: AssetIcon, label: "Self" },
  { id: "compass", icon: Compass, label: "Compass" },
  { id: "contents-studio", icon: Blocks, label: "Content Studio" },
  { id: "know-thyself", icon: UserRoundSearch, label: "Know Thyself" },
];

export const REVIEW_GNB_PATHS: Record<string, string> = {
  dashboard: "/review",
  assets: "/review/assets",
  compass: "/review/compass",
  "contents-studio": "/review/content-studio",
  "know-thyself": "/review/know-thyself",
};
