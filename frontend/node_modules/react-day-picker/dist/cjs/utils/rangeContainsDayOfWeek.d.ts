import { type DateLib } from "../classes/DateLib.js";
/**
 * Returns whether a date range contains one or more days of the week.
 *
 * ```tsx
 * const range: DateRange = {
 *   from: new Date(2024, 8, 1), //  Sunday
 *   to: new Date(2024, 8, 6) //  Thursday
 * };
 * rangeContainsDayOfWeek(date, 1); // true: contains range contains Monday
 * ```
 *
 * @since 9.2.2
 * @group Utilities
 */
export declare function rangeContainsDayOfWeek(range: {
    from: Date;
    to: Date;
}, dayOfWeek: number | number[], dateLib?: DateLib): boolean;
