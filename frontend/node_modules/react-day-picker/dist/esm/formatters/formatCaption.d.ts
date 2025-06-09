import { DateLib, type DateLibOptions } from "../classes/DateLib.js";
/**
 * Format the caption of the month.
 *
 * @defaultValue `LLLL y` (e.g. "November 2022")
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
export declare function formatCaption(month: Date, options?: DateLibOptions, dateLib?: DateLib): string;
/**
 * @private
 * @deprecated Use {@link formatCaption} instead.
 * @group Formatters
 */
export declare const formatMonthCaption: typeof formatCaption;
