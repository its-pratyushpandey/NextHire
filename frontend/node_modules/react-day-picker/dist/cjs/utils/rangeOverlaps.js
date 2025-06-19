"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeOverlaps = rangeOverlaps;
const index_js_1 = require("../classes/index.js");
const rangeIncludesDate_js_1 = require("./rangeIncludesDate.js");
/**
 * Determines whether a given range overlaps with another range.
 *
 * @since 9.2.2
 * @group Utilities
 */
function rangeOverlaps(rangeLeft, rangeRight, dateLib = index_js_1.defaultDateLib) {
    return ((0, rangeIncludesDate_js_1.rangeIncludesDate)(rangeLeft, rangeRight.from, false, dateLib) ||
        (0, rangeIncludesDate_js_1.rangeIncludesDate)(rangeLeft, rangeRight.to, false, dateLib) ||
        (0, rangeIncludesDate_js_1.rangeIncludesDate)(rangeRight, rangeLeft.from, false, dateLib) ||
        (0, rangeIncludesDate_js_1.rangeIncludesDate)(rangeRight, rangeLeft.to, false, dateLib));
}
//# sourceMappingURL=rangeOverlaps.js.map