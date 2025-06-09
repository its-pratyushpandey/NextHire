"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFocusTarget = calculateFocusTarget;
const UI_js_1 = require("../UI.js");
var FocusTargetPriority;
(function (FocusTargetPriority) {
    FocusTargetPriority[FocusTargetPriority["Today"] = 0] = "Today";
    FocusTargetPriority[FocusTargetPriority["Selected"] = 1] = "Selected";
    FocusTargetPriority[FocusTargetPriority["LastFocused"] = 2] = "LastFocused";
    FocusTargetPriority[FocusTargetPriority["FocusedModifier"] = 3] = "FocusedModifier";
})(FocusTargetPriority || (FocusTargetPriority = {}));
function isFocusableDay(modifiers) {
    return (!modifiers[UI_js_1.DayFlag.disabled] &&
        !modifiers[UI_js_1.DayFlag.hidden] &&
        !modifiers[UI_js_1.DayFlag.outside]);
}
function calculateFocusTarget(days, getModifiers, isSelected, lastFocused) {
    let focusTarget;
    let foundFocusTargetPriority = -1;
    for (const day of days) {
        const modifiers = getModifiers(day);
        if (isFocusableDay(modifiers)) {
            if (modifiers[UI_js_1.DayFlag.focused] &&
                foundFocusTargetPriority < FocusTargetPriority.FocusedModifier) {
                focusTarget = day;
                foundFocusTargetPriority = FocusTargetPriority.FocusedModifier;
            }
            else if (lastFocused?.isEqualTo(day) &&
                foundFocusTargetPriority < FocusTargetPriority.LastFocused) {
                focusTarget = day;
                foundFocusTargetPriority = FocusTargetPriority.LastFocused;
            }
            else if (isSelected(day.date) &&
                foundFocusTargetPriority < FocusTargetPriority.Selected) {
                focusTarget = day;
                foundFocusTargetPriority = FocusTargetPriority.Selected;
            }
            else if (modifiers[UI_js_1.DayFlag.today] &&
                foundFocusTargetPriority < FocusTargetPriority.Today) {
                focusTarget = day;
                foundFocusTargetPriority = FocusTargetPriority.Today;
            }
        }
    }
    if (!focusTarget) {
        // return the first day that is focusable
        focusTarget = days.find((day) => isFocusableDay(getModifiers(day)));
    }
    return focusTarget;
}
//# sourceMappingURL=calculateFocusTarget.js.map