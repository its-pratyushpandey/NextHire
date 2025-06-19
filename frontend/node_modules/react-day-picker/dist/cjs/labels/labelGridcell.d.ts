import { DateLib, type DateLibOptions } from "../classes/DateLib.js";
import type { Modifiers } from "../types/index.js";
/**
 * The label for the day gridcell when the calendar is not interactive.
 *
 * @group Labels
 * @see https://daypicker.dev/docs/translation#aria-labels
 */
export declare function labelGridcell(date: Date, 
/** The modifiers for the day. */
modifiers?: Modifiers, options?: DateLibOptions, dateLib?: DateLib): string;
