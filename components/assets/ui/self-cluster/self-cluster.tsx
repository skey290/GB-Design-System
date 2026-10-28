"use client";

import * as React from "react";

import { Icon } from "@/lib/sprite-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export interface SelfMenuAction {
  label: string;
  onSelect: () => void;
}

/**
 * Slot centers relative to the 420×420 cluster center — Figma-measured,
 * radius not uniform (node `8004:7827` "Self profile"). `rotate`는 카드가
 * 실제로 화면에 보이는 최종 기울기다 — Figma `Part/self profile`은 포지션별로
 * 그룹을 ±90/135/180도 돌린 뒤 사진 레이어 안에서 다시 반대로 역회전시켜서,
 * 동/서/남쪽은 항상 업라이트(0도)로, 대각선 4곳은 ±45도로만 보이게 만든다
 * (node `8004:8032` 등 마스터 컴포넌트에 내장된 패턴, 위치 각도 그대로를 쓰지 않음).
 * 동/서는 그 상쇄 과정에서 사진을 자르는 프레임(마스크) 자체가 세로(84×106)가
 * 아니라 가로(106×84)로 고정된다 — 겉보기 회전은 0이어도 프레임 치수는 스왑됨.
 */
export const SELF_SLOTS = [
  {
    id: "north",
    dx: 0,
    dy: -166,
    rotate: 0,
    width: 84,
    height: 106,
    labelDx: 9.5,
    labelDy: -242,
  },
  {
    id: "north-east",
    dx: 111.75,
    dy: -109.8,
    rotate: 45,
    width: 84,
    height: 106,
    labelDx: 216.1,
    labelDy: -163.5,
  },
  {
    id: "east",
    dx: 157,
    dy: 0,
    rotate: 0,
    width: 106,
    height: 84,
    labelDx: 282.5,
    labelDy: 0.5,
  },
  {
    id: "south-east",
    dx: 111.75,
    dy: 109.71,
    rotate: -45,
    width: 84,
    height: 106,
    labelDx: 213.7,
    labelDy: 163.5,
  },
  {
    id: "south",
    dx: 0,
    dy: 166,
    rotate: 0,
    width: 84,
    height: 106,
    labelDx: 9.5,
    labelDy: 241,
  },
  {
    id: "south-west",
    dx: -111.85,
    dy: 109.7,
    rotate: 45,
    width: 84,
    height: 106,
    labelDx: -218.6,
    labelDy: 161.7,
  },
  {
    id: "west",
    dx: -157,
    dy: 0,
    rotate: 0,
    width: 106,
    height: 84,
    labelDx: -275.5,
    labelDy: 0,
  },
  {
    id: "north-west",
    dx: -111.85,
    dy: -109.8,
    rotate: -45,
    width: 84,
    height: 106,
    labelDx: -203.6,
    labelDy: -165.7,
  },
] as const;

/** 메뉴/드롭다운 호버 닫힘 유예 시간(ms) — 카드↔라벨↔드롭다운 사이를 이동할 때 깜빡임 방지 */
const HOVER_CLOSE_DELAY = 150;

/**
 * Figma `status="selected"`의 코너 브래킷 — 사진 변을 감싸는 연속 테두리가
 * 아니라 네 모서리에 떨어진 1/4원 호 4개(카메라 뷰파인더 스타일). `imgProfileFrame`
 * raw export 실측 기준 93×115 박스, stroke 3px/radius 16. filled/empty 사이에
 * 상하 오프셋이 ±1.5px 정도 미세하게 갈리고 측정 경로별로도 ~1px 흔들려서
 * 신뢰 구간 안이라, 카드 중심에 상하좌우 균등(4.5px)하게 띄우는 쪽으로 통일했다
 * — 점선 테두리 기준 간격이 일정해 보이는 게 중요하다는 사용자 확인 반영.
 * 항상 다크 배경에서만 쓰이므로 `--gb-border-bolder`의 다크모드 값(원본 asset
 * 고정 hex와 동일)을 그대로 사용. 동/서(가로형 카드)는 Figma가 이 세로형
 * 브래킷을 그대로 90도 회전해 재사용하는 구조라 `rotate`로 동일 SVG를 돌려 쓴다.
 */
function SelfProfileFrame({ rotate }: { rotate?: boolean }) {
  return (
    <svg
      viewBox="0 0 93 115"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 w-[93px] h-[115px] -translate-x-1/2 -translate-y-1/2${rotate ? " rotate-90" : ""}`}
    >
      <path
        d="M17.5 1.5C8.66344 1.5 1.5 8.66344 1.5 17.5"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M72.5 1.5C81.33656 1.5 88.5 8.66344 88.5 17.5"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M17.5 110.5C8.66344 110.5 1.5 103.33656 1.5 94.5"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M72.5 110.5C81.33656 110.5 88.5 103.33656 88.5 94.5"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ClusterSelf {
  id: string;
  slotId: (typeof SELF_SLOTS)[number]["id"];
  label: string;
  image: string;
}

export interface SelfClusterProps {
  selves: ClusterSelf[];
  /** Figma `status="selected"` — 코너 브래킷으로 표시. 메뉴가 열린 동안은 숨김(with-name의 menu-selected는 브래킷 없음) */
  selectedSelfId?: string;
  onAddSelf: (slotId: string) => void;
  onSelectSelf: (self: ClusterSelf) => void;
  getSelfMenuActions: (self: ClusterSelf) => SelfMenuAction[];
}

/** Figma `Part/self profile` + `Self profile` (node `8622:90018` "Self portrait" 섹션). 8슬롯 원형 Self 배치. */
export function SelfCluster({
  selves,
  selectedSelfId,
  onAddSelf,
  onSelectSelf,
  getSelfMenuActions,
}: SelfClusterProps) {
  const selfBySlot = new Map(selves.map((self) => [self.slotId, self]));
  const northSelf = selfBySlot.get("north");

  // 드롭다운은 클릭으로 열고, 트리거/드롭다운 밖으로 마우스가 나가면 닫는다(호버로 열지 않음) — 사용자 확정.
  const [openSlotId, setOpenSlotId] = React.useState<string | null>(null);
  const closeTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const openSlotMenu = (slotId: string) => {
    clearTimeout(closeTimeoutRef.current);
    setOpenSlotId(slotId);
  };
  const scheduleCloseSlotMenu = (slotId: string) => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenSlotId((current) => (current === slotId ? null : current));
    }, HOVER_CLOSE_DELAY);
  };

  // 가운데 텍스트는 썸네일을 호버할 때마다 그 Self의 이름으로 바뀐다 — 메뉴 열림과는 무관한 별도 상태.
  const [hoveredSelfId, setHoveredSelfId] = React.useState<string | null>(null);
  const hoveredSelf = selves.find((self) => self.id === hoveredSelfId);
  const centerSelf = hoveredSelf ?? northSelf;

  // 빈 슬롯의 selected 코너 브래킷(Figma `Profile type=empty, Status=selected`)은
  // 채워진 슬롯과 달리 영구 선택 개념이 없어서, hover/focus일 때만 보여준다.
  const [focusedEmptySlotId, setFocusedEmptySlotId] = React.useState<
    string | null
  >(null);

  return (
    <div className="relative size-[420px]">
      {SELF_SLOTS.map((slot) => {
        const self = selfBySlot.get(slot.id);

        return (
          <div
            key={slot.id}
            style={{
              width: slot.width,
              height: slot.height,
              transform: `translate(-50%, -50%) translate(${slot.dx}px, ${slot.dy}px) rotate(${slot.rotate}deg)`,
            }}
            className="absolute top-1/2 left-1/2 transition-transform duration-300 ease-out"
          >
            {self ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={self.image}
                  alt={self.label}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSelf(self)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectSelf(self);
                    }
                  }}
                  onMouseEnter={() => setHoveredSelfId(self.id)}
                  onMouseLeave={() =>
                    setHoveredSelfId((current) =>
                      current === self.id ? null : current,
                    )
                  }
                  className="size-full cursor-pointer rounded-[var(--gb-radius-scale-2xl)] object-cover"
                />
                {self.id === selectedSelfId && openSlotId !== slot.id && (
                  <SelfProfileFrame rotate={slot.width > slot.height} />
                )}
              </>
            ) : (
              <div
                className="relative flex size-full items-center justify-center rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-dashed border-[var(--gb-border-bolder)]"
                onMouseEnter={() => setFocusedEmptySlotId(slot.id)}
                onMouseLeave={() =>
                  setFocusedEmptySlotId((current) =>
                    current === slot.id ? null : current,
                  )
                }
                onFocus={() => setFocusedEmptySlotId(slot.id)}
                onBlur={() =>
                  setFocusedEmptySlotId((current) =>
                    current === slot.id ? null : current,
                  )
                }
              >
                <div style={{ transform: `rotate(${-slot.rotate}deg)` }}>
                  <Button
                    variant="icon"
                    icon={<Icon id="plus-icon" />}
                    aria-label="Add a Self"
                    onClick={() => onAddSelf(slot.id)}
                    isSelected={focusedEmptySlotId === slot.id}
                    style={
                      focusedEmptySlotId === slot.id
                        ? { background: "var(--gb-background-mute-subtle)" }
                        : undefined
                    }
                  />
                </div>
                {focusedEmptySlotId === slot.id && (
                  <SelfProfileFrame rotate={slot.width > slot.height} />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 라벨은 카드의 회전된 로컬 좌표계가 아니라 카드와 분리된 형제로 두고
          슬롯별 labelDx/labelDy(420×420 프레임 중심 기준, Figma 실측)로 배치한다
          — 슬롯마다 카드-라벨 간격이 다 달라서(북/남은 좁고 동/서는 넓음) 단일
          공식으로 근사할 수 없었다. */}
      {SELF_SLOTS.map((slot) => {
        const self = selfBySlot.get(slot.id);
        if (!self) return null;

        const actions = getSelfMenuActions(self);
        // 서쪽 계열(dx<0)은 "< label", 그 외는 "label >" — Figma 확정 (node `8004:7989`).
        const isReversed = slot.dx < 0;

        return (
          <div
            key={`${slot.id}-label`}
            style={{
              transform: `translate(-50%, -50%) translate(${slot.labelDx}px, ${slot.labelDy}px)`,
            }}
            className="absolute top-1/2 left-1/2"
          >
            {/* 값은 절대 options와 매치되지 않는 센티널이라 트리거엔 항상
                `placeholder`(Self 이름)만 보인다 — 이 컨트롤은 상태를 저장하는
                선택이 아니라 액션 메뉴(Create a Post 등)를 여는 용도다.
                드롭다운은 클릭으로 열고, 트리거/드롭다운 밖으로 마우스가
                나가면 닫힌다(호버로 열리지는 않음 — 사용자 확정). */}
            <Select
              variant={isReversed ? "side-reverse" : "side"}
              value=""
              placeholder={self.label}
              options={actions.map((action) => ({
                value: action.label,
                label: action.label,
              }))}
              onValueChange={(value) =>
                actions.find((action) => action.label === value)?.onSelect()
              }
              open={openSlotId === slot.id}
              onOpenChange={(next) =>
                next ? openSlotMenu(slot.id) : scheduleCloseSlotMenu(slot.id)
              }
              onTriggerMouseLeave={() => scheduleCloseSlotMenu(slot.id)}
              onContentMouseEnter={() => openSlotMenu(slot.id)}
              onContentMouseLeave={() => scheduleCloseSlotMenu(slot.id)}
            />
          </div>
        );
      })}

      {selves.length === 0 ? (
        <p className="text-sm-medium absolute top-[calc(50%-20px)] left-1/2 -translate-x-1/2 text-center text-[var(--gb-text-default)]">
          Self is
          <br />
          Not Created Yet.
        </p>
      ) : (
        centerSelf && (
          <p className="text-sm-medium absolute top-[calc(50%-10px)] left-1/2 -translate-x-1/2 text-center text-[var(--gb-text-default)]">
            {centerSelf.label}
          </p>
        )
      )}
    </div>
  );
}
