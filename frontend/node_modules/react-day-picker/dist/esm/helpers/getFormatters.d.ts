import * as defaultFormatters from "../formatters/index.js";
import type { DayPickerProps } from "../types/index.js";
/** Return the formatters from the props merged with the default formatters. */
export declare function getFormatters(customFormatters: DayPickerProps["formatters"]): {
    formatCaption: typeof defaultFormatters.formatCaption;
    formatDay: typeof defaultFormatters.formatDay;
    formatMonthDropdown: typeof defaultFormatters.formatMonthDropdown;
    formatMonthCaption: typeof defaultFormatters.formatMonthCaption;
    formatWeekNumber: typeof defaultFormatters.formatWeekNumber;
    formatWeekNumberHeader: typeof defaultFormatters.formatWeekNumberHeader;
    formatWeekdayName: typeof defaultFormatters.formatWeekdayName;
    formatYearDropdown: typeof defaultFormatters.formatYearDropdown;
    formatYearCaption: typeof defaultFormatters.formatYearCaption;
};
