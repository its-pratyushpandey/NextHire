"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMonthCaption = void 0;
exports.formatCaption = formatCaption;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * Format the caption of the month.
 *
 * @defaultValue `LLLL y` (e.g. "November 2022")
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
function formatCaption(month, options, dateLib) {
    return (dateLib ?? new DateLib_js_1.DateLib(options)).format(month, "LLLL y");
}
/**
 * @private
 * @deprecated Use {@link formatCaption} instead.
 * @group Formatters
 */
exports.formatMonthCaption = formatCaption;
//# sourceMappingURL=formatCaption.js.map