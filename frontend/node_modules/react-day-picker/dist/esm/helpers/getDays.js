/**
 * Returns all the days belonging to the calendar by merging the days in the
 * weeks for each month.
 *
 * @param calendarMonths The array of calendar months.
 * @returns An array of `CalendarDay` objects representing all the days in the
 *   calendar.
 */
export function getDays(calendarMonths) {
    const initialDays = [];
    return calendarMonths.reduce((days, month) => {
        const weekDays = month.weeks.reduce((weekDays, week) => {
            return [...weekDays, ...week.days];
        }, initialDays);
        return [...days, ...weekDays];
    }, initialDays);
}
//# sourceMappingURL=getDays.js.map