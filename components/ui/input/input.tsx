"use client";

import * as React from "react";
import { Plus, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Figma "Input" (node-id 520:3062) — `State=default`(520:3061)/`State=active`
 * (588:103)는 정식 Variant Component Set이 아니라(loose 심볼) React prop이
 * 아닌 CSS 의사클래스로 처리했습니다 (`active`의 box-shadow `0px 0px 0px 3px
 * rgba(161,161,161,0.5)`가 기존 `--shadow-focus-ring` 토큰과 정확히 일치).
 * 2026-08-02 사용자 요청으로 트리거를 `:focus-visible`(키보드 탭에서만 표시,
 * 마우스 클릭 시 숨겨짐)에서 **`:hover`+`:focus`**(마우스 오버와 클릭/포커스
 * 모두에서 표시)로 변경했습니다 — "active는 호버와 클릭 모두를 의미"라는
 * 명시적 요구사항. `:focus`는 마우스 클릭과 키보드 포커스 모두에서 발생하므로
 * 키보드 접근성은 그대로 유지됩니다.
 *
 * 2026-08-02 `State=disabled`(4522:7021)가 Figma에 별도 심볼로 새로 추가되어
 * 반영했습니다. opacity로 default를 흐리는 방식이 아니라 완전히 별도의
 * 불투명 스타일입니다: 배경 `--background-disabled`, 보더
 * `--border-overlay`(실선), 텍스트 `--text-static-gray`(라이트/다크 공통
 * 고정 토큰). 2026-09-27 Figma 재대조 결과 위 3개 토큰이 기존에 쓰던
 * `--muted`(배경)/`border-transparent`(보더 없음)/
 * `--color-accent-non-changeable`(텍스트)와 실제로 달라 Figma 값으로
 * 정정했습니다. Figma disabled 심볼에는 hover/focus 변형이 존재하지
 * 않으므로(항상 동일한 정적 스타일), disabled 상태에서는 `:hover`/`:focus`로
 * 인한 보더·그림자 변화가 없어야 합니다 — Tailwind v4의 `not-disabled:`
 * 변형자로 hover/focus 스타일이 disabled에는 적용되지 않도록 명시적으로
 * 차단했습니다.
 *
 * 예시 텍스트는 `defaultValue`(실제 입력값)가 아니라 네이티브 `placeholder`
 * 속성으로 전달하는 것을 전제로 설계했습니다 — 값이 비어있을 때만 보이고
 * `muted-foreground` 색이며, 포커스 즉시(`focus:placeholder:opacity-0`)
 * 사라지고 캐럿만 남습니다(기본 브라우저 동작은 타이핑을 시작해야 사라짐).
 * 실제 값이 있으면 클릭 시 placeholder 로직과 무관하게 클릭한 위치에 캐럿이
 * 놓입니다(브라우저 기본 동작).
 *
 * 2026-08-03 사용자 요청으로 "값이 비어있는 필드는 어디를 클릭해도 캐럿이
 * 항상 맨 앞(0)에 위치해야 하고, 값이 이미 있는 필드만 클릭 위치를 따라야
 * 한다"는 규칙을 `onMouseDown`에 추가했습니다. TimeMaskInput처럼 포커스
 * 시점에 controlled value를 프로그래밍적으로 바꾸는 조합 컴포넌트에서는,
 * mousedown 이후 mouseup 단계에서 브라우저가 "바뀐 새 텍스트" 기준으로
 * 원래 클릭 좌표를 재매핑해 캐럿이 엉뚱한 위치(예: 맨 끝)로 튀는 레이스
 * 컨디션이 있었습니다. 클릭 시점 값이 빈 문자열이면 `preventDefault`로
 * 브라우저의 기본 포커스/캐럿 계산 자체를 막고, 대신 직접 `focus()` +
 * `setSelectionRange(0, 0)`을 호출해 항상 0에 고정합니다. `setSelectionRange`는
 * 스펙상 `text`/`search`/`url`/`tel`/`password` 타입에서만 지원되므로(예:
 * `email` 타입에서 호출하면 `InvalidStateError`), 그 외 타입은 이 로직을
 * 건너뛰고 브라우저 기본 동작을 그대로 둡니다.
 *
 * Figma에는 label/에러 텍스트가 존재하지 않아 순수 `<input>` 박스만 구현했으며,
 * 향후 InputwithTitle 등 합성 컴포넌트가 필요로 하는 값(placeholder/type/
 * disabled/maxLength 등)은 네이티브 `<input>` 속성을 그대로 확장해 전달하는
 * 것으로 충분해 Figma에 없는 기능(error 등)을 미리 추가하지 않았습니다.
 *
 * 2026-09-29 재대조 결과, "Figma에 아이콘 없음"이라는 이전 판단은 오류였습니다.
 * `Part/Input` 컴포넌트에는 실제로 `trailingIcon`(Boolean, 기본값 true) +
 * `icon`(Instance Swap, 기본값 lucide `Plus`) 컴포넌트 프로퍼티가 정의되어
 * 있고, default/active/disabled/filled 4개 상태 전부 동일한 구조입니다. 다만
 * 이미 이 컴포넌트를 감싸는 input-basic/input-search/input-phone/input-link가
 * 전부 아이콘 없이 쓰이고 있어, Figma 기본값(true)을 그대로 따르면 기존 화면에
 * 아이콘이 일괄로 나타나는 의도치 않은 변경이 됩니다. 그래서 prop 자체는
 * 추가하되 코드 기본값은 `false`(opt-in)로 두기로 사용자와 합의했습니다.
 */
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  /** 제어 컴포넌트로 사용할 때의 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** 실제 DOM input에 접근이 필요한 조합 컴포넌트(예: TimeMaskInput)를 위한 ref.
   * React 19부터 함수 컴포넌트가 forwardRef 없이 ref를 일반 prop으로 받을 수 있습니다. */
  ref?: React.Ref<HTMLInputElement>;
  /** trailing 아이콘 표시 여부. Figma 컴포넌트 프로퍼티 기본값은 true지만,
   * 코드 기본값은 기존 화면 영향을 피하기 위해 false(opt-in)로 둡니다. */
  trailingIcon?: boolean;
  /** trailing 아이콘 컴포넌트. Figma Instance Swap 프로퍼티 기본값과 동일한
   * lucide `Plus`가 기본값입니다. `trailingIcon`이 true일 때만 렌더링됩니다. */
  icon?: LucideIcon;
}

/** `selectionStart`/`setSelectionRange`은 스펙상 이 타입들에서만 지원되고
 * (`email`/`number` 등에서 호출하면 `InvalidStateError`), 나머지 타입은
 * 호출 자체가 불가능합니다. */
const SELECTION_RANGE_SUPPORTED_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "password",
]);

export function Input({
  ref,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className,
  onMouseDown,
  trailingIcon = false,
  icon: Icon = Plus,
  ...props
}: InputProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    onMouseDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (event.button !== 0 || currentValue.length > 0) return;

    const input = event.currentTarget;
    if (!SELECTION_RANGE_SUPPORTED_TYPES.has(input.type)) return;

    event.preventDefault();
    input.focus();
    input.setSelectionRange(0, 0);
  };

  const inputElement = (
    <input
      ref={ref}
      value={currentValue}
      disabled={disabled}
      onChange={handleChange}
      onMouseDown={handleMouseDown}
      className={cn(
        // Figma: default/filled/active(값 있음)는 Text-sm/Medium, disabled만
        // Text-sm/Regular — Tailwind가 `disabled:text-sm-regular` 같은 커스텀
        // 텍스트 유틸리티 variant를 생성하지 않아 prop으로 직접 분기합니다.
        disabled ? "text-sm-regular" : "text-sm-medium",
        "w-full rounded-[var(--radius-scale-md)]",
        // 36px: Figma 컴포넌트 자체 치수 → CLAUDE.md 규칙에 따라 --scale-* 사용
        // (Button.tsx의 h-[calc(var(--scale-36)*1px)]와 동일한 관례).
        "h-[calc(var(--scale-36)*1px)]",
        "border-[length:var(--border-1)] border-solid border-[var(--border)]",
        "bg-[var(--background)] text-[var(--foreground)]",
        // trailing 아이콘이 있으면 텍스트가 아이콘과 겹치지 않도록 우측 패딩을
        // 아이콘 슬롯(16px) + 여백만큼 늘립니다.
        trailingIcon
          ? "pl-[var(--spacing-3)] pr-[var(--spacing-8)]"
          : "pl-[var(--spacing-3)] pr-[var(--spacing-3)]",
        "outline-none transition-colors placeholder:text-[var(--muted-foreground)]",
        "focus:placeholder:opacity-0",
        "not-disabled:hover:border-[var(--ring)] not-disabled:hover:shadow-[var(--shadow-focus-ring)]",
        "not-disabled:focus:border-[var(--ring)] not-disabled:focus:shadow-[var(--shadow-focus-ring)]",
        "disabled:cursor-not-allowed disabled:border-[var(--border-overlay)] disabled:bg-[var(--background-disabled)] disabled:text-[var(--text-static-gray)]",
        !trailingIcon && className,
      )}
      {...props}
    />
  );

  if (!trailingIcon) {
    return inputElement;
  }

  // trailingIcon이 true인 경우에만 wrapper를 씁니다 — 기존 소비 컴포넌트
  // (input-basic/input-search/input-phone/input-link)는 전부 trailingIcon을
  // 넘기지 않으므로 DOM 구조가 이전과 동일하게 유지됩니다. wrapper를 쓸 때는
  // `className`이 input이 아니라 이 바깥 박스에 적용됩니다.
  return (
    <div className={cn("group relative", className)}>
      {inputElement}
      <Icon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 right-[var(--spacing-3)] size-[var(--spacing-4)] -translate-y-1/2 transition-colors",
          disabled
            ? "text-[var(--icon-static-gray)]"
            : "text-[var(--icon-subtle)] group-hover:text-[var(--icon-default)] group-focus-within:text-[var(--icon-default)]",
        )}
      />
    </div>
  );
}
