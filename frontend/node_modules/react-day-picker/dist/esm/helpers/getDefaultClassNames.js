import { UI, DayFlag, SelectionState, Animation } from "../UI.js";
/**
 * Get the default class names for the UI elements.
 *
 * @group Utilities
 */
export function getDefaultClassNames() {
    const classNames = {};
    for (const key in UI) {
        classNames[UI[key]] =
            `rdp-${UI[key]}`;
    }
    for (const key in DayFlag) {
        classNames[DayFlag[key]] =
            `rdp-${DayFlag[key]}`;
    }
    for (const key in SelectionState) {
        classNames[SelectionState[key]] =
            `rdp-${SelectionState[key]}`;
    }
    for (const key in Animation) {
        classNames[Animation[key]] =
            `rdp-${Animation[key]}`;
    }
    return classNames;
}
//# sourceMappingURL=getDefaultClassNames.js.map