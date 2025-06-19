"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endOfBroadcastWeek = endOfBroadcastWeek;
const getBroadcastWeeksInMonth_js_1 = require("./getBroadcastWeeksInMonth.js");
const startOfBroadcastWeek_js_1 = require("./startOfBroadcastWeek.js");
/**
 * Return the end date of the week in the broadcast calendar.
 *
 * @since 9.4.0
 */
function endOfBroadcastWeek(date, dateLib) {
    const startDate = (0, startOfBroadcastWeek_js_1.startOfBroadcastWeek)(date, dateLib);
    const numberOfWeeks = (0, getBroadcastWeeksInMonth_js_1.getBroadcastWeeksInMonth)(date, dateLib);
    const endDate = dateLib.addDays(startDate, numberOfWeeks * 7 - 1);
    return endDate;
}
//# sourceMappingURL=endOfBroadcastWeek.js.map