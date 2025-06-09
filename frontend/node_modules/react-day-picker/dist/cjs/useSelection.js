"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelection = useSelection;
const useMulti_js_1 = require("./selection/useMulti.js");
const useRange_js_1 = require("./selection/useRange.js");
const useSingle_js_1 = require("./selection/useSingle.js");
function useSelection(props, dateLib) {
    const single = (0, useSingle_js_1.useSingle)(props, dateLib);
    const multi = (0, useMulti_js_1.useMulti)(props, dateLib);
    const range = (0, useRange_js_1.useRange)(props, dateLib);
    switch (props.mode) {
        case "single":
            return single;
        case "multiple":
            return multi;
        case "range":
            return range;
        default:
            return undefined;
    }
}
//# sourceMappingURL=useSelection.js.map