"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDays = getDays;
/**
 * Returns all the days belonging to the calendar by merging the days in the
 * weeks for each month.
 */
function getDays(calendarMonths) {
    const initialDays = [];
    return calendarMonths.reduce((days, month) => {
        const initialDays = [];
        const weekDays = month.weeks.reduce((weekDays, week) => {
            return [...weekDays, ...week.days];
        }, initialDays);
        return [...days, ...weekDays];
    }, initialDays);
}
//# sourceMappingURL=getDays.js.map