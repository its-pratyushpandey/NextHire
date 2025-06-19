import React from "react";
import * as dateFnsJalali from "date-fns-jalali";
import { Locale } from "date-fns-jalali";
import { DateLib, DateLibOptions } from "./index.js";
import type { DayPickerProps } from "./types/props.js";
export declare const faIR: dateFnsJalali.Locale;
export declare const enUS: dateFnsJalali.Locale;
/**
 * Render the Persian Calendar.
 *
 * @see https://daypicker.dev/docs/localization#persian-calendar
 */
export declare function DayPicker(props: DayPickerProps & {
    /**
     * The locale to use in the calendar.
     *
     * @default `faIR`
     */
    locale?: Locale;
    /**
     * The direction of the text in the calendar.
     *
     * @default `rtl`
     */
    dir?: DayPickerProps["dir"];
    /**
     * The date library to use in the calendar.
     *
     * @default `jalaliDateLib` from `date-fns-jalali`
     */
    dateLib?: DayPickerProps["dateLib"];
    /**
     * The numeral system to use when formatting dates.
     *
     * - `latn`: Latin (Western Arabic)
     * - `arab`: Arabic-Indic
     * - `arabext`: Eastern Arabic-Indic (Persian)
     * - `deva`: Devanagari
     * - `beng`: Bengali
     * - `guru`: Gurmukhi
     * - `gujr`: Gujarati
     * - `orya`: Oriya
     * - `tamldec`: Tamil
     * - `telu`: Telugu
     * - `knda`: Kannada
     * - `mlym`: Malayalam
     *
     * @defaultValue `arabext` Eastern Arabic-Indic (Persian)
     * @see https://daypicker.dev/docs/translation#numeral-systems
     */
    numerals?: DayPickerProps["numerals"];
}): React.JSX.Element;
/** Returns the date library used in the calendar. */
export declare const getDateLib: (options?: DateLibOptions) => DateLib;
