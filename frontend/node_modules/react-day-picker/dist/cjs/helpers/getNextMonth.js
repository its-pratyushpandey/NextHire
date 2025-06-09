"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextMonth = getNextMonth;
/**
 * Return the next month the user can navigate to according to the given
 * options.
 *
 * Please note that the next month is not always the next calendar month:
 *
 * - If after the `calendarEndMonth` range, is `undefined`;
 * - If the navigation is paged , is the number of months displayed ahead.
 */
function getNextMonth(firstDisplayedMonth, calendarEndMonth, options, dateLib) {
    if (options.disableNavigation) {
        return undefined;
    }
    const { pagedNavigation, numberOfMonths = 1 } = options;
    const { startOfMonth, addMonths, differenceInCalendarMonths } = dateLib;
    const offset = pagedNavigation ? numberOfMonths : 1;
    const month = startOfMonth(firstDisplayedMonth);
    if (!calendarEndMonth) {
        return addMonths(month, offset);
    }
    const monthsDiff = differenceInCalendarMonths(calendarEndMonth, firstDisplayedMonth);
    if (monthsDiff < numberOfMonths) {
        return undefined;
    }
    // Jump forward as the number of months when paged navigation
    return addMonths(month, offset);
}
//# sourceMappingURL=getNextMonth.js.map