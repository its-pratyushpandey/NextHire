import type { DateLib } from "../classes/DateLib.js";
import type { DayPickerProps } from "../types/index.js";
/**
 * Return the next month the user can navigate to according to the given
 * options.
 *
 * Please note that the next month is not always the next calendar month:
 *
 * - If after the `calendarEndMonth` range, is `undefined`;
 * - If the navigation is paged , is the number of months displayed ahead.
 */
export declare function getNextMonth(firstDisplayedMonth: Date, calendarEndMonth: Date | undefined, options: Pick<DayPickerProps, "numberOfMonths" | "pagedNavigation" | "disableNavigation">, dateLib: DateLib): Date | undefined;
