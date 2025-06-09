"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingle = useSingle;
const useControlledValue_js_1 = require("../helpers/useControlledValue.js");
function useSingle(props, dateLib) {
    const { selected: initiallySelected, required, onSelect } = props;
    const [internallySelected, setSelected] = (0, useControlledValue_js_1.useControlledValue)(initiallySelected, onSelect ? initiallySelected : undefined);
    const selected = !onSelect ? internallySelected : initiallySelected;
    const { isSameDay } = dateLib;
    const isSelected = (compareDate) => {
        return selected ? isSameDay(selected, compareDate) : false;
    };
    const select = (triggerDate, modifiers, e) => {
        let newDate = triggerDate;
        if (!required && selected && selected && isSameDay(triggerDate, selected)) {
            // If the date is the same, clear the selection.
            newDate = undefined;
        }
        if (!onSelect) {
            setSelected(newDate);
        }
        if (required) {
            onSelect?.(newDate, triggerDate, modifiers, e);
        }
        else {
            onSelect?.(newDate, triggerDate, modifiers, e);
        }
        return newDate;
    };
    return {
        selected,
        select,
        isSelected
    };
}
//# sourceMappingURL=useSingle.js.map