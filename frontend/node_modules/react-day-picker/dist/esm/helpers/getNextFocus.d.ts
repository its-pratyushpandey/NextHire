import type { DateLib } from "../classes/DateLib.js";
import { CalendarDay } from "../classes/index.js";
import type { DayPickerProps, MoveFocusBy, MoveFocusDir } from "../types/index.js";
export declare function getNextFocus(moveBy: MoveFocusBy, moveDir: MoveFocusDir, 
/** The date that is currently focused. */
refDay: CalendarDay, calendarStartMonth: Date | undefined, calendarEndMonth: Date | undefined, props: Pick<DayPickerProps, "disabled" | "hidden" | "modifiers" | "ISOWeek" | "timeZone">, dateLib: DateLib, attempt?: number): CalendarDay | undefined;
