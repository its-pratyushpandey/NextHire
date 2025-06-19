import React from "react";
/**
 * Render the root element.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Root(props) {
    const { rootRef, ...rest } = props;
    return React.createElement("div", { ...rest, ref: rootRef });
}
//# sourceMappingURL=Root.js.map