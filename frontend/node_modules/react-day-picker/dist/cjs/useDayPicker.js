"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayPickerContext = void 0;
exports.useDayPicker = useDayPicker;
const react_1 = require("react");
/** @ignore */
exports.dayPickerContext = (0, react_1.createContext)(undefined);
/**
 * Returns the context to work with `<DayPicker />` inside custom components.
 *
 * This hook provides access to the DayPicker context, which includes various
 * properties and methods to interact with the DayPicker component. It must be
 * used within a custom component.
 *
 * @template T - Use this type to refine the returned context type with a
 *   specific selection mode.
 * @returns {DayPickerContext<T>} The context to work with DayPicker.
 * @throws {Error} If the hook is used outside of a DayPicker provider.
 * @group Hooks
 * @see https://daypicker.dev/guides/custom-components
 */
function useDayPicker() {
    const context = (0, react_1.useContext)(exports.dayPickerContext);
    if (context === undefined) {
        throw new Error("useDayPicker() must be used within a custom component.");
    }
    return context;
}
//# sourceMappingURL=useDayPicker.js.map