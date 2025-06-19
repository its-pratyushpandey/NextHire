import { useControlledValue } from "../helpers/useControlledValue.js";
import { addToRange, rangeContainsModifiers } from "../utils/index.js";
import { rangeIncludesDate } from "../utils/rangeIncludesDate.js";
export function useRange(props, dateLib) {
    const { disabled, excludeDisabled, selected: initiallySelected, required, onSelect } = props;
    const [internallySelected, setSelected] = useControlledValue(initiallySelected, onSelect ? initiallySelected : undefined);
    const selected = !onSelect ? internallySelected : initiallySelected;
    const isSelected = (date) => selected && rangeIncludesDate(selected, date, false, dateLib);
    const select = (triggerDate, modifiers, e) => {
        const { min, max } = props;
        const newRange = triggerDate
            ? addToRange(triggerDate, selected, min, max, required, dateLib)
            : undefined;
        if (excludeDisabled && disabled && newRange?.from && newRange.to) {
            if (rangeContainsModifiers({ from: newRange.from, to: newRange.to }, disabled, dateLib)) {
                // if a disabled days is found, the range is reset
                newRange.from = triggerDate;
                newRange.to = undefined;
            }
        }
        if (!onSelect) {
            setSelected(newRange);
        }
        onSelect?.(newRange, triggerDate, modifiers, e);
        return newRange;
    };
    return {
        selected,
        select,
        isSelected
    };
}
//# sourceMappingURL=useRange.js.map