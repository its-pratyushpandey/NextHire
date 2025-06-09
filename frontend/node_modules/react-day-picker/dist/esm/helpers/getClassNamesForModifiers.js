import { DayFlag, SelectionState, UI } from "../UI.js";
export function getClassNamesForModifiers(modifiers, classNames, modifiersClassNames = {}) {
    const modifierClassNames = Object.entries(modifiers)
        .filter(([, active]) => active === true)
        .reduce((previousValue, [key]) => {
        if (modifiersClassNames[key]) {
            previousValue.push(modifiersClassNames[key]);
        }
        else if (classNames[DayFlag[key]]) {
            previousValue.push(classNames[DayFlag[key]]);
        }
        else if (classNames[SelectionState[key]]) {
            previousValue.push(classNames[SelectionState[key]]);
        }
        return previousValue;
    }, [classNames[UI.Day]]);
    return modifierClassNames;
}
//# sourceMappingURL=getClassNamesForModifiers.js.map