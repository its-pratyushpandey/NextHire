"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetModifiers = useGetModifiers;
const UI_js_1 = require("./UI.js");
const dateMatchModifiers_js_1 = require("./utils/dateMatchModifiers.js");
/**
 * Return a function to get the modifiers for a given day.
 *
 * NOTE: this is not an hook, but a factory for `getModifiers`.
 *
 * @private
 */
function useGetModifiers(days, props, dateLib) {
    const { disabled, hidden, modifiers, showOutsideDays, broadcastCalendar, today } = props;
    const { isSameDay, isSameMonth, startOfMonth, isBefore, endOfMonth, isAfter } = dateLib;
    const startMonth = props.startMonth && startOfMonth(props.startMonth);
    const endMonth = props.endMonth && endOfMonth(props.endMonth);
    const internalModifiersMap = {
        [UI_js_1.DayFlag.focused]: [],
        [UI_js_1.DayFlag.outside]: [],
        [UI_js_1.DayFlag.disabled]: [],
        [UI_js_1.DayFlag.hidden]: [],
        [UI_js_1.DayFlag.today]: []
    };
    const customModifiersMap = {};
    for (const day of days) {
        const { date, displayMonth } = day;
        const isOutside = Boolean(displayMonth && !isSameMonth(date, displayMonth));
        const isBeforeStartMonth = Boolean(startMonth && isBefore(date, startMonth));
        const isAfterEndMonth = Boolean(endMonth && isAfter(date, endMonth));
        const isDisabled = Boolean(disabled && (0, dateMatchModifiers_js_1.dateMatchModifiers)(date, disabled, dateLib));
        const isHidden = Boolean(hidden && (0, dateMatchModifiers_js_1.dateMatchModifiers)(date, hidden, dateLib)) ||
            isBeforeStartMonth ||
            isAfterEndMonth ||
            // Broadcast calendar will show outside days as default
            (!broadcastCalendar && !showOutsideDays && isOutside) ||
            (broadcastCalendar && showOutsideDays === false && isOutside);
        const isToday = isSameDay(date, today ?? dateLib.today());
        if (isOutside)
            internalModifiersMap.outside.push(day);
        if (isDisabled)
            internalModifiersMap.disabled.push(day);
        if (isHidden)
            internalModifiersMap.hidden.push(day);
        if (isToday)
            internalModifiersMap.today.push(day);
        // Add custom modifiers
        if (modifiers) {
            Object.keys(modifiers).forEach((name) => {
                const modifierValue = modifiers?.[name];
                const isMatch = modifierValue
                    ? (0, dateMatchModifiers_js_1.dateMatchModifiers)(date, modifierValue, dateLib)
                    : false;
                if (!isMatch)
                    return;
                if (customModifiersMap[name]) {
                    customModifiersMap[name].push(day);
                }
                else {
                    customModifiersMap[name] = [day];
                }
            });
        }
    }
    return (day) => {
        // Initialize all the modifiers to false
        const dayFlags = {
            [UI_js_1.DayFlag.focused]: false,
            [UI_js_1.DayFlag.disabled]: false,
            [UI_js_1.DayFlag.hidden]: false,
            [UI_js_1.DayFlag.outside]: false,
            [UI_js_1.DayFlag.today]: false
        };
        const customModifiers = {};
        // Find the modifiers for the given day
        for (const name in internalModifiersMap) {
            const days = internalModifiersMap[name];
            dayFlags[name] = days.some((d) => d === day);
        }
        for (const name in customModifiersMap) {
            customModifiers[name] = customModifiersMap[name].some((d) => d === day);
        }
        return {
            ...dayFlags,
            // custom modifiers should override all the previous ones
            ...customModifiers
        };
    };
}
//# sourceMappingURL=useGetModifiers.js.map