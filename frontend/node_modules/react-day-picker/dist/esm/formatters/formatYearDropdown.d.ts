import { type DateLib } from "../classes/DateLib.js";
/**
 * Format the years for the dropdown option label.
 *
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
export declare function formatYearDropdown(year: Date, dateLib?: DateLib): string;
/**
 * @private
 * @deprecated Use `formatYearDropdown` instead.
 * @group Formatters
 */
export declare const formatYearCaption: typeof formatYearDropdown;
