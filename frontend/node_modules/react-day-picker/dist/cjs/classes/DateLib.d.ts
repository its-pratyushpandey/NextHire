import { addDays, addMonths, addWeeks, addYears, differenceInCalendarDays, differenceInCalendarMonths, eachMonthOfInterval, endOfISOWeek, endOfMonth, endOfWeek, endOfYear, format, getISOWeek, getMonth, getWeek, getYear, isAfter, isBefore, isSameDay, isSameMonth, isSameYear, max, min, setMonth, setYear, startOfDay, startOfISOWeek, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import type { EndOfWeekOptions, StartOfWeekOptions, FormatOptions as DateFnsFormatOptions } from "date-fns";
import type { Locale } from "date-fns/locale";
import { endOfBroadcastWeek } from "../helpers/endOfBroadcastWeek.js";
import { startOfBroadcastWeek } from "../helpers/startOfBroadcastWeek.js";
import { Numerals } from "../types/shared.js";
export type { Locale } from "date-fns/locale";
export type { Month as DateFnsMonth } from "date-fns";
/**
 * @ignore
 * @deprecated Use {@link DateLibOptions} instead.
 */
export type FormatOptions = DateLibOptions;
/**
 * @ignore
 * @deprecated Use {@link DateLibOptions} instead.
 */
export type LabelOptions = DateLibOptions;
/**
 * The options for the `DateLib` class.
 *
 * Extends `date-fns` [format](https://date-fns.org/docs/format),
 * [startOfWeek](https://date-fns.org/docs/startOfWeek) and
 * [endOfWeek](https://date-fns.org/docs/endOfWeek) options.
 *
 * @since 9.2.0
 */
export interface DateLibOptions extends DateFnsFormatOptions, StartOfWeekOptions, EndOfWeekOptions {
    /** A constructor for the `Date` object. */
    Date?: typeof Date;
    /** A locale to use for formatting dates. */
    locale?: Locale;
    /**
     * A time zone to use for dates.
     *
     * @since 9.5.0
     */
    timeZone?: string;
    /**
     * The numbering system to use for formatting numbers.
     *
     * @since 9.5.0
     */
    numerals?: Numerals;
}
/**
 * A wrapper class around [date-fns](http://date-fns.org) sharing the same
 * options.
 *
 * @since 9.2.0
 * @example
 *   const dateLib = new DateLib({ locale: es });
 *   const newDate = dateLib.addDays(new Date(), 5);
 */
export declare class DateLib {
    /** The options for the date library. */
    readonly options: DateLibOptions;
    /** Overrides for the date library functions. */
    readonly overrides?: Partial<typeof DateLib.prototype>;
    /**
     * Creates an instance of DateLib.
     *
     * @param options The options for the date library.
     * @param overrides Overrides for the date library functions.
     */
    constructor(options?: DateLibOptions, overrides?: Partial<typeof DateLib.prototype>);
    /**
     * Generate digit map dynamically using Intl.NumberFormat.
     *
     * @since 9.5.0
     */
    private getDigitMap;
    /**
     * Replace Arabic digits with the target numbering system digits.
     *
     * @since 9.5.0
     */
    private replaceDigits;
    /**
     * Format number using the custom numbering system.
     *
     * @since 9.5.0
     * @param value The number to format.
     * @returns The formatted number.
     */
    formatNumber(value: number): string;
    /**
     * Reference to the built-in Date constructor.
     *
     * @deprecated Use `newDate()` or `today()`.
     */
    Date: typeof Date;
    /**
     * Creates a new date object to the today's date.
     *
     * @since 9.5.0
     * @returns The new date object.
     */
    today: () => Date;
    /**
     * Creates a new date object with the specified year, month and date.
     *
     * @since 9.5.0
     * @param year The year.
     * @param monthIndex The month (0-11).
     * @param date The day of the month.
     * @returns The new date object.
     */
    newDate: (year: number, monthIndex: number, date: number) => Date;
    /**
     * Adds the specified number of days to the given date.
     *
     * @param date The date to add days to.
     * @param amount The number of days to add.
     * @returns The new date with the days added.
     */
    addDays: typeof addDays;
    /**
     * Adds the specified number of months to the given date.
     *
     * @param date The date to add months to.
     * @param amount The number of months to add.
     * @returns The new date with the months added.
     */
    addMonths: typeof addMonths;
    /**
     * Adds the specified number of weeks to the given date.
     *
     * @param date The date to add weeks to.
     * @param amount The number of weeks to add.
     * @returns The new date with the weeks added.
     */
    addWeeks: typeof addWeeks;
    /**
     * Adds the specified number of years to the given date.
     *
     * @param date The date to add years to.
     * @param amount The number of years to add.
     * @returns The new date with the years added.
     */
    addYears: typeof addYears;
    /**
     * Returns the number of calendar days between the given dates.
     *
     * @param dateLeft The later date.
     * @param dateRight The earlier date.
     * @returns The number of calendar days between the dates.
     */
    differenceInCalendarDays: typeof differenceInCalendarDays;
    /**
     * Returns the number of calendar months between the given dates.
     *
     * @param dateLeft The later date.
     * @param dateRight The earlier date.
     * @returns The number of calendar months between the dates.
     */
    differenceInCalendarMonths: typeof differenceInCalendarMonths;
    /**
     * Returns the months between the given dates.
     *
     * @param interval The interval to get the months for.
     */
    eachMonthOfInterval: typeof eachMonthOfInterval;
    /**
     * Returns the end of the broadcast week for the given date.
     *
     * @param date The original date.
     * @returns The end of the broadcast week.
     */
    endOfBroadcastWeek: typeof endOfBroadcastWeek;
    /**
     * Returns the end of the ISO week for the given date.
     *
     * @param date The original date.
     * @returns The end of the ISO week.
     */
    endOfISOWeek: typeof endOfISOWeek;
    /**
     * Returns the end of the month for the given date.
     *
     * @param date The original date.
     * @returns The end of the month.
     */
    endOfMonth: typeof endOfMonth;
    /**
     * Returns the end of the week for the given date.
     *
     * @param date The original date.
     * @returns The end of the week.
     */
    endOfWeek: typeof endOfWeek;
    /**
     * Returns the end of the year for the given date.
     *
     * @param date The original date.
     * @returns The end of the year.
     */
    endOfYear: typeof endOfYear;
    /**
     * Formats the given date using the specified format string.
     *
     * @param date The date to format.
     * @param formatStr The format string.
     * @returns The formatted date string.
     */
    format: typeof format;
    /**
     * Returns the ISO week number for the given date.
     *
     * @param date The date to get the ISO week number for.
     * @returns The ISO week number.
     */
    getISOWeek: typeof getISOWeek;
    /**
     * Returns the month of the given date.
     *
     * @param date The date to get the month for.
     * @returns The month.
     */
    getMonth: typeof getMonth;
    /**
     * Returns the year of the given date.
     *
     * @param date The date to get the year for.
     * @returns The year.
     */
    getYear: typeof getYear;
    /**
     * Returns the local week number for the given date.
     *
     * @param date The date to get the week number for.
     * @returns The week number.
     */
    getWeek: typeof getWeek;
    /**
     * Checks if the first date is after the second date.
     *
     * @param date The date to compare.
     * @param dateToCompare The date to compare with.
     * @returns True if the first date is after the second date.
     */
    isAfter: typeof isAfter;
    /**
     * Checks if the first date is before the second date.
     *
     * @param date The date to compare.
     * @param dateToCompare The date to compare with.
     * @returns True if the first date is before the second date.
     */
    isBefore: typeof isBefore;
    /**
     * Checks if the given value is a Date object.
     *
     * @param value The value to check.
     * @returns True if the value is a Date object.
     */
    isDate: (value: unknown) => value is Date;
    /**
     * Checks if the given dates are on the same day.
     *
     * @param dateLeft The first date to compare.
     * @param dateRight The second date to compare.
     * @returns True if the dates are on the same day.
     */
    isSameDay: typeof isSameDay;
    /**
     * Checks if the given dates are in the same month.
     *
     * @param dateLeft The first date to compare.
     * @param dateRight The second date to compare.
     * @returns True if the dates are in the same month.
     */
    isSameMonth: typeof isSameMonth;
    /**
     * Checks if the given dates are in the same year.
     *
     * @param dateLeft The first date to compare.
     * @param dateRight The second date to compare.
     * @returns True if the dates are in the same year.
     */
    isSameYear: typeof isSameYear;
    /**
     * Returns the latest date in the given array of dates.
     *
     * @param dates The array of dates to compare.
     * @returns The latest date.
     */
    max: typeof max;
    /**
     * Returns the earliest date in the given array of dates.
     *
     * @param dates The array of dates to compare.
     * @returns The earliest date.
     */
    min: typeof min;
    /**
     * Sets the month of the given date.
     *
     * @param date The date to set the month on.
     * @param month The month to set (0-11).
     * @returns The new date with the month set.
     */
    setMonth: typeof setMonth;
    /**
     * Sets the year of the given date.
     *
     * @param date The date to set the year on.
     * @param year The year to set.
     * @returns The new date with the year set.
     */
    setYear: typeof setYear;
    /**
     * Returns the start of the broadcast week for the given date.
     *
     * @param date The original date.
     * @returns The start of the broadcast week.
     */
    startOfBroadcastWeek: typeof startOfBroadcastWeek;
    /**
     * Returns the start of the day for the given date.
     *
     * @param date The original date.
     * @returns The start of the day.
     */
    startOfDay: typeof startOfDay;
    /**
     * Returns the start of the ISO week for the given date.
     *
     * @param date The original date.
     * @returns The start of the ISO week.
     */
    startOfISOWeek: typeof startOfISOWeek;
    /**
     * Returns the start of the month for the given date.
     *
     * @param date The original date.
     * @returns The start of the month.
     */
    startOfMonth: typeof startOfMonth;
    /**
     * Returns the start of the week for the given date.
     *
     * @param date The original date.
     * @returns The start of the week.
     */
    startOfWeek: typeof startOfWeek;
    /**
     * Returns the start of the year for the given date.
     *
     * @param date The original date.
     * @returns The start of the year.
     */
    startOfYear: typeof startOfYear;
}
/** The default locale (English). */
export { enUS as defaultLocale } from "date-fns/locale/en-US";
/**
 * The default date library with English locale.
 *
 * @since 9.2.0
 */
export declare const defaultDateLib: DateLib;
/**
 * @ignore
 * @deprecated Use `defaultDateLib`.
 */
export declare const dateLib: DateLib;
