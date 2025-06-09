"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialMonth = getInitialMonth;
const tz_1 = require("@date-fns/tz");
/** Return the start month based on the props passed to DayPicker. */
function getInitialMonth(props, dateLib) {
    const { month, defaultMonth, today = dateLib.today(), numberOfMonths = 1, endMonth, startMonth, timeZone } = props;
    let initialMonth = month || defaultMonth || today;
    const { differenceInCalendarMonths, addMonths, startOfMonth } = dateLib;
    // Fix the initialMonth if is after the endMonth
    if (endMonth && differenceInCalendarMonths(endMonth, initialMonth) < 0) {
        const offset = -1 * (numberOfMonths - 1);
        initialMonth = addMonths(endMonth, offset);
    }
    // Fix the initialMonth if is before the startMonth
    if (startMonth && differenceInCalendarMonths(initialMonth, startMonth) < 0) {
        initialMonth = startMonth;
    }
    // When timeZone is provided, convert initialMonth to TZDate type to ensure proper timezone handling
    initialMonth = timeZone ? new tz_1.TZDate(initialMonth, timeZone) : initialMonth;
    return startOfMonth(initialMonth);
}
//# sourceMappingURL=getInitialMonth.js.map