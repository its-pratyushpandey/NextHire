import React from "react";
import * as dateFnsJalali from "date-fns-jalali";
import * as locales from "date-fns-jalali/locale";
import { DateLib, DayPicker as DayPickerComponent } from "./index.js";
export const faIR = locales.faIR;
export const enUS = locales.enUS;
/**
 * Render the Persian Calendar.
 *
 * @see https://daypicker.dev/docs/localization#persian-calendar
 */
export function DayPicker(props) {
    const dateLib = getDateLib({
        locale: props.locale,
        weekStartsOn: props.broadcastCalendar ? 1 : props.weekStartsOn,
        firstWeekContainsDate: props.firstWeekContainsDate,
        useAdditionalWeekYearTokens: props.useAdditionalWeekYearTokens,
        useAdditionalDayOfYearTokens: props.useAdditionalDayOfYearTokens,
        timeZone: props.timeZone
    });
    return (React.createElement(DayPickerComponent, { ...props, locale: props.locale ?? faIR, numerals: props.numerals ?? "arabext", dir: props.dir ?? "rtl", dateLib: dateLib }));
}
/** Returns the date library used in the calendar. */
export const getDateLib = (options) => {
    return new DateLib(options, dateFnsJalali);
};
//# sourceMappingURL=persian.js.map