"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMonthDropdown = formatMonthDropdown;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * Format the month number for the dropdown option label.
 *
 * @defaultValue The localized month name
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
function formatMonthDropdown(month, dateLib = DateLib_js_1.defaultDateLib) {
    return dateLib.format(month, "LLLL");
}
//# sourceMappingURL=formatMonthDropdown.js.map