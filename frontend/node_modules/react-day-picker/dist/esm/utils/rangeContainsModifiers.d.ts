import { type DateLib } from "../classes/DateLib.js";
import type { Matcher } from "../types/index.js";
/**
 * Returns whether a range contains dates that match the given modifiers.
 *
 * ```tsx
 * const range: DateRange = {
 *   from: new Date(2021, 12, 21),
 *   to: new Date(2021, 12, 30)
 * };
 * const matcher1: Date = new Date(2021, 12, 21);
 * const matcher2: DateRange = {
 *   from: new Date(2022, 5, 1),
 *   to: new Date(2022, 5, 23)
 * };
 * rangeContainsModifiers(range, [matcher1, matcher2]); // true, since matcher1 is in the date.
 * ```
 *
 * @since 9.2.2
 * @group Utilities
 */
export declare function rangeContainsModifiers(range: {
    from: Date;
    to: Date;
}, modifiers: Matcher | Matcher[], dateLib?: DateLib): boolean;
