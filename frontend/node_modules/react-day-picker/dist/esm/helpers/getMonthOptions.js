/** Return the months to show in the dropdown. */
export function getMonthOptions(displayMonth, navStart, navEnd, formatters, dateLib) {
    const { startOfMonth, startOfYear, endOfYear, eachMonthOfInterval, getMonth } = dateLib;
    const months = eachMonthOfInterval({
        start: startOfYear(displayMonth),
        end: endOfYear(displayMonth)
    });
    const options = months.map((month) => {
        const label = formatters.formatMonthDropdown(month, dateLib);
        const value = getMonth(month);
        const disabled = (navStart && month < startOfMonth(navStart)) ||
            (navEnd && month > startOfMonth(navEnd)) ||
            false;
        return { value, label, disabled };
    });
    return options;
}
//# sourceMappingURL=getMonthOptions.js.map