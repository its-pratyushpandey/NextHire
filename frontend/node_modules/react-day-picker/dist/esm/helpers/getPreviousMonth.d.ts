import type { DateLib } from "../classes/DateLib.js";
import type { DayPickerProps } from "../types/index.js";
/**
 * Return the next previous the user can navigate to, according to the given
 * options.
 *
 * Please note that the previous month is not always the previous calendar
 * month:
 *
 * - If before the `calendarStartMonth` date, is `undefined`;
 * - If the navigation is paged, is the number of months displayed before.
 */
export declare function getPreviousMonth(firstDisplayedMonth: Date, calendarStartMonth: Date | undefined, options: Pick<DayPickerProps, "numberOfMonths" | "pagedNavigation" | "disableNavigation">, dateLib: DateLib): Date | undefined;
