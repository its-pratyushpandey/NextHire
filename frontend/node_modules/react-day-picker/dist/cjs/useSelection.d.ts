import { type DateLib } from "./classes/DateLib.js";
import type { DayPickerProps } from "./types/index.js";
import { Selection } from "./types/selection.js";
export declare function useSelection<T extends DayPickerProps>(props: T, dateLib: DateLib): Selection<T> | undefined;
