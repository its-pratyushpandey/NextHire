import React from "react";
import type { CalendarDay } from "./classes/CalendarDay.js";
import { CalendarMonth } from "./classes/CalendarMonth.js";
import type { DateLib } from "./classes/DateLib.js";
import { ClassNames } from "./types/shared.js";
/** @private */
export declare function useAnimation(rootElRef: React.RefObject<HTMLDivElement | null>, enabled: boolean, { classNames, months, focused, dateLib }: {
    classNames: ClassNames;
    months: CalendarMonth[];
    focused: CalendarDay | undefined;
    dateLib: DateLib;
}): void;
