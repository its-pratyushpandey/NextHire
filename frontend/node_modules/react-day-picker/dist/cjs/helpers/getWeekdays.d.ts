import { DateLib } from "../classes/DateLib.js";
/**
 * Generate a series of 7 days, starting from the week, to use for formatting
 * the weekday names (Monday, Tuesday, etc.).
 */
export declare function getWeekdays(
/** The date library. */
dateLib: DateLib, 
/** Use ISOWeek instead of locale/ */
ISOWeek?: boolean | undefined, 
/** @since 9.4.0 */
broadcastCalendar?: boolean | undefined): Date[];
