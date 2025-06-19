import { DateLib } from "../classes/DateLib.js";
/**
 * Format the weekday name to be displayed in the weekdays header.
 *
 * @defaultValue `cccccc` (e.g. "Mo" for Monday)
 * @group Formatters
 * @see https://daypicker.dev/docs/translation#custom-formatters
 */
export function formatWeekdayName(weekday, options, dateLib) {
    return (dateLib ?? new DateLib(options)).format(weekday, "cccccc");
}
//# sourceMappingURL=formatWeekdayName.js.map