import { type DateLib } from "../classes/DateLib.js";
import type { DateRange } from "../types/index.js";
/**
 * Add a day to an existing range.
 *
 * The returned range takes in account the `undefined` values and if the added
 * day is already present in the range.
 *
 * @group Utilities
 */
export declare function addToRange(
/** The date to add to the range. */
date: Date, 
/** The range where to add `date`. */
initialRange: DateRange | undefined, min?: number, max?: number, required?: boolean, 
/** @ignore */
dateLib?: DateLib): DateRange | undefined;
