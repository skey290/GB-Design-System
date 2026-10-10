"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { PartInput } from "@/components/ui/part-input";
import { Select, type SelectOption } from "@/components/ui/select";

/**
 * `Status`는 default/filled/disabled 3개이고 active/error는 없다.
 *
 * 포커스 상태는 prop이 아니라 `<input>`의 CSS 의사클래스로 처리한다.
 *
 * 국가코드 드롭다운은 기존 `Select`(`variant="primary"`)를 재사용하고, 전화번호
 * 필드는 공용 `PartInput`을 쓴다 — 두 박스의 disabled 스타일은 각 컴포넌트가 내장한 것을
 * 그대로 물려받는다. 라벨은 disabled에서도 흐려지지 않는다(Figma 확정).
 *
 * Figma mock의 고정 폭(320px)은 캔버스 예시 사이즈로 보고 `w-full`로 구현했다.
 */
export interface InputPhoneProps {
  /** 필드 위에 표시할 라벨 텍스트 (Figma 상단 텍스트) */
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
  /** 비활성화 여부 (Figma `Status=disabled`) */
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function InputPhone({
  label = "Where can we reach you?",
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
        "flex w-full flex-col items-start gap-[var(--gb-spacing-3)]",
        className,
      )}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm-semi-bold w-full text-[var(--gb-text-default)] select-none"
        >
          {label}
        </label>
      ) : null}
      <div
        data-slot="input-phone-wrapper"
        className="flex w-full items-start gap-[var(--gb-spacing-2-5)]"
      >
        <Select
          variant="primary"
          options={countryCodeOptions}
          value={currentCountryCode}
          onValueChange={handleCountryCodeChange}
          disabled={disabled}
          className="w-[88px]"
        />
        <PartInput
          id={inputId}
          trailingIcon={false}
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
