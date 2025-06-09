"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFocusableDate = getFocusableDate;
/** Return the next date that should be focused. */
function getFocusableDate(moveBy, moveDir, refDate, navStart, navEnd, props, dateLib) {
    const { ISOWeek, broadcastCalendar } = props;
    const { addDays, addMonths, addWeeks, addYears, endOfBroadcastWeek, endOfISOWeek, endOfWeek, max, min, startOfBroadcastWeek, startOfISOWeek, startOfWeek } = dateLib;
    const moveFns = {
        day: addDays,
        week: addWeeks,
        month: addMonths,
        year: addYears,
        startOfWeek: (date) => broadcastCalendar
            ? startOfBroadcastWeek(date, dateLib)
            : ISOWeek
                ? startOfISOWeek(date)
                : startOfWeek(date),
        endOfWeek: (date) => broadcastCalendar
            ? endOfBroadcastWeek(date, dateLib)
            : ISOWeek
                ? endOfISOWeek(date)
                : endOfWeek(date)
    };
    let focusableDate = moveFns[moveBy](refDate, moveDir === "after" ? 1 : -1);
    if (moveDir === "before" && navStart) {
        focusableDate = max([navStart, focusableDate]);
    }
    else if (moveDir === "after" && navEnd) {
        focusableDate = min([navEnd, focusableDate]);
    }
    return focusableDate;
}
//# sourceMappingURL=getFocusableDate.js.map