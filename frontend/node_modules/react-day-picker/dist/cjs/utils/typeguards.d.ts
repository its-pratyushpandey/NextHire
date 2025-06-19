import type { DateLib } from "../classes/DateLib.js";
import type { DateAfter, DateBefore, DateInterval, DateRange, DayOfWeek } from "../types/index.js";
/**
 * Returns true if `matcher` is of type {@link DateInterval}.
 *
 * @group Utilities
 */
export declare function isDateInterval(matcher: unknown): matcher is DateInterval;
/**
 * Returns true if `value` is a {@link DateRange} type.
 *
 * @group Utilities
 */
export declare function isDateRange(value: unknown): value is DateRange;
/**
 * Returns true if `value` is of type {@link DateAfter}.
 *
 * @group Utilities
 */
export declare function isDateAfterType(value: unknown): value is DateAfter;
/**
 * Returns true if `value` is of type {@link DateBefore}.
 *
 * @group Utilities
 */
export declare function isDateBeforeType(value: unknown): value is DateBefore;
/**
 * Returns true if `value` is a {@link DayOfWeek} type.
 *
 * @group Utilities
 */
export declare function isDayOfWeekType(value: unknown): value is DayOfWeek;
/**
 * Returns true if `value` is an array of valid dates.
 *
 * @private
 */
export declare function isDatesArray(value: unknown, dateLib: DateLib): value is Date[];
