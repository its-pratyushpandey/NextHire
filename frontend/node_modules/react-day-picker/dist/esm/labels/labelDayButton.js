import { DateLib } from "../classes/DateLib.js";
/**
 * The ARIA label for the day button.
 *
 * Use the `modifiers` argument to add additional context to the label, e.g.
 * when a day is selected or is today.
 *
 * @defaultValue The formatted date.
 * @group Labels
 * @see https://daypicker.dev/docs/translation#aria-labels
 */
export function labelDayButton(date, 
/** The modifiers for the day. */
modifiers, options, dateLib) {
    let label = (dateLib ?? new DateLib(options)).format(date, "PPPP");
    if (modifiers.today)
        label = `Today, ${label}`;
    if (modifiers.selected)
        label = `${label}, selected`;
    return label;
}
/**
 * @ignore
 * @deprecated Use `labelDayButton` instead.
 */
export const labelDay = labelDayButton;
//# sourceMappingURL=labelDayButton.js.map