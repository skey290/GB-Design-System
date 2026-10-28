import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

import styles from "./compass-dial-tick.module.css";

/**
 * Figma "Part/Dial" (📌 GB_UXUI, Wp6AZNGqC4qf2Sz5zQ2PzQ) node-id 8125:22862
 * (variant 전체를 모아둔 컴포넌트 프레임).
 *
 * 컴퍼스 다이얼 원형에 80개 반복 배치될 "눈금 1개" 단위 원자 컴포넌트. 반복 배치
 * (각도 회전 + 위치 계산)는 이 컴포넌트의 책임이 아니라 상위 "Dial" 조립 컴포넌트의
 * 몫이며, 이 파일은 로컬 4×117px 박스 안에서 눈금선 + (있다면) 라벨 하나만 그린다.
 *
 * Figma variant → props 매핑:
 * - `type`: default(눈금선만) / text(숫자 라벨) / circle(Badge 마커)
 * - `direction`: outward(박스 하단에 정렬) / inward(박스 상단에 정렬) — 두
 *   방향 모두 DOM 순서는 라벨→눈금으로 동일(라벨이 항상 중심에서 먼 쪽에
 *   옴). `direction`이 바꾸는 건 박스 자체의 반지름 위치(앵커)와 정렬 기준
 *   (justify-end/start)뿐.
 * - `muted`: 라벨/Badge 스타일만 다운그레이드(눈금선 색상엔 영향 없음 — 항상
 *   `--border-static-white` 고정)
 * - `textArrangement`: 라벨 회전 방향. 아래 ROTATION 테이블 참고
 * - `size`: 눈금선 길이(1~5). 라벨에는 영향 없음
 *
 * ⚠️ textArrangement × direction 회전각은 단순 공식으로 일반화되지 않아
 * text/circle 각 8개 조합을 실측해 테이블로 고정했다(아래 TEXT_TRANSFORM/
 * CIRCLE_TRANSFORM 참고, 둘 다 순수 회전만 — 상세 검증 근거는 각 테이블
 * 주석 참고).
 *
 * `coachmark`: Reach/Engagement 온보딩 코치마크("Most Reached: 8,340"/
 * "Most Engaged: 14.3%")는 항상 북쪽 눈금(슬롯0)의 라벨 칩에 붙는다.
 * `buildRingPlan`의 `isNorth` 규칙이 이미 이 칩을 `type="circle"`로 고정해
 * 렌더링하므로, 이 prop이 있으면 그 라벨(text/circle 공통)을 `Tooltip`
 * (`variant="reversed"`, 항상 열림)으로 감싸기만 하면 된다.
 */

export type CompassDialTickType = "default" | "text" | "circle";
export type CompassDialTickDirection = "outward" | "inward";
export type CompassDialTickTextArrangement =
  "cross" | "parallel" | "parallel-reverse" | "cross-reverse";
export type CompassDialTickSize = 1 | 2 | 3 | 4 | 5;

export interface CompassDialTickProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** 눈금 종류 — default: 눈금선만 / text: 숫자 라벨 / circle: Badge 마커 */
  type?: CompassDialTickType;
  /** 눈금이 다이얼 중심 기준 바깥/안쪽 중 어디를 향하는지 */
  direction?: CompassDialTickDirection;
  /** 라벨/Badge 스타일을 한 단계 낮춤(눈금선 색상엔 영향 없음) */
  muted?: boolean;
  /** 라벨 회전 방향(원형 다이얼에서 항상 똑바로 보이도록). type="default"일 땐 무시됨 */
  textArrangement?: CompassDialTickTextArrangement;
  /** 눈금선 길이 단계(1~5). 라벨에는 영향 없음 */
  size?: CompassDialTickSize;
  /**
   * type="text"|"circle"일 때 표시할 값. Figma 샘플("6/1", "Badge")은
   * 플레이스홀더이므로 기본값으로 두지 않음 — 필요 시 호출부에서 명시할 것.
   */
  label?: string;
  /**
   * 라벨(있는 경우)에 붙는 온보딩 코치마크. 전달되면 `Tooltip`(`variant="reversed"`)을
   * 항상 열린 상태로 씌운다. `onDismiss`가 있으면 닫기(X) 버튼이 함께 렌더링됨.
   */
  coachmark?: {
    title: string;
    description?: string;
    onDismiss?: () => void;
  };
}

/**
 * 눈금선 실측값(px) — Figma "Part/Dial" 눈금 벡터를 size별로 직접 다운로드해
 * path 좌표를 역산했다. SVG 내부 기하 좌표라 spacing 토큰과 매칭되지 않아
 * 토큰화하지 않고 컴포넌트 내부 상수로 고정.
 * upper: 라벨에서 먼 긴 segment(SVG 로컬 y=total쪽), gap: 중간 공백,
 * lower: 라벨에 인접한 짧은 segment(SVG 로컬 y=0쪽). direction과 무관하게
 * 항상 이 방향(라벨 인접=짧은 쪽) — outward/inward 모두 라벨이 항상 눈금의
 * local y=0쪽에 온다.
 */
const TICK_GEOMETRY: Record<
  CompassDialTickSize,
  { total: number; upper: number; gap: number; lower: number }
> = {
  5: { total: 80, upper: 52.14, gap: 10.95, lower: 16.91 },
  4: { total: 65, upper: 42.36, gap: 8.9, lower: 13.74 },
  3: { total: 50, upper: 23.25, gap: 10.51, lower: 16.24 },
  2: { total: 35, upper: 16.27, gap: 7.36, lower: 11.37 },
  1: { total: 20, upper: 9.3, gap: 4.21, lower: 6.5 },
};

/**
 * 루트 컨테이너 너비(px) — Figma 프레임 자체의 물리적 치수인 기하 상수.
 * 높이(117px)는 className의 `h-[117px]`에 직접 사용.
 */
const ROOT_WIDTH = 4;

/**
 * type="text" 라벨에 적용할 CSS transform(순수 회전만).
 *
 * ⚠️ "Part/Dial" 단독 컴포넌트를 variant 갤러리 시트에서 스크린샷으로 보면
 * inward 4개 조합이 `rotate()`로 표현 불가능한 거울상(mirror)처럼 보이지만,
 * 이건 그 갤러리 시트 자체의 배치 아티팩트다 — 실제 조립된 "Dial"
 * 컴포넌트(각도별로 80개 눈금을 회전 배치한 원형 게이지)를 스크린샷으로
 * 보면 모든 라벨이 거울상 없이 정상적으로 똑바로 읽힌다. 따라서 거울 축은
 * 추가하지 않고, 순수 회전값만 사용한다. 검증: Figma "Dial"(Type=engagement)
 * 전체 스크린샷에서 8개 라벨(14.3%/1.8%/1.9%/0.5%/0.4%/2.0%/0.3%/3.7%)
 * 전부 미러 없이 똑바로 읽힘을 직접 확인.
 */
const TEXT_TRANSFORM: Record<
  CompassDialTickDirection,
  Record<CompassDialTickTextArrangement, string>
> = {
  outward: {
    cross: "rotate(0deg)",
    "cross-reverse": "rotate(180deg)",
    parallel: "rotate(-90deg)",
    "parallel-reverse": "rotate(90deg)",
  },
  inward: {
    cross: "rotate(180deg)",
    "cross-reverse": "rotate(0deg)",
    parallel: "rotate(-90deg)",
    "parallel-reverse": "rotate(90deg)",
  },
};

/**
 * type="circle"(Badge)에 적용할 CSS transform(순수 회전만).
 *
 * `inward`+`cross-reverse`(북쪽 사분면)만 예외: Figma raw 값을 그대로 옮기면
 * `rotate(180deg) scaleY(-1)`이 합성되어 배지 안 텍스트가 좌우로 뒤집혀
 * 보인다. 같은 위치의 `text` 라벨(`TEXT_TRANSFORM.inward["cross-reverse"]`)은
 * 회전 0으로 정상 표시되므로, circle도 동일하게 `rotate(0deg)`로 맞춰
 * 반전을 제거함. 나머지 7개는 TEXT_TRANSFORM과 동일한 "순수 회전만" 원칙 —
 * 위 주석의 조립된 Dial 검증 근거도 동일하게 적용된다.
 */
const CIRCLE_TRANSFORM: Record<
  CompassDialTickDirection,
  Record<CompassDialTickTextArrangement, string>
> = {
  outward: {
    cross: "rotate(0deg)",
    "cross-reverse": "rotate(180deg)",
    parallel: "rotate(-90deg)",
    "parallel-reverse": "rotate(90deg)",
  },
  inward: {
    cross: "rotate(0deg)",
    "cross-reverse": "rotate(0deg)",
    parallel: "rotate(90deg)",
    "parallel-reverse": "rotate(-90deg)",
  },
};

function DialTickMark({ size }: { size: CompassDialTickSize }) {
  const { total, upper, gap } = TICK_GEOMETRY[size];
  const pointB = total - upper;
  const pointC = total - upper - gap;

  return (
    <svg
      width={ROOT_WIDTH}
      height={total}
      viewBox={`0 0 ${ROOT_WIDTH} ${total}`}
      fill="none"
      className={styles.tickMark}
      aria-hidden="true"
      data-slot="compass-dial-tick-mark"
    >
      <path
        d={`M2 ${total}L2 ${pointB}M2 ${pointC}L2 0`}
        stroke="var(--gb-border-static-white)"
        strokeWidth={1}
      />
    </svg>
  );
}

export function CompassDialTick({
  type = "default",
  direction = "outward",
  muted = false,
  textArrangement = "cross",
  size = 5,
  label,
  coachmark,
  className,
  ...props
}: CompassDialTickProps) {
  const hasLabel = type === "text" || type === "circle";
  const isOutward = direction === "outward";

  const wrapWithCoachmark = (node: React.ReactNode) =>
    coachmark ? (
      <Tooltip
        variant="reversed"
        open
        side="right"
        align="start"
        title={coachmark.title}
        description={coachmark.description}
        onClose={coachmark.onDismiss}
      >
        {node}
      </Tooltip>
    ) : (
      node
    );

  // outward: 라벨이 눈금과 같은 flex 흐름 안에 있어 박스(117px) 하단에
  // [라벨, gap(--spacing-4=16px), 눈금]이 쌓인다(둘 합쳐 박스 높이에 거의
  // 딱 맞음, 검증 완료).
  // inward: 눈금만 박스 흐름에 남고(장식용 눈금과 동일하게 박스 상단=rim에
  // 고정), 라벨은 `position: absolute`로 박스 바깥(rim보다 더 바깥)에
  // 띄운다 — Figma 북쪽 눈금 실측에서 Badge가 장식용 눈금들의 바깥쪽 끝이
  // 이루는 공통 경계선보다 명확히 더 바깥에 떠 있고, 눈금 자체 길이는 다른
  // size5 눈금과 동일함을 확인했다. 라벨-눈금 간 gap은 Figma "Part/Dial"
  // 원자 컴포넌트(node 8125:22891)를 직접 실측해 8px(`--gb-spacing-2`,
  // outward의 절반)로 확정 — outward와 다른 값이라 `gapClass`로 공유하지
  // 않고 라벨 쪽에 `mb-`로 직접 지정.
  const labelNode =
    type === "text"
      ? wrapWithCoachmark(
          <div
            className={cn(styles.labelWrap, styles.textLabelWrap)}
            data-direction={direction}
          >
            <p
              className={styles.textLabel}
              data-muted={muted || undefined}
              style={{
                transform: TEXT_TRANSFORM[direction][textArrangement],
              }}
            >
              {label}
            </p>
          </div>,
        )
      : type === "circle"
        ? wrapWithCoachmark(
            <div className={styles.labelWrap} data-direction={direction}>
              <div
                style={{
                  transform: CIRCLE_TRANSFORM[direction][textArrangement],
                }}
              >
                <Badge variant={muted ? "outline" : "default"} size="20">
                  {label}
                </Badge>
              </div>
            </div>,
          )
        : null;

  const tickNode = (
    <div className={styles.tickWrap}>
      <DialTickMark size={size} />
    </div>
  );

  return (
    <div
      className={cn(styles.root, className)}
      data-direction={direction}
      data-has-label={hasLabel || undefined}
      {...props}
    >
      {isOutward && labelNode}
      {tickNode}
      {!isOutward && labelNode}
    </div>
  );
}
