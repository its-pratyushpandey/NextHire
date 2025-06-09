"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearOptions = getYearOptions;
/** Return the years to show in the dropdown. */
function getYearOptions(navStart, navEnd, formatters, dateLib) {
    if (!navStart)
        return undefined;
    if (!navEnd)
        return undefined;
    const { startOfYear, endOfYear, addYears, getYear, isBefore, isSameYear } = dateLib;
    const firstNavYear = startOfYear(navStart);
    const lastNavYear = endOfYear(navEnd);
    const years = [];
    let year = firstNavYear;
    while (isBefore(year, lastNavYear) || isSameYear(year, lastNavYear)) {
        years.push(year);
        year = addYears(year, 1);
    }
    return years.map((year) => {
        const label = formatters.formatYearDropdown(year, dateLib);
        return {
            value: getYear(year),
            label,
            disabled: false
        };
    });
}
//# sourceMappingURL=getYearOptions.js.map