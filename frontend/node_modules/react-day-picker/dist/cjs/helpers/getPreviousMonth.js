"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousMonth = getPreviousMonth;
/**
 * Return the next previous the user can navigate to, according to the given
 * options.
 *
 * Please note that the previous month is not always the previous calendar
 * month:
 *
 * - If before the `calendarStartMonth` date, is `undefined`;
 * - If the navigation is paged, is the number of months displayed before.
 */
function getPreviousMonth(firstDisplayedMonth, calendarStartMonth, options, dateLib) {
    if (options.disableNavigation) {
        return undefined;
    }
    const { pagedNavigation, numberOfMonths } = options;
    const { startOfMonth, addMonths, differenceInCalendarMonths } = dateLib;
    const offset = pagedNavigation ? (numberOfMonths ?? 1) : 1;
    const month = startOfMonth(firstDisplayedMonth);
    if (!calendarStartMonth) {
        return addMonths(month, -offset);
    }
    const monthsDiff = differenceInCalendarMonths(month, calendarStartMonth);
    if (monthsDiff <= 0) {
        return undefined;
    }
    return addMonths(month, -offset);
}
//# sourceMappingURL=getPreviousMonth.js.map