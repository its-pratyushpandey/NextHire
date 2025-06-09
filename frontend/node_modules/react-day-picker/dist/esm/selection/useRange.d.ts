import type { DateLib } from "../classes/DateLib.js";
import type { DayPickerProps, Selection } from "../types/index.js";
export declare function useRange<T extends DayPickerProps>(props: T, dateLib: DateLib): Selection<T>;
