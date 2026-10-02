"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/ui/chips";

/**
 * Figma "Chatbox" — 새 소스오브트루스 파일(`G9YNa2vjdqDjnML9y5hXJ4`, ❄️
 * GB_Design-System — Atom), node-id `7219:5418`. `Style`(default/image/chip/
 * sentence option, 4종) × `Status`(default/filled/disabled/active, 4종) =
 * 16개 심볼 전수 조사 후 구현 (2026-09-27, 이전 파일 `PrsHuyyra9LzqqrDwmrB5P`
 * node `3844:4238` 기준 구현을 대체).
 *
 * ⚠️ `Style`은 DOM 표준 `style` prop과 이름이 충돌해 React prop명을
 * **`variant`**로 사용합니다.
 *
 * ⚠️ "항상 다크" 원칙 유지(2026-08-02 최초 확정, 이번 파일 재확인): 사이트
 * 라이트/다크 테마와 무관하게 Chatbox는 항상 다크로 렌더링합니다. 이전
 * 구현은 고정 primitive 토큰(`--color-neutral-950` 등)을 직접 박아넣었지만,
 * 이번 새 파일은 값 자체가 (라이트/다크 모드별 값을 갖는) 신규 무접두사
 * 시맨틱 토큰(`--background-default`, `--border-default`, `--text-subtle` 등,
 * `app/globals.css`의 `.dark` 클래스 선택자로 재정의됨)으로 구성되어 있어,
 * 루트 컨테이너에 **`dark` 클래스를 강제로 부여**해 하위 전체가 시맨틱
 * 토큰의 다크 값으로 resolve되게 구현했습니다. `.dark`는 `:root.dark`가
 * 아니라 일반 클래스 선택자라 이 방식이 동작하며, `Button`(`variant="icon"`)
 * 이 내부적으로 쓰는 `bg-background`/`border-border`/`text-foreground`/
 * `disabled:text-muted`도 전부 이 스코프 안에서 자동으로 다크 값을
 * 사용하게 되어 별도 색상 오버라이드 없이 Figma와 정확히 일치합니다
 * (`get_variable_defs`로 실측: 기본 상태 --background-default #0a0a0a,
 * --border-default #404040, --icon-default #fafafa / disabled 상태
 * --background-disabled #404040, --border-overlay #262626, 아이콘 색은
 * `--muted`→`--background-subtler`의 다크 값 #262626으로 Figma의
 * `--icon-fainter` 다크 값과 정확히 일치).
 *
 * ⚠️ 예외 — 이미지 첨부 썸네일의 삭제(X) 배지만은 컴포넌트 전체가
 * 다크여도 **항상 밝은(흰색) 배지로 고정**됩니다(스크린샷으로 실측 확인,
 * `get_variable_defs`는 이 중첩 인스턴스에 대해 신뢰할 수 없는 가짜 다크
 * 값을 반환해 스크린샷 교차검증이 필요했습니다). 그래서 이 배지만
 * `dark` 스코프의 영향을 받지 않도록 라이트 고정 primitive
 * (`--color-white`/`--color-neutral-200`/`--color-neutral-950`)를 직접
 * 사용합니다 — "하드코딩 금지" 규칙 위반이 아니라 Figma가 명시한 라이트
 * 고정 예외를 표현하기 위한 의도적 토큰 선택입니다. disabled 상태에서
 * 배지 자체의 색 변화까지는 `get_variable_defs`/스크린샷 모두 신뢰도 있게
 * 확인하지 못해(항상 다크로 잘못 보고됨), 배지 색은 상태와 무관하게
 * 동일하게 유지하고 전체 컨테이너의 `opacity-50`로만 disabled를
 * 표현했습니다 (⚠️ FLAG — 필요시 재확인 권장).
 *
 * `Style=chip`(전체/이미지/텍스트 필터 3개 pill)은 기존
 * `components/ui/chips/chips.tsx`(`variant="secondary"`)를 그대로
 * 재사용합니다 — 선택/미선택/disabled 색이 전부 `get_variable_defs` 실측과
 * 정확히 일치함을 확인했습니다(선택: `--background-static-gray`/
 * `--text-static-white`, 미선택: `--background-surface-secondary`/
 * `--text-default`, disabled: `--background-bold`(다크값 #e5e5e5로 alias된
 * `--primary`)/`--text-subtle`(다크값 #a3a3a3로 alias된
 * `--muted-foreground`) + opacity-70). 라벨 3개(All/Image/Text)와 선택
 * 인덱스는 고정이며, 클릭 시 내부 상태(비제어) 또는 `selectedChip`
 * prop(제어)로 전환됩니다(2026-09-27 사용자 확정).
 *
 * `Style=sentence option`(3행 리스트, 우측 chevron)은 매칭되는 기존
 * 컴포넌트가 없어 새로 구현했습니다. 라벨 3개("I would like to change Asset
 * Image"/"...Short Text (One Liner)"/"...Long Text (Description)")와 선택
 * 인덱스는 고정이며, chip과 동일한 제어/비제어 패턴을 따릅니다(2026-09-27
 * 사용자 확정). 선택된 행만 `--background-static-gray`+`--text-static-white`,
 * 아이콘은 기존 스프라이트의 `chevron-right-icon`을 재사용합니다.
 *
 * 첨부/전송 버튼은 이번에 동일하게 `variant="icon"`(테두리 있는 36px
 * 정사각형)으로 통일했습니다(기존 첨부 버튼은 `variant="ghost"`였음,
 * Figma 기준 두 버튼 모양이 동일). 전송 버튼 아이콘은 `arrow-right-icon`
 * 대신 신규 추가한 `sparkles-icon`(lucide `sparkles` 형태를 `/icons.svg`에
 * 새로 추가, 기존 스프라이트에 없었음)을 사용합니다. `onSend` 콜백명은
 * 변경하지 않았습니다.
 *
 * 입력값 텍스트 색은 `--text-default`, placeholder는 `--text-subtle`을
 * 사용해 Figma의 `Status=default`(placeholder, subtle)/`filled`(실제 값,
 * default) 차이를 별도 prop 없이 네이티브 textarea의 실제 입력 여부만으로
 * 자연히 재현합니다. `Status=active`는 별도 prop이 아니라 컨테이너
 * `hover:`/`focus-within:`에 `--border-static-gray` + `--shadow-focus-ring`
 * (Figma box-shadow `0 0 0 3px rgba(161,161,161,.5)`와 정확히 일치하는
 * 기존 토큰)을 적용해 구현합니다(2026-08-02 최초 결정 유지).
 *
 * 이미지 첨부 썸네일(81px), 삭제 버튼 위치(-5px/-5.34px)는 매칭되는
 * `--scale-*`/`--spacing-*` 토큰이 없는 Figma 예시 수치라 근사/고정값으로
 * 유지합니다(Select의 209px 드롭다운 폭과 같은 유형의 예외).
 *
 * 첨부/전송/삭제 버튼의 실제 동작(파일 선택 → 썸네일 추가, 삭제, 전송 후
 * 입력값 초기화)은 2026-08-02 사용자 요청으로 구현된 기존 로직을 그대로
 * 유지합니다.
 */
export interface ChatboxImage {
  src: string;
  alt?: string;
}

export type ChatboxVariant = "default" | "image" | "chip" | "sentence-option";

const CHIP_LABELS = ["All", "Image", "Text"] as const;

const SENTENCE_OPTION_LABELS = [
  "I would like to change Asset Image",
  "I would like to change Short Text (One Liner)",
  "I would like to change Long Text (Description)",
] as const;

export interface ChatboxProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange"
> {
  /** Figma `Style` — 표시할 보조 위젯(이미지 첨부/필터 chip/문장 선택 리스트) */
  variant?: ChatboxVariant;
  /** 제어 컴포넌트로 사용할 때의 첨부 이미지 목록 (`variant="image"`) */
  images?: ChatboxImage[];
  /** 비제어 컴포넌트로 사용할 때의 초기 첨부 이미지 목록 (첨부 버튼으로 추가된 이미지가 여기에 쌓입니다) */
  defaultImages?: ChatboxImage[];
  /** 이미지 우상단 X 버튼 클릭 시 호출됩니다 (인덱스 전달) */
  onRemoveImage?: (index: number) => void;
  /** `variant="chip"`일 때 제어 컴포넌트로 사용할 선택된 chip 인덱스 (0=All/1=Image/2=Text) */
  selectedChip?: number;
  /** `variant="chip"`일 때 비제어 컴포넌트로 사용할 초기 선택 인덱스 */
  defaultSelectedChip?: number;
  /** chip 선택이 바뀔 때 호출됩니다 */
  onChipChange?: (index: number) => void;
  /** `variant="sentence-option"`일 때 제어 컴포넌트로 사용할 선택된 행 인덱스 */
  selectedSentenceOption?: number;
  /** `variant="sentence-option"`일 때 비제어 컴포넌트로 사용할 초기 선택 인덱스 */
  defaultSelectedSentenceOption?: number;
  /** sentence option 선택이 바뀔 때 호출됩니다 */
  onSentenceOptionChange?: (index: number) => void;
  /** 제어 컴포넌트로 사용할 때의 값 */
  value?: string;
  /** 비제어 컴포넌트로 사용할 때의 초기 값 */
  defaultValue?: string;
  /** 값이 바뀔 때 호출됩니다 */
  onValueChange?: (value: string) => void;
  /** "+" 첨부 버튼 클릭 시 호출됩니다 */
  onAttach?: () => void;
  /** 전송(sparkles) 버튼 클릭 시 호출됩니다 */
  onSend?: () => void;
  /** Figma `Status=disabled` */
  disabled?: boolean;
}

export function Chatbox({
  variant = "default",
  images,
  defaultImages = [],
  onRemoveImage,
  selectedChip,
  defaultSelectedChip = 0,
  onChipChange,
  selectedSentenceOption,
  defaultSelectedSentenceOption = 0,
  onSentenceOptionChange,
  value,
  defaultValue = "",
  onValueChange,
  onAttach,
  onSend,
  disabled = false,
  placeholder = "Please share your ideas.",
  className,
  id,
  ...props
}: ChatboxProps) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  const handleSend = () => {
    onSend?.();
    if (!isControlled) {
      setUncontrolledValue("");
    }
    onValueChange?.("");
  };

  const isImagesControlled = images !== undefined;
  const [uncontrolledImages, setUncontrolledImages] =
    React.useState<ChatboxImage[]>(defaultImages);
  const currentImages = isImagesControlled ? images : uncontrolledImages;

  const handleRemoveImage = (index: number) => {
    if (!isImagesControlled) {
      setUncontrolledImages((prev) => {
        const removed = prev[index];
        if (removed?.src.startsWith("blob:")) {
          URL.revokeObjectURL(removed.src);
        }
        return prev.filter((_, i) => i !== index);
      });
    }
    onRemoveImage?.(index);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
    onAttach?.();
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && !isImagesControlled) {
      const newImages: ChatboxImage[] = Array.from(files).map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));
      setUncontrolledImages((prev) => [...prev, ...newImages]);
    }
    event.target.value = "";
  };

  const isChipControlled = selectedChip !== undefined;
  const [uncontrolledChip, setUncontrolledChip] = React.useState(
    defaultSelectedChip,
  );
  const currentChip = isChipControlled ? selectedChip : uncontrolledChip;

  const handleChipClick = (index: number) => {
    if (!isChipControlled) {
      setUncontrolledChip(index);
    }
    onChipChange?.(index);
  };

  const isSentenceControlled = selectedSentenceOption !== undefined;
  const [uncontrolledSentence, setUncontrolledSentence] = React.useState(
    defaultSelectedSentenceOption,
  );
  const currentSentence = isSentenceControlled
    ? selectedSentenceOption
    : uncontrolledSentence;

  const handleSentenceClick = (index: number) => {
    if (!isSentenceControlled) {
      setUncontrolledSentence(index);
    }
    onSentenceOptionChange?.(index);
  };

  const showImages = currentImages.length > 0;
  const showChips = variant === "chip";
  const showSentenceOptions = variant === "sentence-option";
  const showAttachmentBlock = showImages || showChips || showSentenceOptions;

  return (
    <div
      className={cn(
        // 항상 다크: 사이트 테마와 무관하게 하위 시맨틱 토큰을 다크 값으로 강제
        "dark",
        // 700px: Figma 예시 프레임 폭(w-[700px] max-w-[700px])을 컨테이너 최대폭으로만
        // 적용, 실제 폭은 반응형(w-full). 매칭 토큰 없어 근사/고정값 사용 (Slider 435px 선례).
        "flex w-full max-w-[700px] flex-col items-start",
        "rounded-[var(--radius-scale-2xl)] p-[var(--spacing-4)]",
        "border-[length:var(--border-1)] border-solid border-[var(--border-default)]",
        "bg-[var(--background-default)]",
        showAttachmentBlock
          ? "gap-[var(--spacing-4)]"
          : "gap-[var(--spacing-11)]",
        // Status=active → hover 또는 내부 textarea 포커스에 대한 링 (focus-within)
        "hover:border-[var(--border-static-gray)] hover:shadow-[var(--shadow-focus-ring)]",
        "focus-within:border-[var(--border-static-gray)] focus-within:shadow-[var(--shadow-focus-ring)]",
        disabled && "pointer-events-none opacity-[var(--opacity-50)]",
        className,
      )}
    >
      {showImages ? (
        <div className="flex w-full items-start gap-[var(--spacing-2)]">
          {currentImages.map((image, index) => (
            <div key={index} className="relative shrink-0">
              {/* 81px: Figma 예시 썸네일 크기, 매칭 토큰 없음 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt ?? ""}
                className="size-[81px] rounded-[var(--radius-scale-md)] object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label="이미지 제거"
                className={cn(
                  "absolute flex size-[var(--spacing-4)] items-center justify-center",
                  "rounded-[var(--radius-scale-lg)]",
                  // 예외: 컴포넌트 전체가 다크여도 이 삭제 배지만 항상 라이트 고정
                  // (스크린샷 실측, 위 컴포넌트 doc 참고)
                  "border-[length:var(--border-1)] border-solid border-[var(--color-neutral-200)]",
                  "bg-[var(--color-white)]",
                  // Figma 예시 오프셋(-5px/-5.34px), 매칭 토큰 없어 근사치 사용
                  "-top-1.5 -right-1.5",
                )}
              >
                <svg
                  className="size-[var(--spacing-2)] text-[var(--color-neutral-950)]"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {showChips ? (
        <div className="flex items-start gap-[var(--spacing-2)]">
          {CHIP_LABELS.map((label, index) => (
            <Chips
              key={label}
              type="button"
              variant="secondary"
              selected={currentChip === index}
              disabled={disabled}
              onClick={() => handleChipClick(index)}
            >
              {label}
            </Chips>
          ))}
        </div>
      ) : null}

      {showSentenceOptions ? (
        <div className="flex w-full flex-col gap-[var(--spacing-2)]">
          {SENTENCE_OPTION_LABELS.map((label, index) => {
            const isSelected = currentSentence === index;
            return (
              <button
                key={label}
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => handleSentenceClick(index)}
                className={cn(
                  "flex h-[calc(var(--scale-36)*1px)] w-full items-center justify-between gap-[var(--spacing-2)]",
                  "rounded-[var(--radius-scale-lg)] px-[var(--spacing-4)]",
                  "text-sm-medium text-left transition-colors",
                  "border-[length:var(--border-1)] border-solid",
                  isSelected
                    ? "border-transparent bg-[var(--background-static-gray)] text-[var(--text-static-white)]"
                    : "border-[var(--border-default)] bg-[var(--background-default)] text-[var(--text-default)]",
                  "disabled:pointer-events-none disabled:border-[var(--border-overlay)] disabled:bg-[var(--background-disabled)] disabled:text-[var(--text-static-gray)]",
                )}
              >
                <span className="truncate">{label}</span>
                <svg
                  className="size-[var(--spacing-4)] shrink-0"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#chevron-right-icon" />
                </svg>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex w-full flex-col gap-[var(--spacing-11)]">
        <label htmlFor={textareaId} className="sr-only">
          {placeholder}
        </label>
        <textarea
          id={textareaId}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          rows={1}
          className={cn(
            "text-xs-regular w-full resize-none border-0 bg-transparent p-0",
            "text-[var(--text-default)] outline-none",
            "placeholder:text-[var(--text-subtle)]",
            "focus:placeholder:opacity-0",
            "disabled:cursor-not-allowed",
          )}
          {...props}
        />
        <div
          className={cn(
            "flex w-full items-center justify-between rounded-[var(--radius-scale-full)]",
            // Figma의 drop-shadow(0 1px 1px rgba(0,0,0,0.1))는 매칭 토큰이 없어
            // 가장 가까운 --shadow-xs로 근사
            "shadow-[var(--shadow-xs)]",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={handleFilesSelected}
          />
          <Button
            type="button"
            variant="icon"
            icon="plus-icon"
            aria-label="첨부"
            disabled={disabled}
            onClick={handleAttachClick}
            className="disabled:border-[var(--border-overlay)] disabled:bg-[var(--background-disabled)]"
          />
          <Button
            type="button"
            variant="icon"
            icon="sparkles-icon"
            aria-label="전송"
            disabled={disabled}
            onClick={handleSend}
            className="disabled:border-[var(--border-overlay)] disabled:bg-[var(--background-disabled)]"
          />
        </div>
      </div>
    </div>
  );
}
