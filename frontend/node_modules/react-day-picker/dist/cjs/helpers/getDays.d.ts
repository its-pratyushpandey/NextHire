import type { CalendarDay, CalendarMonth } from "../classes/index.js";
/**
 * Returns all the days belonging to the calendar by merging the days in the
 * weeks for each month.
 */
export declare function getDays(calendarMonths: CalendarMonth[]): CalendarDay[];
