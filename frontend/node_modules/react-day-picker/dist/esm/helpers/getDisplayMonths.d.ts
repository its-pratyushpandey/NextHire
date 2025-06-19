import type { DateLib } from "../classes/DateLib.js";
import type { DayPickerProps } from "../types/index.js";
export declare function getDisplayMonths(firstDisplayedMonth: Date, calendarEndMonth: Date | undefined, props: Pick<DayPickerProps, "numberOfMonths">, dateLib: DateLib): Date[];
