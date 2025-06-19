"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonths = getMonths;
const index_js_1 = require("../classes/index.js");
/** Return the months to display in the calendar. */
function getMonths(
/** The months (as dates) to display in the calendar. */
displayMonths, 
/** The dates to display in the calendar. */
dates, 
/** Options from the props context. */
props, dateLib) {
    const { addDays, endOfBroadcastWeek, endOfISOWeek, endOfMonth, endOfWeek, getISOWeek, getWeek, startOfBroadcastWeek, startOfISOWeek, startOfWeek } = dateLib;
    const dayPickerMonths = displayMonths.reduce((months, month) => {
        const firstDateOfFirstWeek = props.broadcastCalendar
            ? startOfBroadcastWeek(month, dateLib)
            : props.ISOWeek
                ? startOfISOWeek(month)
                : startOfWeek(month);
        const lastDateOfLastWeek = props.broadcastCalendar
            ? endOfBroadcastWeek(month, dateLib)
            : props.ISOWeek
                ? endOfISOWeek(endOfMonth(month))
                : endOfWeek(endOfMonth(month));
        /** The dates to display in the month. */
        const monthDates = dates.filter((date) => {
            return date >= firstDateOfFirstWeek && date <= lastDateOfLastWeek;
        });
        const nrOfDaysWithFixedWeeks = props.broadcastCalendar ? 35 : 42;
        if (props.fixedWeeks && monthDates.length < nrOfDaysWithFixedWeeks) {
            const extraDates = dates.filter((date) => {
                const daysToAdd = nrOfDaysWithFixedWeeks - monthDates.length;
                return (date > lastDateOfLastWeek &&
                    date <= addDays(lastDateOfLastWeek, daysToAdd));
            });
            monthDates.push(...extraDates);
        }
        const weeks = monthDates.reduce((weeks, date) => {
            const weekNumber = props.ISOWeek ? getISOWeek(date) : getWeek(date);
            const week = weeks.find((week) => week.weekNumber === weekNumber);
            const day = new index_js_1.CalendarDay(date, month, dateLib);
            if (!week) {
                weeks.push(new index_js_1.CalendarWeek(weekNumber, [day]));
            }
            else {
                week.days.push(day);
            }
            return weeks;
        }, []);
        const dayPickerMonth = new index_js_1.CalendarMonth(month, weeks);
        months.push(dayPickerMonth);
        return months;
    }, []);
    if (!props.reverseMonths) {
        return dayPickerMonths;
    }
    else {
        return dayPickerMonths.reverse();
    }
}
//# sourceMappingURL=getMonths.js.map