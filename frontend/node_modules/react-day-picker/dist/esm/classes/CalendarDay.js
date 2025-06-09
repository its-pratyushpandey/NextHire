import { defaultDateLib } from "./DateLib.js";
/**
 * Represent the day displayed in the calendar.
 *
 * In DayPicker, a `Day` is a `Date` that can be displayed in the calendar. It
 * is used as extension of the native `Date` object to provide additional
 * information about the day.
 */
export class CalendarDay {
    constructor(date, displayMonth, dateLib = defaultDateLib) {
        this.date = date;
        this.displayMonth = displayMonth;
        this.outside = Boolean(displayMonth && !dateLib.isSameMonth(date, displayMonth));
        this.dateLib = dateLib;
    }
    /**
     * Check if the day is the same as the given day: considering if it is in the
     * same display month.
     */
    isEqualTo(day) {
        return (this.dateLib.isSameDay(day.date, this.date) &&
            this.dateLib.isSameMonth(day.displayMonth, this.displayMonth));
    }
}
//# sourceMappingURL=CalendarDay.js.map