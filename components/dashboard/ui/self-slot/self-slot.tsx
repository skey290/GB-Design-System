"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

import styles from "./self-slot.module.css";

/**
 * Figma `Part/self`(40×40 원형 슬롯) — `SelfCuration`이 8개를 원형 배치해 사용.
 * 스펙 상세는 `docs/persona-radial-chart-spec.md` 참고.
 */

export interface SelfSlotPersona {
  /** 아바타 alt 텍스트 */
  name: string;
  /** 아바타 이미지 URL. 없으면 initials → 아이콘 순으로 폴백됩니다 */
  imageSrc?: string;
  /** 아바타 이미지가 없을 때 표시할 이니셜 */
  initials?: string;
}

export interface SelfSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 표시할 페르소나. 없으면 "No Self" 빈 슬롯(Figma `style=empty`)이 됩니다 */
  persona?: SelfSlotPersona | null;
  /** Figma `Status` variant. `active`는 흰 링 강조(아바타는 블러+딤 오버레이, 빈 슬롯은 배경 채움) */
  status?: "default" | "active";
}

/** 빈 슬롯에 표시되는 플레이스홀더 문구 (Figma 원본 그대로) */
const PLACEHOLDER_LABEL = "No Self";

export function SelfSlot({
  persona,
  status = "default",
  className,
  ...props
}: SelfSlotProps) {
  const isActive = status === "active";

  if (persona) {
    return (
      <div className={cn(styles.filledRoot, className)} {...props}>
        <Avatar
          variant="image"
          shape="circle"
          src={persona.imageSrc}
          initials={persona.initials}
          alt={persona.name}
          // Avatar의 CSS Module이 width/height:32px를 언레이어드로 고정해 Tailwind
          // size-full(className)보다 우선하므로, inline style로 덮어써야 40px가 적용된다
          style={{ width: 40, height: 40 }}
          className={styles.avatarImg}
          data-active={isActive || undefined}
        />
        <span
          aria-hidden="true"
          className={styles.overlay}
          data-active={isActive || undefined}
        />
        {/* 강조 링은 outline이 아니라 별도 span(DOM상 가장 뒤)으로 그린다 — 음수
            outline-offset은 40px를 꽉 채우는 아바타 자식에 가려 Chrome에서 안 보인다 */}
        <span
          aria-hidden="true"
          className={styles.ring}
          data-active={isActive || undefined}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={PLACEHOLDER_LABEL}
      className={cn(styles.emptyRoot, className)}
      data-active={isActive || undefined}
      {...props}
    >
      <span aria-hidden="true">{PLACEHOLDER_LABEL}</span>
    </div>
  );
}
