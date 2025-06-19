import React from "react";
/**
 * Render a row in the calendar, with the days and the week number.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Week(props) {
    const { week, ...trProps } = props;
    return React.createElement("tr", { ...trProps });
}
//# sourceMappingURL=Week.js.map