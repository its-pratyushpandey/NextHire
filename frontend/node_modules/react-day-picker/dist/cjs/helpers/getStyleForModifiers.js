"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleForModifiers = getStyleForModifiers;
const UI_js_1 = require("../UI.js");
function getStyleForModifiers(dayModifiers, styles = {}, modifiersStyles = {}) {
    let style = { ...styles?.[UI_js_1.UI.Day] };
    Object.entries(dayModifiers)
        .filter(([, active]) => active === true)
        .forEach(([modifier]) => {
        style = {
            ...style,
            ...modifiersStyles?.[modifier]
        };
    });
    return style;
}
//# sourceMappingURL=getStyleForModifiers.js.map