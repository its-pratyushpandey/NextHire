/**
 * Generate a series of 7 days, starting from the week, to use for formatting
 * the weekday names (Monday, Tuesday, etc.).
 */
export function getWeekdays(
/** The date library. */
dateLib, 
/** Use ISOWeek instead of locale/ */
ISOWeek, 
/** @since 9.4.0 */
broadcastCalendar) {
    const today = dateLib.today();
    const start = broadcastCalendar
        ? dateLib.startOfBroadcastWeek(today, dateLib)
        : ISOWeek
            ? dateLib.startOfISOWeek(today)
            : dateLib.startOfWeek(today);
    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = dateLib.addDays(start, i);
        days.push(day);
    }
    return days;
}
//# sourceMappingURL=getWeekdays.js.map