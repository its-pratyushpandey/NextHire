"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatYearCaption = void 0;
exports.formatYearDropdown = formatYearDropdown;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * Format the years for the dropdown option label.
 *
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
function formatYearDropdown(year, dateLib = DateLib_js_1.defaultDateLib) {
    return dateLib.format(year, "yyyy");
}
/**
 * @private
 * @deprecated Use `formatYearDropdown` instead.
 * @group Formatters
 */
exports.formatYearCaption = formatYearDropdown;
//# sourceMappingURL=formatYearDropdown.js.map