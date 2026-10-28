"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Icon } from "@/lib/sprite-icon";

type RepeatType = "Daily" | "Weekly" | "Monthly" | "Custom";

const REPEAT_TABS: RepeatType[] = ["Daily", "Weekly", "Monthly", "Custom"];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export interface RepeatPanelProps {
  onDone: () => void;
}

/**
 * 좌측 Repeat 패널 — Daily/Weekly/Monthly/Custom 4탭 + 공용 "On Each Day"
 * 설정(빈도 스테퍼가 시간 필드 행 개수를 동적으로 결정).
 * (`docs/GB_Content_Studio.md` 8부)
 */
export function RepeatPanel({ onDone }: RepeatPanelProps) {
  const [tabIndex, setTabIndex] = React.useState(0);
  const repeatType = REPEAT_TABS[tabIndex]!;
  const [frequency, setFrequency] = React.useState(1);
  const [times, setTimes] = React.useState(["10:00 PM"]);
  const [selectedDays, setSelectedDays] = React.useState<number[]>([0, 2, 4]);
  const [monthDay, setMonthDay] = React.useState(15);
  const [customInterval, setCustomInterval] = React.useState(2);

  const changeFrequency = (next: number) => {
    const clamped = Math.max(1, next);
    setFrequency(clamped);
    setTimes((prev) => {
      const copy = [...prev];
      while (copy.length < clamped) copy.push("10:00 PM");
      return copy.slice(0, clamped);
    });
  };

  return (
    <div className="flex w-[320px] flex-col gap-[var(--gb-spacing-4)] rounded-[var(--gb-radius-scale-2xl)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-subtler)] bg-[var(--gb-background-subtlest)] p-[var(--gb-spacing-5)]">
      <Tabs
        items={REPEAT_TABS.map((label) => ({ label }))}
        selectedIndex={tabIndex}
        onSelectedIndexChange={setTabIndex}
      />

      {repeatType === "Weekly" && (
        <div className="flex items-center gap-[var(--gb-spacing-1)]">
          {WEEKDAYS.map((label, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                setSelectedDays((prev) =>
                  prev.includes(index)
                    ? prev.filter((day) => day !== index)
                    : [...prev, index],
                )
              }
              className={cn(
                "flex size-[32px] items-center justify-center rounded-[var(--gb-radius-scale-full)]",
                "text-xs-medium",
                selectedDays.includes(index)
                  ? "bg-[var(--gb-background-invert)] text-[var(--gb-text-static-white)]"
                  : "bg-[var(--gb-background-mute)] text-[var(--gb-text-default)]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {repeatType === "Monthly" && (
        <div className="flex items-center gap-[var(--gb-spacing-2)]">
          <span className="text-sm-medium text-[var(--gb-text-default)]">
            On this date — Day
          </span>
          <Button
            variant="icon-rounded"
            icon={<Icon id="minus-icon" />}
            aria-label="감소"
            onClick={() => setMonthDay((prev) => Math.max(1, prev - 1))}
          />
          <span className="text-sm-semi-bold w-[24px] text-center text-[var(--gb-text-default)]">
            {monthDay}
          </span>
          <Button
            variant="icon-rounded"
            icon={<Icon id="plus-icon" />}
            aria-label="증가"
            onClick={() => setMonthDay((prev) => Math.min(31, prev + 1))}
          />
          <span className="text-sm-medium text-[var(--gb-text-default)]">
            of every month
          </span>
        </div>
      )}

      {repeatType === "Custom" && (
        <div className="flex items-center gap-[var(--gb-spacing-2)]">
          <span className="text-sm-medium text-[var(--gb-text-default)]">
            Every
          </span>
          <Button
            variant="icon-rounded"
            icon={<Icon id="minus-icon" />}
            aria-label="감소"
            onClick={() => setCustomInterval((prev) => Math.max(1, prev - 1))}
          />
          <span className="text-sm-semi-bold w-[24px] text-center text-[var(--gb-text-default)]">
            {customInterval}
          </span>
          <Button
            variant="icon-rounded"
            icon={<Icon id="plus-icon" />}
            aria-label="증가"
            onClick={() => setCustomInterval((prev) => prev + 1)}
          />
          <span className="text-sm-medium text-[var(--gb-text-default)]">
            Days
          </span>
        </div>
      )}

      <div className="flex flex-col gap-[var(--gb-spacing-3)]">
        <div className="flex items-center gap-[var(--gb-spacing-2)]">
          <span className="text-sm-medium text-[var(--gb-text-default)]">
            How often would you like to post?
          </span>
          <Button
            variant="icon-rounded"
            icon={<Icon id="minus-icon" />}
            aria-label="감소"
            onClick={() => changeFrequency(frequency - 1)}
          />
          <span className="text-sm-semi-bold w-[24px] text-center text-[var(--gb-text-default)]">
            {frequency}
          </span>
          <Button
            variant="icon-rounded"
            icon={<Icon id="plus-icon" />}
            aria-label="증가"
            onClick={() => changeFrequency(frequency + 1)}
          />
        </div>

        <div className="flex flex-col gap-[var(--gb-spacing-2)]">
          <span className="text-sm-medium text-[var(--gb-text-default)]">
            When would you like to post?
          </span>
          {times.map((time, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)] px-[var(--gb-spacing-3)] py-[var(--gb-spacing-2)]"
            >
              <span className="text-sm-regular text-[var(--gb-text-default)]">
                {time}
              </span>
              {times.length > 1 && (
                <Button
                  variant="icon-ghost"
                  icon={<Icon id="x-icon" />}
                  aria-label="삭제"
                  onClick={() => changeFrequency(frequency - 1)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
