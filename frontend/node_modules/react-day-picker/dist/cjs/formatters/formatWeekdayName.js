"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWeekdayName = formatWeekdayName;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * Format the weekday name to be displayed in the weekdays header.
 *
 * @defaultValue `cccccc` (e.g. "Mo" for Monday)
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
function formatWeekdayName(weekday, options, dateLib) {
    return (dateLib ?? new DateLib_js_1.DateLib(options)).format(weekday, "cccccc");
}
//# sourceMappingURL=formatWeekdayName.js.map