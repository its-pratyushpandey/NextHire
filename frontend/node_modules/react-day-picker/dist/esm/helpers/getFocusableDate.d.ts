import type { DateLib } from "../classes/DateLib.js";
import type { DayPickerProps, MoveFocusBy, MoveFocusDir } from "../types/index.js";
/** Return the next date that should be focused. */
export declare function getFocusableDate(moveBy: MoveFocusBy, moveDir: MoveFocusDir, refDate: Date, navStart: Date | undefined, navEnd: Date | undefined, props: Pick<DayPickerProps, "ISOWeek" | "broadcastCalendar">, dateLib: DateLib): Date;
