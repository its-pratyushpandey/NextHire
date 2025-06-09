import { createContext, useContext } from "react";
/** @ignore */
export const dayPickerContext = createContext(undefined);
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
export function useDayPicker() {
    const context = useContext(dayPickerContext);
    if (context === undefined) {
        throw new Error("useDayPicker() must be used within a custom component.");
    }
    return context;
}
//# sourceMappingURL=useDayPicker.js.map