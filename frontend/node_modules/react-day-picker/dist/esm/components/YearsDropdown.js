import React from "react";
import { useDayPicker } from "../useDayPicker.js";
/**
 * Render the dropdown to navigate between years.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function YearsDropdown(props) {
    const { components } = useDayPicker();
    return React.createElement(components.Dropdown, { ...props });
}
//# sourceMappingURL=YearsDropdown.js.map