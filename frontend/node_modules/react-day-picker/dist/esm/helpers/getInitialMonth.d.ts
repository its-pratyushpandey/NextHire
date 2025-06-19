import { type DateLib } from "../classes/DateLib.js";
import { type DayPickerProps } from "../types/props.js";
/** Return the start month based on the props passed to DayPicker. */
export declare function getInitialMonth(props: Pick<DayPickerProps, "fromYear" | "toYear" | "startMonth" | "endMonth" | "month" | "defaultMonth" | "today" | "numberOfMonths" | "timeZone">, dateLib: DateLib): Date;
