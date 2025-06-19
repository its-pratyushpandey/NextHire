import React from "react";
/**
 * Render the caption of a month in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function MonthCaption(props) {
    const { calendarMonth, displayIndex, ...divProps } = props;
    return React.createElement("div", { ...divProps });
}
//# sourceMappingURL=MonthCaption.js.map