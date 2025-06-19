"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelCaption = void 0;
exports.labelGrid = labelGrid;
const DateLib_js_1 = require("../classes/DateLib.js");
/**
 * The ARIA label for the month grid, that will be announced when entering the
 * grid.
 *
 * @defaultValue `LLLL y` (e.g. "November 2022")
 * @group Labels
 * @see https://daypicker.dev/docs/translation#aria-labels
 */
function labelGrid(date, options, dateLib) {
    return (dateLib ?? new DateLib_js_1.DateLib(options)).format(date, "LLLL y");
}
/**
 * @ignore
 * @deprecated Use {@link labelGrid} instead.
 */
exports.labelCaption = labelGrid;
//# sourceMappingURL=labelGrid.js.map