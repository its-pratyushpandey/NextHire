import { DateLib } from "../classes/DateLib.js";
/**
 * The label for the day gridcell when the calendar is not interactive.
 *
 * @group Labels
 * @see https://daypicker.dev/docs/translation#aria-labels
 */
export function labelGridcell(date, 
/** The modifiers for the day. */
modifiers, options, dateLib) {
    let label = (dateLib ?? new DateLib(options)).format(date, "PPPP");
    if (modifiers?.today) {
        label = `Today, ${label}`;
    }
    return label;
}
//# sourceMappingURL=labelGridcell.js.map