"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelWeekday = labelWeekday;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * The ARIA label for the Weekday column header.
 *
 * @defaultValue `"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"`
 * @group Labels
 * @see https://daypicker.dev/docs/translation#aria-labels
 */
function labelWeekday(date, options, dateLib) {
    return (dateLib ?? new DateLib_js_1.DateLib(options)).format(date, "cccc");
}
//# sourceMappingURL=labelWeekday.js.map