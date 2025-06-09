import { type DateLib } from "../classes/DateLib.js";
import { type DayPickerProps } from "../types/props.js";
/** Return all the dates to display in the calendar. */
export declare function getDates(displayMonths: Date[], maxDate: Date | undefined, props: Pick<DayPickerProps, "ISOWeek" | "fixedWeeks" | "broadcastCalendar">, dateLib: DateLib): Date[];
