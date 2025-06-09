import * as defaultFormatters from "../formatters/index.js";
/** Return the formatters from the props merged with the default formatters. */
export function getFormatters(customFormatters) {
    if (customFormatters?.formatMonthCaption && !customFormatters.formatCaption) {
        customFormatters.formatCaption = customFormatters.formatMonthCaption;
    }
    if (customFormatters?.formatYearCaption &&
        !customFormatters.formatYearDropdown) {
        customFormatters.formatYearDropdown = customFormatters.formatYearCaption;
    }
    return {
        ...defaultFormatters,
        ...customFormatters
    };
}
//# sourceMappingURL=getFormatters.js.map