import React from "react";
import { useDayPicker } from "../useDayPicker.js";
/**
 * Render the previous month button element in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function PreviousMonthButton(props) {
    const { components } = useDayPicker();
    return React.createElement(components.Button, { ...props });
}
//# sourceMappingURL=PreviousMonthButton.js.map