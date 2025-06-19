"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInRange = void 0;
exports.rangeIncludesDate = rangeIncludesDate;
const index_js_1 = require("../classes/index.js");
/**
 * Determines whether a given date is inside a specified date range.
 *
 * @since 9.0.0
 * @group Utilities
 */
function rangeIncludesDate(range, date, 
/** If `true`, the ends of the range are excluded. */
excludeEnds = false, dateLib = index_js_1.defaultDateLib) {
    let { from, to } = range;
    const { differenceInCalendarDays, isSameDay } = dateLib;
    if (from && to) {
        const isRangeInverted = differenceInCalendarDays(to, from) < 0;
        if (isRangeInverted) {
            [from, to] = [to, from];
        }
        const isInRange = differenceInCalendarDays(date, from) >= (excludeEnds ? 1 : 0) &&
            differenceInCalendarDays(to, date) >= (excludeEnds ? 1 : 0);
        return isInRange;
    }
    if (!excludeEnds && to) {
        return isSameDay(to, date);
    }
    if (!excludeEnds && from) {
        return isSameDay(from, date);
    }
    return false;
}
/**
 * @private
 * @deprecated Use {@link rangeIncludesDate} instead.
 */
const isDateInRange = (range, date) => rangeIncludesDate(range, date, false, index_js_1.defaultDateLib);
exports.isDateInRange = isDateInRange;
//# sourceMappingURL=rangeIncludesDate.js.map