import { DateLib, type DateLibOptions } from "../classes/DateLib.js";
import type { Modifiers } from "../types/index.js";
/**
 * The ARIA label for the day button.
 *
 * Use the `modifiers` argument to add additional context to the label, e.g.
 * when a day is selected or is today.
 *
 * @defaultValue The formatted date.
 * @group Labels
 * @see https://daypicker.dev/docs/translation#aria-labels
 */
export declare function labelDayButton(date: Date, 
/** The modifiers for the day. */
modifiers: Modifiers, options?: DateLibOptions, dateLib?: DateLib): string;
/**
 * @ignore
 * @deprecated Use `labelDayButton` instead.
 */
export declare const labelDay: typeof labelDayButton;
