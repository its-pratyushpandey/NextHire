import { DateLib } from "../classes/DateLib.js";
/**
 * Format the day date shown in the day cell.
 *
 * @defaultValue `d` (e.g. "1")
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
export function formatDay(date, options, dateLib) {
    return (dateLib ?? new DateLib(options)).format(date, "d");
}
//# sourceMappingURL=formatDay.js.map