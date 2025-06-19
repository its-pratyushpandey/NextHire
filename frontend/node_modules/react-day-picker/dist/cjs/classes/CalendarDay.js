"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarDay = void 0;
const DateLib_js_1 = require("./DateLib.js");
/**
 * Represent the day displayed in the calendar.
 *
 * In DayPicker, a `Day` is a `Date` that can be displayed in the calendar. It
 * is used as extension of the native `Date` object to provide additional
 * information about the day.
 */
class CalendarDay {
    constructor(date, displayMonth, dateLib = DateLib_js_1.defaultDateLib) {
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
exports.CalendarDay = CalendarDay;
//# sourceMappingURL=CalendarDay.js.map