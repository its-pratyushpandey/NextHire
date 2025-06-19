import type { CalendarDay, DateLib } from "./classes/index.js";
import type { DayPickerProps, Modifiers } from "./types/index.js";
/**
 * Return a function to get the modifiers for a given day.
 *
 * NOTE: this is not an hook, but a factory for `getModifiers`.
 *
 * @private
 */
export declare function useGetModifiers(days: CalendarDay[], props: DayPickerProps, dateLib: DateLib): (day: CalendarDay) => Modifiers;
