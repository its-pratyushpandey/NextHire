/**
 * Returns true if `matcher` is of type {@link DateInterval}.
 *
 * @group Utilities
 */
export function isDateInterval(matcher) {
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
export function isDateRange(value) {
    return Boolean(value && typeof value === "object" && "from" in value);
}
/**
 * Returns true if `value` is of type {@link DateAfter}.
 *
 * @group Utilities
 */
export function isDateAfterType(value) {
    return Boolean(value && typeof value === "object" && "after" in value);
}
/**
 * Returns true if `value` is of type {@link DateBefore}.
 *
 * @group Utilities
 */
export function isDateBeforeType(value) {
    return Boolean(value && typeof value === "object" && "before" in value);
}
/**
 * Returns true if `value` is a {@link DayOfWeek} type.
 *
 * @group Utilities
 */
export function isDayOfWeekType(value) {
    return Boolean(value && typeof value === "object" && "dayOfWeek" in value);
}
/**
 * Returns true if `value` is an array of valid dates.
 *
 * @private
 */
export function isDatesArray(value, dateLib) {
    return Array.isArray(value) && value.every(dateLib.isDate);
}
//# sourceMappingURL=typeguards.js.map