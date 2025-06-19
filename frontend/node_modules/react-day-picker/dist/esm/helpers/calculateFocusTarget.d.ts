import type { CalendarDay } from "../classes/index.js";
import type { Modifiers } from "../types/index.js";
export declare function calculateFocusTarget(days: CalendarDay[], getModifiers: (day: CalendarDay) => Modifiers, isSelected: (date: Date) => boolean, lastFocused: CalendarDay | undefined): CalendarDay | undefined;
