"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextFocus = getNextFocus;
const index_js_1 = require("../classes/index.js");
const dateMatchModifiers_js_1 = require("../utils/dateMatchModifiers.js");
const getFocusableDate_js_1 = require("./getFocusableDate.js");
function getNextFocus(moveBy, moveDir, 
/** The date that is currently focused. */
refDay, calendarStartMonth, calendarEndMonth, props, dateLib, attempt = 0) {
    if (attempt > 365) {
        // Limit the recursion to 365 attempts
        return undefined;
    }
    const focusableDate = (0, getFocusableDate_js_1.getFocusableDate)(moveBy, moveDir, refDay.date, // should be refDay? or refDay.date?
    calendarStartMonth, calendarEndMonth, props, dateLib);
    const isDisabled = Boolean(props.disabled && (0, dateMatchModifiers_js_1.dateMatchModifiers)(focusableDate, props.disabled, dateLib));
    const isHidden = Boolean(props.hidden && (0, dateMatchModifiers_js_1.dateMatchModifiers)(focusableDate, props.hidden, dateLib));
    const targetMonth = focusableDate;
    const focusDay = new index_js_1.CalendarDay(focusableDate, targetMonth, dateLib);
    if (!isDisabled && !isHidden) {
        return focusDay;
    }
    // Recursively attempt to find the next focusable date
    return getNextFocus(moveBy, moveDir, focusDay, calendarStartMonth, calendarEndMonth, props, dateLib, attempt + 1);
}
//# sourceMappingURL=getNextFocus.js.map