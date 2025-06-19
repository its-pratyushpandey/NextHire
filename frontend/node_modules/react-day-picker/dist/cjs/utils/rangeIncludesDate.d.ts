import type { DateRange } from "../types/index.js";
/**
 * Determines whether a given date is inside a specified date range.
 *
 * @since 9.0.0
 * @group Utilities
 */
export declare function rangeIncludesDate(range: DateRange, date: Date, 
/** If `true`, the ends of the range are excluded. */
excludeEnds?: boolean, dateLib?: import("../classes/DateLib.js").DateLib): boolean;
/**
 * @private
 * @deprecated Use {@link rangeIncludesDate} instead.
 */
export declare const isDateInRange: (range: DateRange, date: Date) => boolean;
