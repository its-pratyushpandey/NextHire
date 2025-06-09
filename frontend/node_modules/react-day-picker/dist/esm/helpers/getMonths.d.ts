import type { DateLib } from "../classes/DateLib.js";
import { CalendarMonth } from "../classes/index.js";
import type { DayPickerProps } from "../types/index.js";
/** Return the months to display in the calendar. */
export declare function getMonths(
/** The months (as dates) to display in the calendar. */
displayMonths: Date[], 
/** The dates to display in the calendar. */
dates: Date[], 
/** Options from the props context. */
props: Pick<DayPickerProps, "broadcastCalendar" | "fixedWeeks" | "ISOWeek" | "reverseMonths">, dateLib: DateLib): CalendarMonth[];
