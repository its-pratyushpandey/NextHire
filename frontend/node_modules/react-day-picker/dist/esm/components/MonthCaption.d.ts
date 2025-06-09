import React, { type HTMLAttributes } from "react";
import type { CalendarMonth } from "../classes/index.js";
/**
 * Render the caption of a month in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export declare function MonthCaption(props: {
    /** The month where the grid is displayed. */
    calendarMonth: CalendarMonth;
    /** The index where this month is displayed. */
    displayIndex: number;
} & HTMLAttributes<HTMLDivElement>): React.JSX.Element;
export type MonthCaptionProps = Parameters<typeof MonthCaption>[0];
