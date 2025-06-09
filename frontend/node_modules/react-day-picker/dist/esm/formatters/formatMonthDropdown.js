import { defaultDateLib } from "../classes/DateLib.js";
/**
 * Format the month number for the dropdown option label.
 *
 * @defaultValue The localized month name
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
export function formatMonthDropdown(month, dateLib = defaultDateLib) {
    return dateLib.format(month, "LLLL");
}
//# sourceMappingURL=formatMonthDropdown.js.map