"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";

/**
 * Figma "Input phone" (node-id 3525:8236) — `status=default`/`status=active`는
 * 정식 React prop이 아니라 실제 `<input>`의 CSS 의사클래스로 자동 처리합니다
 * (active 상태의 box-shadow `0px 0px 0px 3px rgba(161,161,161,0.5)`가 기존
 * `--shadow-focus-ring` 토큰과 정확히 일치, Textarea/Select와 동일 패턴).
 * 2026-08-02 사용자 요청으로 트리거를 `:focus-visible`(키보드 탭에서만 표시)에서
 * **`:hover`+`:focus`**(마우스 오버와 클릭/포커스 모두에서 표시)로 변경했습니다
 * ("active는 호버와 클릭 모두를 의미"). 이에 따라 이전에 필요했던
 * `storybook-addon-pseudo-states`(`pseudo: { focusVisible: true }`) 우회도
 * 더 이상 필요하지 않아 스토리에서 제거했습니다 — `:focus`는 마우스 클릭에서도
 * 정상적으로 발생하므로 별도 강제 표시 없이 `userEvent.click()`만으로 실제
 * 시각 상태를 재현합니다.
 *
 * 국가코드 드롭다운은 새로 만들지 않고 기존 `Select`(`type="country-number"`)를
 * 그대로 재사용합니다.
 *
 * Figma mock의 고정 폭(320px)은 캔버스 예시 사이즈로 판단해 `w-full`로 구현했습니다
 * (Textarea/Select 선례와 동일한 근거 — 컴포넌트 자체를 고정폭으로 제약할 디자인
 * 의도로 보지 않음).
 *
 * 2026-09-27 전화번호 입력 필드를 원시 `<input>` 태그(기존 컴포넌트 재사용
 * 금지 원칙 위반)에서 공용 `Input`(`components/ui/input`)으로 교체했습니다.
 * 기존 원시 태그는 `Input`이 이미 내장한 것과 동일한 스타일(높이/보더/배경/
 * 포커스 링/disabled)을 그대로 복제하고 있었을 뿐이라 시각적 차이는 없고,
 * disabled 상태만 `Input`의 최신 Figma 값(`--background-disabled`/
 * `--border-overlay`/`--text-static-gray`)으로 자동 동기화됩니다(이전엔
 * `opacity-50`으로 흐리게 처리 — Figma "Input phone"에는 disabled variant가
 * 없어 base `Input`의 범용 disabled 스타일을 그대로 물려받는 것이 맞습니다).
 */
export interface InputPhoneProps {
  /** 필드 위에 표시할 라벨 텍스트 (Figma 상단 텍스트, 기본값 "Phone Number") */
  label?: string;
  /** 국가코드 Select에 표시할 옵션 목록 (Select의 SelectOption과 동일 형태, `code` 필수 사용) */
  countryCodeOptions: SelectOption[];
  /** 제어 컴포넌트로 사용할 때의 국가코드 값 */
  countryCode?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 국가코드 값 */
  defaultCountryCode?: string;
  /** 국가코드가 바뀔 때 호출됩니다 */
  onCountryCodeChange?: (value: string) => void;
  /** 제어 컴포넌트로 사용할 때의 전화번호 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 전화번호 값 */
  defaultValue?: string;
  /** 전화번호 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** 전화번호 입력 필드의 placeholder */
  placeholder?: string;
  /** 비활성화 여부 (Figma 디자인에는 없는 표준 인터랙션 상태, Switch/Textarea 선례) */
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function InputPhone({
  label = "Phone Number",
  countryCodeOptions,
  countryCode,
  defaultCountryCode,
  onCountryCodeChange,
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  disabled = false,
  id,
  className,
}: InputPhoneProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const isCountryCodeControlled = countryCode !== undefined;
  const [uncontrolledCountryCode, setUncontrolledCountryCode] =
    React.useState(defaultCountryCode);
  const currentCountryCode = isCountryCodeControlled
    ? countryCode
    : uncontrolledCountryCode;

  const isValueControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isValueControlled ? value : uncontrolledValue;

  const handleCountryCodeChange = (next: string) => {
    if (!isCountryCodeControlled) {
      setUncontrolledCountryCode(next);
    }
    onCountryCodeChange?.(next);
  };

  const handleValueChange = (next: string) => {
    if (!isValueControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <div
      data-slot="input-phone"
      className={cn(
        "flex w-full flex-col items-start gap-[var(--spacing-3)]",
        className,
      )}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm-semi-bold w-full text-[var(--foreground)] select-none",
            disabled && "opacity-[var(--opacity-50)]",
          )}
        >
          {label}
        </label>
      ) : null}
      <div
        data-slot="input-phone-wrapper"
        className="flex w-full items-start gap-[var(--spacing-2-5)]"
      >
        <Select
          type="country-number"
          options={countryCodeOptions}
          value={currentCountryCode}
          onValueChange={handleCountryCodeChange}
          disabled={disabled}
        />
        <Input
          id={inputId}
          type="tel"
          value={currentValue}
          disabled={disabled}
          placeholder={placeholder}
          onValueChange={handleValueChange}
          className="min-w-0 flex-1"
        />
      </div>
    </div>
  );
}
