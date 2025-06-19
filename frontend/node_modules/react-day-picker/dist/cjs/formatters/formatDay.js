"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDay = formatDay;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * Format the day date shown in the day cell.
 *
 * @defaultValue `d` (e.g. "1")
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
function formatDay(date, options, dateLib) {
    return (dateLib ?? new DateLib_js_1.DateLib(options)).format(date, "d");
}
//# sourceMappingURL=formatDay.js.map