import type { CalendarDay, DateLib } from "./classes/index.js";
import type { MoveFocusBy, MoveFocusDir, DayPickerProps, Modifiers } from "./types/index.js";
import { Calendar } from "./useCalendar.js";
export type UseFocus = {
    /** The date that is currently focused. */
    focused: CalendarDay | undefined;
    /** Check if the given day is the focus target when entering the calendar. */
    isFocusTarget: (day: CalendarDay) => boolean;
    /** Focus the given day. */
    setFocused: (day: CalendarDay | undefined) => void;
    /** Blur the focused day. */
    blur: () => void;
    /** Move the current focus to the next day according to the given direction. */
    moveFocus: (moveBy: MoveFocusBy, moveDir: MoveFocusDir) => void;
};
/** @private */
export declare function useFocus<T extends DayPickerProps>(props: T, calendar: Calendar, getModifiers: (day: CalendarDay) => Modifiers, isSelected: (date: Date) => boolean, dateLib: DateLib): UseFocus;
