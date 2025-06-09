"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInterval = isDateInterval;
exports.isDateRange = isDateRange;
exports.isDateAfterType = isDateAfterType;
exports.isDateBeforeType = isDateBeforeType;
exports.isDayOfWeekType = isDayOfWeekType;
exports.isDatesArray = isDatesArray;
/**
 * Returns true if `matcher` is of type {@link DateInterval}.
 *
 * @group Utilities
 */
function isDateInterval(matcher) {
    return Boolean(matcher &&
        typeof matcher === "object" &&
        "before" in matcher &&
        "after" in matcher);
}
/**
 * Returns true if `value` is a {@link DateRange} type.
 *
 * @group Utilities
 */
function isDateRange(value) {
    return Boolean(value && typeof value === "object" && "from" in value);
}
/**
 * Returns true if `value` is of type {@link DateAfter}.
 *
 * @group Utilities
 */
function isDateAfterType(value) {
    return Boolean(value && typeof value === "object" && "after" in value);
}
/**
 * Returns true if `value` is of type {@link DateBefore}.
 *
 * @group Utilities
 */
function isDateBeforeType(value) {
    return Boolean(value && typeof value === "object" && "before" in value);
}
/**
 * Returns true if `value` is a {@link DayOfWeek} type.
 *
 * @group Utilities
 */
function isDayOfWeekType(value) {
    return Boolean(value && typeof value === "object" && "dayOfWeek" in value);
}
/**
 * Returns true if `value` is an array of valid dates.
 *
 * @private
 */
function isDatesArray(value, dateLib) {
    return Array.isArray(value) && value.every(dateLib.isDate);
}
//# sourceMappingURL=typeguards.js.map