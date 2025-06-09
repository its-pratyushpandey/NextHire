import { type DateLib } from "../classes/DateLib.js";
import type { DayPickerProps } from "../types/index.js";
/** Return the start and end months for the calendar navigation. */
export declare function getNavMonths(props: Pick<DayPickerProps, "captionLayout" | "endMonth" | "startMonth" | "today" | "timeZone" | "fromMonth" | "fromYear" | "toMonth" | "toYear">, dateLib: DateLib): [start: Date | undefined, end: Date | undefined];
