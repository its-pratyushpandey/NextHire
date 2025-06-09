import React, { type MouseEventHandler, type HTMLAttributes } from "react";
/**
 * Render the toolbar with the navigation button.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export declare function Nav(props: {
    onPreviousClick?: MouseEventHandler<HTMLButtonElement>;
    onNextClick?: MouseEventHandler<HTMLButtonElement>;
    previousMonth?: Date | undefined;
    nextMonth?: Date | undefined;
} & HTMLAttributes<HTMLElement>): React.JSX.Element;
export type NavProps = Parameters<typeof Nav>[0];
