import { describe, expect, it } from "vitest";

import {
  createCustomIntervalSlot,
  createNextDaySlots,
  createNextMonthSlot,
  createNextWeekSlots,
  deriveFrequencyFromSchedule,
  deriveScheduleFromFrequency,
} from "./data";

const makeSlots = (count: number) =>
  Array.from({ length: count }, () => ({
    time: "10:00",
    period: "AM" as const,
  }));

const EMPTY_TIME_SLOTS_BY_TYPE = {
  daily: makeSlots(1),
  weekly: makeSlots(1),
  monthly: makeSlots(1),
  custom: makeSlots(1),
};

const LAST_SLOT = [{ date: "Sep 03" }]; // Thursday, Sep 03 2026

describe("createNextDaySlots", () => {
  it("adds one group on the day after the last existing slot", () => {
    const slots = createNextDaySlots(LAST_SLOT, 10, ["10:00 AM", "02:25 PM"]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Friday", date: "Sep 04", time: "10:00 AM" },
      { id: "slot-11", dayLabel: "Friday", date: "Sep 04", time: "02:25 PM" },
    ]);
  });
});

describe("createNextWeekSlots", () => {
  it("adds one group per checked weekday, in the week after the last slot's week", () => {
    // Sep 03 2026 is a Thursday, so its week is Mon Aug 31 – Sun Sep 06.
    // The next week is Mon Sep 07 – Sun Sep 13.
    const slots = createNextWeekSlots(LAST_SLOT, ["fri", "mon"], 10, [
      "09:00 AM",
    ]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Monday", date: "Sep 07", time: "09:00 AM" },
      { id: "slot-11", dayLabel: "Friday", date: "Sep 11", time: "09:00 AM" },
    ]);
  });

  it("adds nothing when no weekday is checked", () => {
    expect(createNextWeekSlots(LAST_SLOT, [], 10, ["09:00 AM"])).toEqual([]);
  });
});

describe("createNextMonthSlot", () => {
  it("lands on the given day of the next month when that day has already passed", () => {
    const slots = createNextMonthSlot(LAST_SLOT, "1", 10, ["09:00 AM"]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Thursday", date: "Oct 01", time: "09:00 AM" },
    ]);
  });

  it("lands later in the same month when that day hasn't happened yet", () => {
    const slots = createNextMonthSlot(LAST_SLOT, "20", 10, ["09:00 AM"]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Sunday", date: "Sep 20", time: "09:00 AM" },
    ]);
  });
});

describe("createCustomIntervalSlot", () => {
  it("adds the given number of days", () => {
    const slots = createCustomIntervalSlot(LAST_SLOT, "5", "days", 10, [
      "09:00 AM",
    ]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Tuesday", date: "Sep 08", time: "09:00 AM" },
    ]);
  });

  it("adds the given number of weeks", () => {
    const slots = createCustomIntervalSlot(LAST_SLOT, "2", "weeks", 10, [
      "09:00 AM",
    ]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Thursday", date: "Sep 17", time: "09:00 AM" },
    ]);
  });

  it("adds the given number of months", () => {
    const slots = createCustomIntervalSlot(LAST_SLOT, "1", "months", 10, [
      "09:00 AM",
    ]);

    expect(slots).toEqual([
      { id: "slot-10", dayLabel: "Saturday", date: "Oct 03", time: "09:00 AM" },
    ]);
  });
});

describe("deriveScheduleFromFrequency", () => {
  it("maps Day unit to a daily repeat with a matching slot count", () => {
    const result = deriveScheduleFromFrequency(2, "Day", {
      selectedWeekdays: ["tue"],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });

    expect(result.repeatType).toBe("daily");
    expect(result.timeSlotsByType.daily).toHaveLength(2);
  });

  it("maps Week unit to weekdays starting from Monday, capped at 7", () => {
    const result = deriveScheduleFromFrequency(10, "Week", {
      selectedWeekdays: [],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });

    expect(result.repeatType).toBe("weekly");
    expect(result.selectedWeekdays).toEqual([
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
      "sun",
    ]);
    expect(result.timeSlotsByType.weekly).toHaveLength(2); // ceil(10 / 7)
  });

  it('defaults an empty dayOfMonth to "1" for Month unit', () => {
    const result = deriveScheduleFromFrequency(3, "Month", {
      selectedWeekdays: [],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });

    expect(result.repeatType).toBe("monthly");
    expect(result.dayOfMonth).toBe("1");
    expect(result.timeSlotsByType.monthly).toHaveLength(3);
  });
});

describe("deriveFrequencyFromSchedule", () => {
  it("maps a daily repeat to its slot count", () => {
    expect(
      deriveFrequencyFromSchedule("daily", [], "days", {
        ...EMPTY_TIME_SLOTS_BY_TYPE,
        daily: makeSlots(4),
      }),
    ).toEqual({ count: 4, unit: "Day" });
  });

  it("maps a weekly repeat to slots-per-day x selected weekdays", () => {
    expect(
      deriveFrequencyFromSchedule("weekly", ["mon", "wed"], "days", {
        ...EMPTY_TIME_SLOTS_BY_TYPE,
        weekly: makeSlots(2),
      }),
    ).toEqual({ count: 4, unit: "Week" });
  });

  it("maps a monthly repeat to its slot count", () => {
    expect(
      deriveFrequencyFromSchedule("monthly", [], "days", {
        ...EMPTY_TIME_SLOTS_BY_TYPE,
        monthly: makeSlots(5),
      }),
    ).toEqual({ count: 5, unit: "Month" });
  });

  it("approximates a custom repeat's everyUnit to the nearest Day/Week/Month", () => {
    expect(
      deriveFrequencyFromSchedule("custom", [], "weeks", {
        ...EMPTY_TIME_SLOTS_BY_TYPE,
        custom: makeSlots(3),
      }),
    ).toEqual({ count: 3, unit: "Week" });
  });
});

describe("deriveScheduleFromFrequency / deriveFrequencyFromSchedule round trip", () => {
  it("preserves the Week count exactly when it fits within 7 weekdays", () => {
    const schedule = deriveScheduleFromFrequency(5, "Week", {
      selectedWeekdays: [],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });

    expect(
      deriveFrequencyFromSchedule(
        schedule.repeatType,
        schedule.selectedWeekdays,
        "days",
        schedule.timeSlotsByType,
      ),
    ).toEqual({ count: 5, unit: "Week" });
  });

  it("drifts to a multiple of 7 once the Week count exceeds 7, since weekdays cap at 7", () => {
    const schedule = deriveScheduleFromFrequency(10, "Week", {
      selectedWeekdays: [],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });

    // ceil(10 / 7) = 2 occurrences/day x 7 days = 14, not 10 — the accepted
    // approximation documented on deriveScheduleFromFrequency.
    expect(
      deriveFrequencyFromSchedule(
        schedule.repeatType,
        schedule.selectedWeekdays,
        "days",
        schedule.timeSlotsByType,
      ),
    ).toEqual({ count: 14, unit: "Week" });
  });

  it("preserves Day and Month counts exactly at any size", () => {
    const daySchedule = deriveScheduleFromFrequency(9, "Day", {
      selectedWeekdays: [],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });
    expect(
      deriveFrequencyFromSchedule(
        "daily",
        [],
        "days",
        daySchedule.timeSlotsByType,
      ),
    ).toEqual({ count: 9, unit: "Day" });

    const monthSchedule = deriveScheduleFromFrequency(6, "Month", {
      selectedWeekdays: [],
      dayOfMonth: "",
      timeSlotsByType: EMPTY_TIME_SLOTS_BY_TYPE,
    });
    expect(
      deriveFrequencyFromSchedule(
        "monthly",
        [],
        "days",
        monthSchedule.timeSlotsByType,
      ),
    ).toEqual({ count: 6, unit: "Month" });
  });
});
