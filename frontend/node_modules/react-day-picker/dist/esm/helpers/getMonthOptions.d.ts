import { type DateLib } from "../classes/DateLib.js";
import { DropdownOption } from "../components/Dropdown.js";
import type { Formatters } from "../types/index.js";
/** Return the months to show in the dropdown. */
export declare function getMonthOptions(displayMonth: Date, navStart: Date | undefined, navEnd: Date | undefined, formatters: Pick<Formatters, "formatMonthDropdown">, dateLib: DateLib): DropdownOption[] | undefined;
