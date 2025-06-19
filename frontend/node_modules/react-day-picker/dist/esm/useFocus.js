import { useState } from "react";
import { calculateFocusTarget } from "./helpers/calculateFocusTarget.js";
import { getNextFocus } from "./helpers/getNextFocus.js";
/** @private */
export function useFocus(props, calendar, getModifiers, isSelected, dateLib) {
    const { autoFocus } = props;
    const [lastFocused, setLastFocused] = useState();
    const focusTarget = calculateFocusTarget(calendar.days, getModifiers, isSelected || (() => false), lastFocused);
    const [focusedDay, setFocused] = useState(autoFocus ? focusTarget : undefined);
    const blur = () => {
        setLastFocused(focusedDay);
        setFocused(undefined);
    };
    const moveFocus = (moveBy, moveDir) => {
        if (!focusedDay)
            return;
        const nextFocus = getNextFocus(moveBy, moveDir, focusedDay, calendar.navStart, calendar.navEnd, props, dateLib);
        if (!nextFocus)
            return;
        calendar.goToDay(nextFocus);
        setFocused(nextFocus);
    };
    const isFocusTarget = (day) => {
        return Boolean(focusTarget?.isEqualTo(day));
    };
    const useFocus = {
        isFocusTarget,
        setFocused,
        focused: focusedDay,
        blur,
        moveFocus
    };
    return useFocus;
}
//# sourceMappingURL=useFocus.js.map