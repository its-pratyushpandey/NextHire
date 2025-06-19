import React from "react";
/**
 * Render the gridcell of a day in the calendar and handle the interaction and
 * the focus with they day.
 *
 * If you need to just change the content of the day cell, consider swapping the
 * `DayButton` component instead.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Day(props) {
    const { day, modifiers, ...tdProps } = props;
    return React.createElement("td", { ...tdProps });
}
//# sourceMappingURL=Day.js.map