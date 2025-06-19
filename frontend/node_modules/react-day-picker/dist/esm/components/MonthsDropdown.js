import React from "react";
import { useDayPicker } from "../useDayPicker.js";
/**
 * Render the dropdown to navigate between months.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function MonthsDropdown(props) {
    const { components } = useDayPicker();
    return React.createElement(components.Dropdown, { ...props });
}
//# sourceMappingURL=MonthsDropdown.js.map