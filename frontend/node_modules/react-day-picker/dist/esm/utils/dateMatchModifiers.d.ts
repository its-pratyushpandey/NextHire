import { type DateLib } from "../classes/DateLib.js";
import type { Matcher } from "../types/index.js";
/**
 * Returns whether a day matches against at least one of the given
 * {@link Matcher}.
 *
 * ```tsx
 * const date = new Date(2022, 5, 19);
 * const matcher1: DateRange = {
 *   from: new Date(2021, 12, 21),
 *   to: new Date(2021, 12, 30)
 * };
 * const matcher2: DateRange = {
 *   from: new Date(2022, 5, 1),
 *   to: new Date(2022, 5, 23)
 * };
 * dateMatchModifiers(date, [matcher1, matcher2]); // true, since day is in the matcher1 range.
 * ```
 *
 * @group Utilities
 */
export declare function dateMatchModifiers(date: Date, matchers: Matcher | Matcher[], dateLib?: DateLib): boolean;
/**
 * @private
 * @deprecated Use {@link dateMatchModifiers} instead.
 */
export declare const isMatch: typeof dateMatchModifiers;
