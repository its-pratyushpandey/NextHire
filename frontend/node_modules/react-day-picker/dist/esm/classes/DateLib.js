import { TZDate } from "@date-fns/tz";
import { addDays, addMonths, addWeeks, addYears, differenceInCalendarDays, differenceInCalendarMonths, eachMonthOfInterval, endOfISOWeek, endOfMonth, endOfWeek, endOfYear, format, getISOWeek, getMonth, getWeek, getYear, isAfter, isBefore, isDate, isSameDay, isSameMonth, isSameYear, max, min, setMonth, setYear, startOfDay, startOfISOWeek, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { endOfBroadcastWeek } from "../helpers/endOfBroadcastWeek.js";
import { startOfBroadcastWeek } from "../helpers/startOfBroadcastWeek.js";
/**
 * A wrapper class around [date-fns](http://date-fns.org) sharing the same
 * options.
 *
 * @since 9.2.0
 * @example
 *   const dateLib = new DateLib({ locale: es });
 *   const newDate = dateLib.addDays(new Date(), 5);
 */
export class DateLib {
    /**
     * Creates an instance of DateLib.
     *
     * @param options The options for the date library.
     * @param overrides Overrides for the date library functions.
     */
    constructor(options, overrides) {
        /**
         * Reference to the built-in Date constructor.
         *
         * @deprecated Use `newDate()` or `today()`.
         */
        this.Date = Date;
        /**
         * Creates a new date object to the today's date.
         *
         * @since 9.5.0
         * @returns The new date object.
         */
        this.today = () => {
            if (this.overrides?.today) {
                return this.overrides.today();
            }
            if (this.options.timeZone) {
                return TZDate.tz(this.options.timeZone);
            }
            return new this.Date();
        };
        /**
         * Creates a new date object with the specified year, month and date.
         *
         * @since 9.5.0
         * @param year The year.
         * @param monthIndex The month (0-11).
         * @param date The day of the month.
         * @returns The new date object.
         */
        this.newDate = (year, monthIndex, date) => {
            if (this.overrides?.newDate) {
                return this.overrides.newDate(year, monthIndex, date);
            }
            if (this.options.timeZone) {
                return new TZDate(year, monthIndex, date, this.options.timeZone);
            }
            return new Date(year, monthIndex, date);
        };
        /**
         * Adds the specified number of days to the given date.
         *
         * @param date The date to add days to.
         * @param amount The number of days to add.
         * @returns The new date with the days added.
         */
        this.addDays = (date, amount) => {
            return this.overrides?.addDays
                ? this.overrides.addDays(date, amount)
                : addDays(date, amount);
        };
        /**
         * Adds the specified number of months to the given date.
         *
         * @param date The date to add months to.
         * @param amount The number of months to add.
         * @returns The new date with the months added.
         */
        this.addMonths = (date, amount) => {
            return this.overrides?.addMonths
                ? this.overrides.addMonths(date, amount)
                : addMonths(date, amount);
        };
        /**
         * Adds the specified number of weeks to the given date.
         *
         * @param date The date to add weeks to.
         * @param amount The number of weeks to add.
         * @returns The new date with the weeks added.
         */
        this.addWeeks = (date, amount) => {
            return this.overrides?.addWeeks
                ? this.overrides.addWeeks(date, amount)
                : addWeeks(date, amount);
        };
        /**
         * Adds the specified number of years to the given date.
         *
         * @param date The date to add years to.
         * @param amount The number of years to add.
         * @returns The new date with the years added.
         */
        this.addYears = (date, amount) => {
            return this.overrides?.addYears
                ? this.overrides.addYears(date, amount)
                : addYears(date, amount);
        };
        /**
         * Returns the number of calendar days between the given dates.
         *
         * @param dateLeft The later date.
         * @param dateRight The earlier date.
         * @returns The number of calendar days between the dates.
         */
        this.differenceInCalendarDays = (dateLeft, dateRight) => {
            return this.overrides?.differenceInCalendarDays
                ? this.overrides.differenceInCalendarDays(dateLeft, dateRight)
                : differenceInCalendarDays(dateLeft, dateRight);
        };
        /**
         * Returns the number of calendar months between the given dates.
         *
         * @param dateLeft The later date.
         * @param dateRight The earlier date.
         * @returns The number of calendar months between the dates.
         */
        this.differenceInCalendarMonths = (dateLeft, dateRight) => {
            return this.overrides?.differenceInCalendarMonths
                ? this.overrides.differenceInCalendarMonths(dateLeft, dateRight)
                : differenceInCalendarMonths(dateLeft, dateRight);
        };
        /**
         * Returns the months between the given dates.
         *
         * @param interval The interval to get the months for.
         */
        this.eachMonthOfInterval = (interval) => {
            return this.overrides?.eachMonthOfInterval
                ? this.overrides.eachMonthOfInterval(interval)
                : eachMonthOfInterval(interval);
        };
        /**
         * Returns the end of the broadcast week for the given date.
         *
         * @param date The original date.
         * @returns The end of the broadcast week.
         */
        this.endOfBroadcastWeek = (date) => {
            return this.overrides?.endOfBroadcastWeek
                ? this.overrides.endOfBroadcastWeek(date, this)
                : endOfBroadcastWeek(date, this);
        };
        /**
         * Returns the end of the ISO week for the given date.
         *
         * @param date The original date.
         * @returns The end of the ISO week.
         */
        this.endOfISOWeek = (date) => {
            return this.overrides?.endOfISOWeek
                ? this.overrides.endOfISOWeek(date)
                : endOfISOWeek(date);
        };
        /**
         * Returns the end of the month for the given date.
         *
         * @param date The original date.
         * @returns The end of the month.
         */
        this.endOfMonth = (date) => {
            return this.overrides?.endOfMonth
                ? this.overrides.endOfMonth(date)
                : endOfMonth(date);
        };
        /**
         * Returns the end of the week for the given date.
         *
         * @param date The original date.
         * @returns The end of the week.
         */
        this.endOfWeek = (date) => {
            return this.overrides?.endOfWeek
                ? this.overrides.endOfWeek(date, this.options)
                : endOfWeek(date, this.options);
        };
        /**
         * Returns the end of the year for the given date.
         *
         * @param date The original date.
         * @returns The end of the year.
         */
        this.endOfYear = (date) => {
            return this.overrides?.endOfYear
                ? this.overrides.endOfYear(date)
                : endOfYear(date);
        };
        /**
         * Formats the given date using the specified format string.
         *
         * @param date The date to format.
         * @param formatStr The format string.
         * @returns The formatted date string.
         */
        this.format = (date, formatStr) => {
            const formatted = this.overrides?.format
                ? this.overrides.format(date, formatStr, this.options)
                : format(date, formatStr, this.options);
            if (this.options.numerals && this.options.numerals !== "latn") {
                return this.replaceDigits(formatted);
            }
            return formatted;
        };
        /**
         * Returns the ISO week number for the given date.
         *
         * @param date The date to get the ISO week number for.
         * @returns The ISO week number.
         */
        this.getISOWeek = (date) => {
            return this.overrides?.getISOWeek
                ? this.overrides.getISOWeek(date)
                : getISOWeek(date);
        };
        /**
         * Returns the month of the given date.
         *
         * @param date The date to get the month for.
         * @returns The month.
         */
        this.getMonth = (date) => {
            return this.overrides?.getMonth
                ? this.overrides.getMonth(date, this.options)
                : getMonth(date, this.options);
        };
        /**
         * Returns the year of the given date.
         *
         * @param date The date to get the year for.
         * @returns The year.
         */
        this.getYear = (date) => {
            return this.overrides?.getYear
                ? this.overrides.getYear(date, this.options)
                : getYear(date, this.options);
        };
        /**
         * Returns the local week number for the given date.
         *
         * @param date The date to get the week number for.
         * @returns The week number.
         */
        this.getWeek = (date) => {
            return this.overrides?.getWeek
                ? this.overrides.getWeek(date, this.options)
                : getWeek(date, this.options);
        };
        /**
         * Checks if the first date is after the second date.
         *
         * @param date The date to compare.
         * @param dateToCompare The date to compare with.
         * @returns True if the first date is after the second date.
         */
        this.isAfter = (date, dateToCompare) => {
            return this.overrides?.isAfter
                ? this.overrides.isAfter(date, dateToCompare)
                : isAfter(date, dateToCompare);
        };
        /**
         * Checks if the first date is before the second date.
         *
         * @param date The date to compare.
         * @param dateToCompare The date to compare with.
         * @returns True if the first date is before the second date.
         */
        this.isBefore = (date, dateToCompare) => {
            return this.overrides?.isBefore
                ? this.overrides.isBefore(date, dateToCompare)
                : isBefore(date, dateToCompare);
        };
        /**
         * Checks if the given value is a Date object.
         *
         * @param value The value to check.
         * @returns True if the value is a Date object.
         */
        this.isDate = (value) => {
            return this.overrides?.isDate
                ? this.overrides.isDate(value)
                : isDate(value);
        };
        /**
         * Checks if the given dates are on the same day.
         *
         * @param dateLeft The first date to compare.
         * @param dateRight The second date to compare.
         * @returns True if the dates are on the same day.
         */
        this.isSameDay = (dateLeft, dateRight) => {
            return this.overrides?.isSameDay
                ? this.overrides.isSameDay(dateLeft, dateRight)
                : isSameDay(dateLeft, dateRight);
        };
        /**
         * Checks if the given dates are in the same month.
         *
         * @param dateLeft The first date to compare.
         * @param dateRight The second date to compare.
         * @returns True if the dates are in the same month.
         */
        this.isSameMonth = (dateLeft, dateRight) => {
            return this.overrides?.isSameMonth
                ? this.overrides.isSameMonth(dateLeft, dateRight)
                : isSameMonth(dateLeft, dateRight);
        };
        /**
         * Checks if the given dates are in the same year.
         *
         * @param dateLeft The first date to compare.
         * @param dateRight The second date to compare.
         * @returns True if the dates are in the same year.
         */
        this.isSameYear = (dateLeft, dateRight) => {
            return this.overrides?.isSameYear
                ? this.overrides.isSameYear(dateLeft, dateRight)
                : isSameYear(dateLeft, dateRight);
        };
        /**
         * Returns the latest date in the given array of dates.
         *
         * @param dates The array of dates to compare.
         * @returns The latest date.
         */
        this.max = (dates) => {
            return this.overrides?.max ? this.overrides.max(dates) : max(dates);
        };
        /**
         * Returns the earliest date in the given array of dates.
         *
         * @param dates The array of dates to compare.
         * @returns The earliest date.
         */
        this.min = (dates) => {
            return this.overrides?.min ? this.overrides.min(dates) : min(dates);
        };
        /**
         * Sets the month of the given date.
         *
         * @param date The date to set the month on.
         * @param month The month to set (0-11).
         * @returns The new date with the month set.
         */
        this.setMonth = (date, month) => {
            return this.overrides?.setMonth
                ? this.overrides.setMonth(date, month)
                : setMonth(date, month);
        };
        /**
         * Sets the year of the given date.
         *
         * @param date The date to set the year on.
         * @param year The year to set.
         * @returns The new date with the year set.
         */
        this.setYear = (date, year) => {
            return this.overrides?.setYear
                ? this.overrides.setYear(date, year)
                : setYear(date, year);
        };
        /**
         * Returns the start of the broadcast week for the given date.
         *
         * @param date The original date.
         * @returns The start of the broadcast week.
         */
        this.startOfBroadcastWeek = (date) => {
            return this.overrides?.startOfBroadcastWeek
                ? this.overrides.startOfBroadcastWeek(date, this)
                : startOfBroadcastWeek(date, this);
        };
        /**
         * Returns the start of the day for the given date.
         *
         * @param date The original date.
         * @returns The start of the day.
         */
        this.startOfDay = (date) => {
            return this.overrides?.startOfDay
                ? this.overrides.startOfDay(date)
                : startOfDay(date);
        };
        /**
         * Returns the start of the ISO week for the given date.
         *
         * @param date The original date.
         * @returns The start of the ISO week.
         */
        this.startOfISOWeek = (date) => {
            return this.overrides?.startOfISOWeek
                ? this.overrides.startOfISOWeek(date)
                : startOfISOWeek(date);
        };
        /**
         * Returns the start of the month for the given date.
         *
         * @param date The original date.
         * @returns The start of the month.
         */
        this.startOfMonth = (date) => {
            return this.overrides?.startOfMonth
                ? this.overrides.startOfMonth(date)
                : startOfMonth(date);
        };
        /**
         * Returns the start of the week for the given date.
         *
         * @param date The original date.
         * @returns The start of the week.
         */
        this.startOfWeek = (date) => {
            return this.overrides?.startOfWeek
                ? this.overrides.startOfWeek(date, this.options)
                : startOfWeek(date, this.options);
        };
        /**
         * Returns the start of the year for the given date.
         *
         * @param date The original date.
         * @returns The start of the year.
         */
        this.startOfYear = (date) => {
            return this.overrides?.startOfYear
                ? this.overrides.startOfYear(date)
                : startOfYear(date);
        };
        this.options = { locale: enUS, ...options };
        this.overrides = overrides;
    }
    /**
     * Generate digit map dynamically using Intl.NumberFormat.
     *
     * @since 9.5.0
     */
    getDigitMap() {
        const { numerals = "latn" } = this.options;
        // Use Intl.NumberFormat to create a formatter with the specified numbering system
        const formatter = new Intl.NumberFormat("en-US", {
            numberingSystem: numerals
        });
        // Map Arabic digits (0-9) to the target numerals
        const digitMap = {};
        for (let i = 0; i < 10; i++) {
            digitMap[i.toString()] = formatter.format(i);
        }
        return digitMap;
    }
    /**
     * Replace Arabic digits with the target numbering system digits.
     *
     * @since 9.5.0
     */
    replaceDigits(input) {
        const digitMap = this.getDigitMap();
        return input.replace(/\d/g, (digit) => digitMap[digit] || digit);
    }
    /**
     * Format number using the custom numbering system.
     *
     * @since 9.5.0
     * @param value The number to format.
     * @returns The formatted number.
     */
    formatNumber(value) {
        return this.replaceDigits(value.toString());
    }
}
/** The default locale (English). */
export { enUS as defaultLocale } from "date-fns/locale/en-US";
/**
 * The default date library with English locale.
 *
 * @since 9.2.0
 */
export const defaultDateLib = new DateLib();
/**
 * @ignore
 * @deprecated Use `defaultDateLib`.
 */
export const dateLib = defaultDateLib;
//# sourceMappingURL=DateLib.js.map