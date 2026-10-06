"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * Figma "Input basic" (node-id 588:108, 프레임명 "Input time") — 2026-09-27
 * 재대조 결과 이전에 존재했던 `Type=email/name/birth-time/time` 4종 중
 * **`time` 단일 타입만 남았습니다**(`email`/`name`/`birth-time`은 Figma에서
 * 완전히 삭제됨). 이에 따라 `type` prop 자체를 제거하고, 이 컴포넌트를
 * "Time to post" 라벨 + HH:MM 마스크 입력 + AM/PM 토글 단일 목적
 * 컴포넌트로 축소했습니다. 폴더/파일명(`input-basic`)은 임의 구조 변경
 * 금지 원칙에 따라 그대로 유지합니다.
 *
 * `Status`는 이제 `default`/`active`/`filled`/`disabled`/`error` 5개입니다.
 * `active`(포커스)는 기존과 동일하게 prop이 아니라 `Input`이 내장한
 * `:hover`+`:focus` 포커스 링으로 처리됩니다. `filled`(실제 값이 입력된 뒤
 * `text-default` 진한 텍스트)은 별도 prop 없이 자동으로 만족됩니다 — 값이
 * 없을 때는 네이티브 `placeholder`(`muted-foreground`)로 "11:00" 예시를
 * 보여주고, 포커스 중 빈 자리는 `__:__` 마스크를 `muted-foreground`로,
 * 실제 숫자가 하나라도 입력되면 `Input`의 기본 텍스트 색(`--foreground` =
 * `--text-default`)으로 표시되므로 Figma의 default(연한 예시)/filled(진한
 * 실제값) 구분과 정확히 일치합니다.
 *
 * `disabled`(신규 추가, node-id 4927:7332)는 base `Input`이 이미 내장한
 * disabled 스타일(`--background-disabled`/`--border-overlay`/
 * `--text-static-gray`)을 그대로 물려받아 정확히 일치합니다. AM/PM
 * `PeriodToggle`도 disabled 전용 스타일(테두리 `--border-overlay`, 선택된
 * 항목이 더 이상 진한 필(pill)이 아니라 평문 `--text-static-gray`, 구분선 +
 * 미선택 항목 `--background-selected` 패널)로 별도 분기했습니다.
 *
 * 2026-09-27 재대조로 `PeriodToggle`의 실제 픽셀 값도 함께 바로잡았습니다
 * (이전엔 Figma에 정적 심볼 1개뿐이라 추론한 값이었음, 이번엔 실제
 * `Status`별 5개 심볼을 모두 조회해 확정): 바깥 wrapper에 원래 없던 1px
 * 보더(`--border-default`)를 추가했고, 배경을 `--muted`(`--background-subtler`,
 * 다크모드에서 값이 달라 부정확)에서 Figma가 실제로 쓰는 `--accent`
 * (`--background-selected`)로 교체했습니다. 선택된 항목은 밝은 배경+보더가
 * 아니라 **진한 필**(`--background-static-gray` 배경 + `--text-static-white`
 * 텍스트 + `--shadow-sm`)이 맞았습니다. 에러 상태 색도 이번에 처음
 * 명확해졌습니다 — 기존에 임의로 재사용하던 `--destructive`(#dc2626)가 아니라
 * Figma가 명시한 더 옅은 `--border-warning`/`--text-warning`(#f87171)이
 * 정답이라 교체했습니다.
 *
 * `propDelete`(2026-09-27 추가 구현) — Figma `get_design_context` 원본에서
 * `propDelete && (isTimeAndIsDefaultOrFilledOrActiveOrError || isTimeAndDisabled)`
 * 조건으로 렌더링되는, 두 개의 `hidden="true"` nested 인스턴스(`7329:4687`
 * 활성용/`7329:4675` disabled용, `get_metadata`로 확인 — 기본 false라 5개
 * 최상위 심볼 어디에도 보이지 않았던 숨은 조건부 요소)로만 존재했습니다.
 * 위치는 행 오른쪽 끝, AM/PM 토글의 형제(같은 flex row, 동일 gap)입니다.
 * data-name은 "lucide/circle-dashed"로 오기재되어 있었으나, 실제 내부 SVG를
 * 다운로드해 대조한 결과 두 인스턴스 모두 `lucide/x`(X자 아이콘)였습니다 —
 * 2026-10-02 기준 `lucide-react`의 `X` 컴포넌트를 직접 사용합니다(원본이
 * 애초에 lucide 아이콘이었으므로 스프라이트를 거칠 필요가 없음).
 * `showDelete`(prop명, Figma 내부명 `propDelete`는 그대로 쓰지 않음)가 true면
 * 18×18(`--scale-18`) 원형이 아닌 `--radius-scale-lg`(10px) 라운드 사각 버튼이
 * 나타나고, 클릭 시 `onDelete` 콜백만 호출합니다(실제 행 삭제/언마운트는 부모
 * 책임). `disabled`와 조합되면 Figma가 정의한 별도 disabled 룩(배경
 * `--background-disabled`, 보더 `--border-overlay`, 아이콘 `--text-subtlest`
 * [#a3a3a3, enabled 아이콘의 `--text-default`와 다른 토큰]) 그대로 렌더링하고
 * 네이티브 `disabled` 속성으로 클릭도 막습니다 — 나머지 입력/토글과 동일하게
 * disabled가 상호작용을 완전히 무효화하는 기존 규칙을 그대로 따릅니다.
 *
 * (이전 히스토리) 2026-08-03: 예시값을 HH:MM으로 통일, 캐럿 위치 계산,
 * 빈 값 클릭 시 캐럿 항상 맨 앞, 범위 검증(시 1~12/분 0~59)을 자릿수
 * 입력 시점에 제한하는 방식으로 구현한 세부 내용은 그대로 유지됩니다.
 */
export type TimePeriod = "AM" | "PM";

const TIME_LABEL = "Time to post";
const TIME_PLACEHOLDER = "11:00";

const PERIODS: TimePeriod[] = ["AM", "PM"];

const TIME_MASK_MAX_DIGITS = 4;

function extractTimeDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, TIME_MASK_MAX_DIGITS);
}

function formatTimeMask(digits: string): string {
  const padded = digits.padEnd(TIME_MASK_MAX_DIGITS, "_");
  return `${padded.slice(0, 2)}:${padded.slice(2, 4)}`;
}

/** digits를 다 채우면 콜론 하나가 끼어들기 때문에, n자리를 입력한 다음 캐럿이
 * 위치해야 할 "HH:MM" 문자열 상의 인덱스 (2자리 이상부터 콜론만큼 +1). */
function caretPositionForDigitCount(digitCount: number): number {
  return digitCount + (digitCount >= 2 ? 1 : 0);
}

/** Figma "Input basic" `Status=error` (node-id 4723:1249)가 검증하는 두 필드 —
 * 시(1~12)/분(0~59) 중 어느 쪽이 범위를 벗어났는지. */
type TimeMaskField = "hours" | "minutes";

const TIME_MASK_ERROR_MESSAGES: Record<TimeMaskField, string> = {
  hours: "Hours must be between 1 and 12.",
  minutes: "Minutes must be between 0 and 59.",
};

/** shake 1회 재생 시간(`app/globals.css`의 `shake` keyframe과 동일한 값)과,
 * 사용자가 이후 아무 입력도 하지 않을 때 에러 보더/문구를 자동으로 지우기까지의
 * 대기 시간. */
const SHAKE_ANIMATION_MS = 400;
const VALIDATION_ERROR_AUTO_DISMISS_MS = 2000;
const SHAKE_ANIMATION_CLASS = "animate-[shake_0.4s_ease-in-out]";

/** `position`(0=시 십의 자리, 1=시 일의 자리, 2=분 십의 자리, 3=분 일의 자리)에
 * `digit`이 들어갈 수 있는지 — 시는 1~12, 분은 0~59 범위만 허용합니다.
 * `digitsBefore`는 이미 확정된 이전 자리 숫자들(이 자리를 판단하는 데 필요한
 * 건 시 일의 자리를 판단할 때의 시 십의 자리뿐입니다). */
function isDigitAllowedAtPosition(
  digitsBefore: string,
  position: number,
  digit: string,
): boolean {
  if (position === 0) return digit === "0" || digit === "1";
  if (position === 1) {
    return digitsBefore[0] === "0"
      ? digit >= "1" && digit <= "9"
      : digit >= "0" && digit <= "2";
  }
  if (position === 2) return digit >= "0" && digit <= "5";
  return true; // position 3: 분 일의 자리는 0~9 전부 허용
}

interface TimeMaskInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "id"
> {
  id: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 시/분 범위를 벗어난 입력이 거부되어 에러 상태가 바뀔 때 호출됩니다.
   * 에러 문구는 Figma 구조상 이 컴포넌트가 아니라 `InputBasic`이 행 전체
   * 아래 full-width로 렌더링하므로, 상태만 위로 전달합니다. */
  onValidationErrorChange?: (field: TimeMaskField | null) => void;
}

/**
 * HH:MM 숫자 마스크. Figma 예시값(`11:00`)은 정적 텍스트일 뿐 실제 입력
 * 인터랙션을 표현하지 않아, 빈 자리를 `_`로 보여주고 숫자만 좌측부터 채우는
 * 동작은 별도로 설계했습니다. Backspace는 마지막으로 채워진 자리 하나만
 * 지우도록 가로채고(그렇지 않으면 끝의 `_`/`:`를 지우는 것처럼 보여 실제
 * 숫자가 안 지워짐), 그 외 타이핑/붙여넣기는 `onChange` 값에서 숫자만
 * 추출해 반영합니다. 가운데 자리를 캐럿으로 골라 수정하는 것은 지원하지
 * 않는 단순 모델입니다 — 4자리뿐인 짧은 값이라 이 정도로 충분하다고
 * 판단했습니다.
 *
 * default(비포커스 + 빈 값) 상태에서는 `__:__` 마스크 대신 네이티브
 * placeholder(예시 시간)를 보여주고, 포커스해야 마스크로 전환됩니다. 이미
 * 입력된 값이 있으면 포커스 여부와 무관하게 계속 마스크로 표시됩니다.
 * 포커스된 채로 아직 숫자가 하나도 없는 마스크(`__:__`)는 Figma
 * `Status=active`가 보여주는 대로 `muted-foreground`로 표시하고, 숫자가
 * 하나라도 채워지면(Figma `Status=filled`) 기본 텍스트 색으로 전환됩니다.
 *
 * 매 입력마다 전체 문자열을 새로 만들어 `value`를 통째로 교체하면 브라우저가
 * 원래 caret 위치를 잃고 문자열 끝으로 되돌리기 때문에, digits 개수로 "다음
 * 숫자가 들어갈 자리"를 계산해 `setSelectionRange`로 명시적으로 캐럿을
 * 위치시킵니다.
 */
function TimeMaskInput({
  value,
  defaultValue = "",
  onValueChange,
  onValidationErrorChange,
  disabled,
  className,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: TimeMaskInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [invalidField, setInvalidField] = React.useState<TimeMaskField | null>(
    null,
  );
  const shakeTimeoutRef = React.useRef<number | undefined>(undefined);
  const dismissTimeoutRef = React.useRef<number | undefined>(undefined);
  const isControlled = value !== undefined;
  const [uncontrolledDigits, setUncontrolledDigits] = React.useState(() =>
    extractTimeDigits(defaultValue),
  );
  const digits = isControlled ? extractTimeDigits(value) : uncontrolledDigits;
  const showMask = isFocused || digits.length > 0;

  const commit = (nextDigits: string) => {
    if (!isControlled) {
      setUncontrolledDigits(nextDigits);
    }
    onValueChange?.(formatTimeMask(nextDigits));
  };

  const setValidationField = (field: TimeMaskField | null) => {
    setInvalidField(field);
    onValidationErrorChange?.(field);
  };

  const clearValidationError = () => {
    if (dismissTimeoutRef.current !== undefined) {
      window.clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = undefined;
    }
    setValidationField(null);
  };

  const triggerShake = () => {
    const input = inputRef.current;
    if (!input) return;
    if (shakeTimeoutRef.current !== undefined) {
      window.clearTimeout(shakeTimeoutRef.current);
    }
    input.classList.remove(SHAKE_ANIMATION_CLASS);
    // 이미 재생 중인 shake를 처음부터 다시 재생하려면 클래스를 제거한 뒤
    // 강제로 reflow를 발생시켜야 브라우저가 애니메이션을 재시작합니다.
    void input.offsetWidth;
    input.classList.add(SHAKE_ANIMATION_CLASS);
    shakeTimeoutRef.current = window.setTimeout(() => {
      input.classList.remove(SHAKE_ANIMATION_CLASS);
    }, SHAKE_ANIMATION_MS);
  };

  React.useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current !== undefined) {
        window.clearTimeout(shakeTimeoutRef.current);
      }
      if (dismissTimeoutRef.current !== undefined) {
        window.clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, []);

  const handleTimeValueChange = (next: string) => {
    const incoming = extractTimeDigits(next);
    let nextDigits = digits;
    let rejectedField: TimeMaskField | null = null;

    for (let i = digits.length; i < incoming.length; i++) {
      const char = incoming[i];
      if (isDigitAllowedAtPosition(nextDigits, i, char)) {
        nextDigits += char;
      } else {
        rejectedField = i < 2 ? "hours" : "minutes";
        break;
      }
    }

    if (nextDigits !== digits) {
      commit(nextDigits);
    }

    if (rejectedField) {
      setValidationField(rejectedField);
      triggerShake();
      if (dismissTimeoutRef.current !== undefined) {
        window.clearTimeout(dismissTimeoutRef.current);
      }
      dismissTimeoutRef.current = window.setTimeout(() => {
        clearValidationError();
      }, VALIDATION_ERROR_AUTO_DISMISS_MS);
    } else if (invalidField) {
      clearValidationError();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") return;
    event.preventDefault();
    if (invalidField) {
      clearValidationError();
    }
    commit(digits.slice(0, -1));
  };

  React.useLayoutEffect(() => {
    if (!showMask) return;
    const pos = caretPositionForDigitCount(digits.length);
    inputRef.current?.setSelectionRange(pos, pos);
  }, [digits, showMask]);

  return (
    <Input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      disabled={disabled}
      value={showMask ? formatTimeMask(digits) : ""}
      placeholder={placeholder}
      onValueChange={handleTimeValueChange}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        clearValidationError();
        onBlur?.(event);
      }}
      className={cn(
        invalidField && "border-[var(--border-warning)]",
        !disabled && digits.length === 0 && "text-[var(--muted-foreground)]",
        className,
      )}
    />
  );
}

interface PeriodToggleProps {
  value?: TimePeriod;
  defaultValue?: TimePeriod;
  onValueChange?: (period: TimePeriod) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Figma "TwoSelect" (Input basic 내부 AM/PM 토글) — 2026-09-27 `Status`별
 * 5개 심볼(default/active/filled/error/disabled)을 모두 조회해 실제 픽셀
 * 값을 확정했습니다: 바깥 wrapper는 1px 보더(`--border-default`) +
 * `--accent`(`--background-selected`) 배경이고, 선택된 항목은 진한 필
 * (`--background-static-gray` + `--text-static-white` + `--shadow-sm`)
 * 입니다. `disabled`에서는 바깥 보더가 `--border-overlay`로, 배경이
 * `--background-disabled`로 바뀌고, 선택 항목은 더 이상 필 모양이 아니라
 * 평문 `--text-static-gray`이며, 두 항목 사이에 구분선이 생기고 미선택
 * 항목엔 `--background-selected` 패널이 표시됩니다. AM/PM은 여전히
 * 명백히 상호 배타적인 라디오 선택지라 실제로 동작하는 radiogroup으로
 * 구현했습니다.
 */
function PeriodToggle({
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
}: PeriodToggleProps) {
  const instanceId = React.useId();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<TimePeriod>(
    defaultValue ?? "AM",
  );
  const current = isControlled ? value : uncontrolledValue;

  const selectPeriod = (period: TimePeriod) => {
    if (!isControlled) {
      setUncontrolledValue(period);
    }
    onValueChange?.(period);
    document.getElementById(`${instanceId}-${period}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectPeriod(current === "AM" ? "PM" : "AM");
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="AM or PM"
      aria-disabled={disabled || undefined}
      onKeyDown={disabled ? undefined : handleKeyDown}
      className={cn(
        "inline-flex shrink-0 items-center justify-center self-stretch",
        "w-[81px] rounded-[var(--radius-scale-lg)]",
        "border-[length:var(--border-1)] border-solid p-[var(--spacing-0-5)]",
        disabled
          ? "border-[var(--border-overlay)] bg-[var(--background-disabled)]"
          : "border-[var(--border-default)] bg-[var(--accent)]",
        className,
      )}
    >
      {PERIODS.map((period, index) => {
        const selected = period === current;

        return (
          <React.Fragment key={period}>
            {disabled && index === 1 ? (
              <span
                aria-hidden="true"
                className="mx-[var(--spacing-0-5)] h-[var(--spacing-4)] w-px shrink-0 bg-[var(--border-overlay)]"
              />
            ) : null}
            <button
              type="button"
              role="radio"
              id={`${instanceId}-${period}`}
              disabled={disabled}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectPeriod(period)}
              className={cn(
                "text-sm-medium flex-1 rounded-[var(--radius-scale-md)]",
                "pl-[var(--spacing-2)] pr-[var(--spacing-2)]",
                "pt-[var(--spacing-1)] pb-[var(--spacing-1)]",
                "outline-none transition-colors disabled:cursor-not-allowed",
                "focus-visible:shadow-[var(--shadow-focus-ring)]",
                disabled
                  ? selected
                    ? "text-[var(--text-static-gray)]"
                    : "bg-[var(--background-selected)] text-[var(--text-static-gray)]"
                  : selected
                    ? "h-full bg-[var(--background-static-gray)] text-[var(--text-static-white)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--foreground)]",
              )}
            >
              {period}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export interface InputBasicProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "id" | "disabled"
> {
  /** 필드 위에 표시할 라벨 텍스트 (Figma 예시: "Time to post") */
  label?: string;
  /** 제어 컴포넌트로 사용할 때의 입력 값 (HH:MM 마스크) */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 입력 값 */
  defaultValue?: string;
  /** 입력 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** AM/PM 선택값 (제어 컴포넌트) */
  period?: TimePeriod;
  /** AM/PM 선택 초기값 (비제어 컴포넌트) */
  defaultPeriod?: TimePeriod;
  /** AM/PM 선택값이 바뀔 때 호출됩니다 */
  onPeriodChange?: (period: TimePeriod) => void;
  /** Figma `Status=disabled` (node-id 4927:7332) — 시간 입력과 AM/PM 토글을
   * 함께 비활성화합니다 */
  disabled?: boolean;
  /** Figma `propDelete` (기본 false) — 행 우측 끝에 원형 X 삭제 버튼을
   * 표시합니다. `default`/`filled`/`active`/`error`/`disabled` 모든 Status
   * 조합에 존재합니다 */
  showDelete?: boolean;
  /** 삭제 버튼 클릭 시 호출됩니다. 실제 필드 제거/언마운트는 호출한 쪽의
   * 책임입니다(이 컴포넌트는 자기 자신을 제거하지 않습니다) */
  onDelete?: () => void;
  /** 라벨과 연결할 입력 필드 id. 생략하면 자동 생성됩니다 */
  id?: string;
  className?: string;
}

export function InputBasic({
  label = TIME_LABEL,
  value,
  defaultValue = "",
  onValueChange,
  period,
  defaultPeriod,
  onPeriodChange,
  disabled,
  showDelete = false,
  onDelete,
  placeholder,
  id,
  className,
  ...props
}: InputBasicProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [timeErrorField, setTimeErrorField] =
    React.useState<TimeMaskField | null>(null);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-[var(--spacing-3)]",
        className,
      )}
    >
      <label
        htmlFor={inputId}
        className="text-sm-semi-bold w-full text-[var(--foreground)]"
      >
        {label}
      </label>

      <div className="flex w-full items-start gap-[var(--spacing-2)]">
        <TimeMaskInput
          {...props}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          onValidationErrorChange={setTimeErrorField}
          disabled={disabled}
          placeholder={placeholder ?? TIME_PLACEHOLDER}
          className="flex-1"
        />
        <PeriodToggle
          value={period}
          defaultValue={defaultPeriod}
          onValueChange={onPeriodChange}
          disabled={disabled}
        />
        {showDelete && (
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            aria-label="Delete"
            className={cn(
              "flex size-[18px] shrink-0 self-center",
              "items-center justify-center rounded-[var(--radius-scale-lg)]",
              "border-[length:var(--border-1)] border-solid outline-none",
              "focus-visible:shadow-[var(--shadow-focus-ring)]",
              disabled
                ? "cursor-not-allowed border-[var(--border-overlay)] bg-[var(--background-disabled)]"
                : "border-[var(--border-default)] bg-[var(--background-default)]",
            )}
          >
            <X
              aria-hidden="true"
              className={cn(
                "size-[var(--spacing-4)]",
                disabled
                  ? "text-[var(--text-subtlest)]"
                  : "text-[var(--text-default)]",
              )}
            />
          </button>
        )}
      </div>
      {timeErrorField && (
        <p className="text-sm-medium w-full text-[var(--text-warning)]">
          {TIME_MASK_ERROR_MESSAGES[timeErrorField]}
        </p>
      )}
    </div>
  );
}
