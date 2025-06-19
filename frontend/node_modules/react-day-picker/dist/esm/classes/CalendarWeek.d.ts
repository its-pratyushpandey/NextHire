import { CalendarDay } from "./CalendarDay.js";
/** Represent a week in a calendar month. */
export declare class CalendarWeek {
    constructor(weekNumber: number, days: CalendarDay[]);
    /** The number of the week within the year. */
    weekNumber: number;
    /** The days within the week. */
    days: CalendarDay[];
}
