"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Icon } from "@/lib/sprite-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ProfilePrint } from "@/components/app/profile-print";

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
const RAW_SELF_SLOTS = [
  { id: "north", dx: 0, dy: -166, rotate: 0, width: 84, height: 106 },
  {
    id: "north-east",
    dx: 111.75,
    dy: -109.8,
    rotate: 45,
    width: 84,
    height: 106,
  },
  { id: "east", dx: 157, dy: 0, rotate: 0, width: 106, height: 84 },
  {
    id: "south-east",
    dx: 111.75,
    dy: 109.71,
    rotate: -45,
    width: 84,
    height: 106,
  },
  { id: "south", dx: 0, dy: 166, rotate: 0, width: 84, height: 106 },
  {
    id: "south-west",
    dx: -111.85,
    dy: 109.7,
    rotate: 45,
    width: 84,
    height: 106,
  },
  { id: "west", dx: -157, dy: 0, rotate: 0, width: 106, height: 84 },
  {
    id: "north-west",
    dx: -111.85,
    dy: -109.8,
    rotate: -45,
    width: 84,
    height: 106,
  },
] as const;

/** 카드의 가까운 단변 중앙 ↔ 셀렉트 쪽 기준 변 중앙 사이 목표 간격 */
const LABEL_EDGE_OFFSET = 10;

/**
 * 북/남 슬롯 전용 보정값. 북/남은 카드와 라벨이 세로로 이어지므로 셀렉트의
 * 좌/우 단변(너비 방향)이 아니라 텍스트 span 자체의 장변(위/아래, 카드와
 * 마주보는 변)을 기준 삼는다. 텍스트 span은 버튼 안에서 수직 중앙 정렬되므로
 * span 중심 = 버튼 중심이고, span의 렌더 높이(`--gb-leading-4`, 16px)만큼
 * 더 띄워야 "span의 장변 중앙 ↔ 카드 단변 중앙 = 10px"가 버튼 중심 기준
 * 오프셋으로 환산된다.
 */
const LABEL_TEXT_HALF_HEIGHT = 8;

/**
 * 라벨(Select) 위치 = 카드에서 가장 가까운 단변의 중심에서 바깥쪽으로
 * `LABEL_EDGE_OFFSET`만큼 더 띄운 자리. 카드의 장축(84×106 중 106)은 항상
 * 클러스터 중심→카드 중심 방향(라디얼)과 나란하므로, 그 단변은 카드 중심에서
 * 라디얼 방향으로 장축의 절반(53px)만큼 떨어진 지점에 있다 — 슬롯마다 따로
 * 측정한 비균일 간격 대신 이 공식 하나로 8방향 전부를 계산한다. 북/남은
 * `LABEL_TEXT_HALF_HEIGHT`만큼 더 띄워서, 버튼 중심이 아니라 텍스트
 * span의 장변이 카드 단변과 10px 떨어지도록 한다.
 */
export const SELF_SLOTS = RAW_SELF_SLOTS.map((slot) => {
  const isVertical = slot.id === "north" || slot.id === "south";
  const radius = Math.hypot(slot.dx, slot.dy);
  const edgeDistance =
    Math.max(slot.width, slot.height) / 2 +
    LABEL_EDGE_OFFSET +
    (isVertical ? LABEL_TEXT_HALF_HEIGHT : 0);
  return {
    ...slot,
    labelDx: slot.dx + (slot.dx / radius) * edgeDistance,
    labelDy: slot.dy + (slot.dy / radius) * edgeDistance,
  };
});

/** 메뉴/드롭다운 호버 닫힘 유예 시간(ms) — 카드↔라벨↔드롭다운 사이를 이동할 때 깜빡임 방지 */
const HOVER_CLOSE_DELAY = 150;

/**
 * Figma `status="selected"`의 코너 브래킷 — 사진 변을 감싸는 연속 테두리가
 * 아니라 네 모서리에 떨어진 1/4원 호 4개(카메라 뷰파인더 스타일). 각 모서리
 * 호를 카드 모서리 기준 동일 오프셋(3px) · 동일 반경(16px, Figma 원본)으로
 * 독립 계산해서 네 모서리가 전부 같은 간격으로 보이도록 만들었다 — raw export
 * 좌표를 그대로 복사하면 원점(top-left) 기준 값만 맞고 반대편(우/하단) 모서리는
 * 예전 박스 크기 기준 좌표가 남아 안쪽으로 치우쳐 보이는 문제가 있었음. 호의
 * 접점이 viewBox 경계에 정확히 닿기 때문에 `overflow-visible`이 없으면
 * stroke(3px) 끝이 살짝 잘린다. 항상 다크 배경에서만 쓰이므로
 * `--gb-border-bolder`의 다크모드 값(원본 asset 고정 hex와 동일)을 그대로
 * 사용. 동/서(가로형 카드)는 Figma가 이 세로형 브래킷을 그대로 90도 회전해
 * 재사용하는 구조라 `rotate`로 동일 SVG를 돌려 쓴다.
 */
function SelfProfileFrame({ rotate }: { rotate?: boolean }) {
  return (
    <svg
      viewBox="0 0 90 112"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 w-[90px] h-[112px] overflow-visible -translate-x-1/2 -translate-y-1/2${rotate ? " rotate-90" : ""}`}
    >
      <path
        d="M16 0C7.16344 0 0 7.16344 0 16"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M74 0C82.83656 0 90 7.16344 90 16"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M0 96C0 104.83656 7.16344 112 16 112"
        stroke="var(--gb-border-bolder)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M74 112C82.83656 112 90 104.83656 90 96"
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
  /**
   * Figma `status="selected"` — 코너 브래킷으로 표시. 메뉴가 열린 동안은
   * 숨김(with-name의 menu-selected는 브래킷 없음). 같은 브래킷이 호버 중인
   * Self에도 나타나 "지금 이 Self를 보고 있다"는 걸 알려준다(가운데 텍스트가
   * 호버한 Self 이름으로 바뀌는 것과 같은 상태를 공유).
   */
  selectedSelfId?: string;
  onAddSelf: (slotId: string) => void;
  onSelectSelf: (self: ClusterSelf) => void;
  getSelfMenuActions: (self: ClusterSelf) => SelfMenuAction[];
  /** 이미지 클릭 시 뜨는 확대 미리보기(ProfilePrint) 안의 "Edit Profile Portrait" 클릭 콜백 */
  onEditSelfImage?: (self: ClusterSelf) => void;
  /**
   * 확대 미리보기를 띄울 DOM 컨테이너. 지정하면 그 컨테이너 안에서(그
   * 컨테이너의 `position`을 기준으로) 가운데 정렬되고, 미지정 시 화면
   * 전체 기준으로 가운데 정렬된다 — AssetPanel처럼 항상 보여야 하는
   * 영역을 뺀 캔버스 영역에만 띄우고 싶을 때 그 영역의 DOM 노드를 넘긴다.
   */
  previewPortalContainer?: Element | null;
}

/** Figma `Part/self profile` + `Self profile` (node `8622:90018` "Self portrait" 섹션). 8슬롯 원형 Self 배치. */
export function SelfCluster({
  selves,
  selectedSelfId,
  onAddSelf,
  onSelectSelf,
  getSelfMenuActions,
  onEditSelfImage,
  previewPortalContainer,
}: SelfClusterProps) {
  const selfBySlot = new Map(selves.map((self) => [self.slotId, self]));
  const northSelf = selfBySlot.get("north");

  // 이미지 클릭 시 확대 미리보기(ProfilePrint) 팝오버를 그 이미지 기준으로 띄운다 — 선택(onSelectSelf)과는 별도 상태.
  const [previewSlotId, setPreviewSlotId] = React.useState<string | null>(null);
  // previewPortalContainer가 있으면 그 컨테이너 기준 absolute, 없으면 화면 기준 fixed로 가운데 정렬한다.
  const previewPositionClass = previewPortalContainer ? "absolute" : "fixed";

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
                <DialogPrimitive.Root
                  open={previewSlotId === slot.id}
                  onOpenChange={(open) =>
                    setPreviewSlotId(open ? slot.id : null)
                  }
                >
                  <DialogPrimitive.Trigger asChild>
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
                  </DialogPrimitive.Trigger>
                  <DialogPrimitive.Portal
                    container={previewPortalContainer ?? undefined}
                  >
                    <div className="dark">
                      {/* 확대 미리보기는 ProfilePrint(완성형)를 그대로
                          previewPortalContainer(지정 시) 또는 화면 가운데에
                          띄운다 — 열리자마자 포커스가 ProfilePrint 내부의
                          "Edit Profile Portrait" 버튼으로 자동 이동하면 그 즉시
                          :focus-within로 호버 오버레이가 떠버리므로, onOpenAutoFocus를
                          막아서 실제 마우스 호버에만 반응하게 한다. */}
                      <DialogPrimitive.Content
                        onOpenAutoFocus={(event) => event.preventDefault()}
                        className={`${previewPositionClass} top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-1/2 outline-none`}
                      >
                        <DialogPrimitive.Title className="sr-only">
                          {`${self.label} 이미지 확대 미리보기`}
                        </DialogPrimitive.Title>
                        <div className="relative">
                          <ProfilePrint
                            type="completed"
                            portraitSrc={self.image}
                            portraitAlt={self.label}
                            timestamp=""
                            onEditImage={() => onEditSelfImage?.(self)}
                          />
                          <DialogPrimitive.Close asChild>
                            <Button
                              variant="icon-ghost"
                              aria-label="Close"
                              icon={
                                <X aria-hidden="true" className="size-full" />
                              }
                              className="absolute top-0 left-[calc(100%+20px)]"
                            />
                          </DialogPrimitive.Close>
                        </div>
                      </DialogPrimitive.Content>
                    </div>
                  </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
                {(self.id === selectedSelfId || self.id === hoveredSelfId) &&
                  openSlotId !== slot.id && (
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
          슬롯별 labelDx/labelDy(420×420 프레임 중심 기준, SELF_SLOTS에서
          공식으로 계산됨)로 배치한다. 북/남을 뺀 6방향은 셀렉트가 카드와
          가로로 이어지는 배치라, 박스 중심이 아니라 "텍스트가 있는 쪽"
          단변(카드와 마주보는 변)을 그 지점에 앵커한다 — 텍스트 길이에 따라
          박스 너비가 달라져도 카드-셀렉트 간격은 항상 10px로 고정된다.
          북/남은 카드-라벨 방향이 세로라 셀렉트의 좌/우 단변과 맞물리지
          않으므로 기존처럼 박스 중심을 앵커한다. */}
      {SELF_SLOTS.map((slot) => {
        const self = selfBySlot.get(slot.id);
        if (!self) return null;

        const actions = getSelfMenuActions(self);
        // 서쪽 계열(dx<0)은 "< label", 그 외는 "label >" — Figma 확정 (node `8004:7989`).
        const isReversed = slot.dx < 0;
        const isVertical = slot.id === "north" || slot.id === "south";
        const horizontalAnchor = isVertical
          ? "-50%"
          : isReversed
            ? "-100%"
            : "0%";

        return (
          <div
            key={`${slot.id}-label`}
            style={{
              transform: `translate(${horizontalAnchor}, -50%) translate(${slot.labelDx}px, ${slot.labelDy}px)`,
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

      {focusedEmptySlotId ? (
        <p className="text-sm-medium absolute top-[calc(50%-10px)] left-1/2 -translate-x-1/2 text-center text-[var(--gb-text-default)]">
          Create a Self
        </p>
      ) : selves.length === 0 ? (
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
