"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassNamesForModifiers = getClassNamesForModifiers;
const UI_js_1 = require("../UI.js");
function getClassNamesForModifiers(modifiers, classNames, modifiersClassNames = {}) {
    const modifierClassNames = Object.entries(modifiers)
        .filter(([, active]) => active === true)
        .reduce((previousValue, [key]) => {
        if (modifiersClassNames[key]) {
            previousValue.push(modifiersClassNames[key]);
        }
        else if (classNames[UI_js_1.DayFlag[key]]) {
            previousValue.push(classNames[UI_js_1.DayFlag[key]]);
        }
        else if (classNames[UI_js_1.SelectionState[key]]) {
            previousValue.push(classNames[UI_js_1.SelectionState[key]]);
        }
        return previousValue;
    }, [classNames[UI_js_1.UI.Day]]);
    return modifierClassNames;
}
//# sourceMappingURL=getClassNamesForModifiers.js.map