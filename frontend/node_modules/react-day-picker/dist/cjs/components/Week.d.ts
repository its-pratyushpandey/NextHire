import React, { type HTMLAttributes } from "react";
import type { CalendarWeek } from "../classes/index.js";
/**
 * Render a row in the calendar, with the days and the week number.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export declare function Week(props: {
    week: CalendarWeek;
} & HTMLAttributes<HTMLTableRowElement>): React.JSX.Element;
export type WeekProps = Parameters<typeof Week>[0];
