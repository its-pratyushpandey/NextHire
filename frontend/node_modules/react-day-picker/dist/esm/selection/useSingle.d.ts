import type { DateLib } from "../classes/DateLib.js";
import type { DayPickerProps, SelectHandler, SelectedValue, Selection } from "../types/index.js";
export type UseSingle<T extends DayPickerProps> = {
    select: SelectHandler<T>;
    isSelected: (date: Date) => boolean;
    selected: SelectedValue<T>;
};
export declare function useSingle<T extends DayPickerProps>(props: DayPickerProps, dateLib: DateLib): Selection<T>;
