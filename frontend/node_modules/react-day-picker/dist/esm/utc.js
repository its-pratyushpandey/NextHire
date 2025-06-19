import React from "react";
import { DayPicker as DayPickerComponent } from "./index.js";
export function DayPicker(props) {
    return React.createElement(DayPickerComponent, { timeZone: "utc", ...props });
}
//# sourceMappingURL=utc.js.map