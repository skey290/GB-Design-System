"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { PartInput } from "@/components/ui/part-input";

/**
 * Figma에는 `time` 타입만 있어 `type` prop이 없다 — "Time to post" 라벨 +
 * HH:MM 마스크 입력 + AM/PM 토글 단일 목적 컴포넌트다.
 *
 * `Status`는 `default`/`active`/`filled`/`disabled`/`error` 5개. `active`는
 * `PartInput`이 내장한 `:hover`+`:focus` 포커스 링으로, `filled`는 값이 들어오면
 * 자동으로 만족되므로 둘 다 prop이 아니다. 값이 없으면 네이티브 `placeholder`로
 * 예시를 보여주고, 포커스 중 빈 자리는 `__:__` 마스크를 연한 색으로 표시한다.
 *
 * `disabled`는 base `PartInput`의 disabled 스타일을 물려받고, AM/PM `PeriodToggle`은
 * disabled 전용 스타일로 별도 분기한다(선택된 항목이 진한 필이 아니라 평문).
 *
 * 에러 색은 `--gb-destructive`가 아니라 더 옅은 `--gb-border-warning`/
 * `--gb-text-warning`이다.
 *
 * `showDelete`(Figma 프로퍼티명 `propDelete`)가 true면 행 오른쪽 끝, AM/PM 토글의
 * 형제로 삭제 버튼이 나타난다. 클릭 시 `onDelete`만 호출하고 실제 행 삭제는 부모
 * 책임이다. `disabled`와 조합되면 아이콘 색이 `--gb-text-subtlest`로 바뀌고
 * 네이티브 `disabled`로 클릭도 막는다.
 *
 * 시/분 범위 검증(시 1~12 / 분 0~59)은 입력 완료 후가 아니라 **자릿수 입력
 * 시점에 후보를 제한**하는 방식이다.
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

/** 시(1~12)/분(0~59) 중 어느 쪽이 범위를 벗어났는지 (Figma `Status=error`). */
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
   * 에러 문구는 Figma 구조상 이 컴포넌트가 아니라 `InputTime`이 행 전체
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
 * Figma `Status=active`의 빈 마스크(`__:__`)는 placeholder가 아니라 기본
 * 텍스트 색(`--gb-text-default`)이고, `Status=error`의 빈 마스크만 연한
 * `--gb-text-subtle`입니다.
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
    <PartInput
      {...props}
      ref={inputRef}
      trailingIcon={false}
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
        invalidField && "border-[var(--gb-border-warning)]",
        // 빈 마스크는 error일 때만 연한 색이고, active(포커스)에서는 기본 색이다.
        !disabled &&
          digits.length === 0 &&
          invalidField &&
          "text-[var(--gb-text-subtle)]",
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
 * PartInput basic 내부의 AM/PM 토글.
 *
 * 바깥 wrapper는 1px 보더(`--gb-border-default`) + `--gb-background-selected`
 * 배경이고, 선택된 항목은 진한 필(`--gb-background-mute` +
 * `--gb-text-static-white` + `--gb-shadow-sm`)이다.
 *
 * `disabled`에서는 바깥 보더가 `--gb-border-overlay`, 배경이
 * `--gb-background-disabled`로 바뀌고 선택 항목이 필 모양을 잃고 평문
 * `--gb-text-static-gray`가 된다. 구분선이나 미선택 항목 배경은 없다.
 *
 * AM/PM은 상호 배타적 선택지라 실제로 동작하는 radiogroup으로 구현한다.
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
        "rounded-[var(--gb-radius-scale-lg)]",
        "border-[length:var(--gb-border-1)] border-solid p-[var(--gb-spacing-0-5)]",
        // 81px/83px: Figma 확정값 — disabled만 2px 넓다.
        disabled
          ? "w-[83px] border-[var(--gb-border-overlay)] bg-[var(--gb-background-disabled)]"
          : "w-[81px] border-[var(--gb-border-default)] bg-[var(--gb-background-selected)]",
        className,
      )}
    >
      {PERIODS.map((period) => {
        const selected = period === current;

        return (
          <React.Fragment key={period}>
            <button
              type="button"
              role="radio"
              id={`${instanceId}-${period}`}
              disabled={disabled}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectPeriod(period)}
              className={cn(
                "text-sm-medium flex-1 rounded-[var(--gb-radius-scale-md)]",
                "pl-[var(--gb-spacing-2)] pr-[var(--gb-spacing-2)]",
                "pt-[var(--gb-spacing-1)] pb-[var(--gb-spacing-1)]",
                "outline-none transition-colors disabled:cursor-not-allowed",
                "focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
                disabled
                  ? "text-[var(--gb-text-static-gray)]"
                  : selected
                    ? "h-full bg-[var(--gb-background-mute)] text-[var(--gb-text-static-white)] shadow-[var(--gb-shadow-sm)]"
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

export interface InputTimeProps extends Omit<
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
  /** Figma `Status=disabled` — 시간 입력과 AM/PM 토글을
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

export function InputTime({
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
}: InputTimeProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [timeErrorField, setTimeErrorField] =
    React.useState<TimeMaskField | null>(null);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-[var(--gb-spacing-3)]",
        className,
      )}
    >
      <label
        htmlFor={inputId}
        className="text-sm-semi-bold w-full text-[var(--foreground)]"
      >
        {label}
      </label>

      <div className="flex w-full items-start gap-[var(--gb-spacing-2)]">
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
              "items-center justify-center rounded-[var(--gb-radius-scale-lg)]",
              "border-[length:var(--gb-border-1)] border-solid outline-none",
              "focus-visible:shadow-[var(--gb-shadow-focus-ring)]",
              disabled
                ? "cursor-not-allowed border-[var(--gb-border-overlay)] bg-[var(--gb-background-disabled)]"
                : "border-[var(--gb-border-default)] bg-[var(--gb-background-default)]",
            )}
          >
            <X
              aria-hidden="true"
              className={cn(
                "size-[var(--gb-spacing-4)]",
                disabled
                  ? "text-[var(--gb-text-subtlest)]"
                  : "text-[var(--gb-text-default)]",
              )}
            />
          </button>
        )}
      </div>
      {timeErrorField && (
        <p className="text-sm-medium w-full text-[var(--gb-text-warning)]">
          {TIME_MASK_ERROR_MESSAGES[timeErrorField]}
        </p>
      )}
    </div>
  );
}
