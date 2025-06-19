"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfBroadcastWeek = startOfBroadcastWeek;
/**
 * Return the start date of the week in the broadcast calendar.
 *
 * @since 9.4.0
 */
function startOfBroadcastWeek(date, dateLib) {
    const firstOfMonth = dateLib.startOfMonth(date);
    const dayOfWeek = firstOfMonth.getDay();
    if (dayOfWeek === 1) {
        return firstOfMonth;
    }
    else if (dayOfWeek === 0) {
        return dateLib.addDays(firstOfMonth, -1 * 6);
    }
    else {
        return dateLib.addDays(firstOfMonth, -1 * (dayOfWeek - 1));
    }
}
//# sourceMappingURL=startOfBroadcastWeek.js.map