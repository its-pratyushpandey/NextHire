import type { DateLib } from "../classes/DateLib.js";
import { DropdownOption } from "../components/Dropdown.js";
import type { Formatters } from "../types/index.js";
/** Return the years to show in the dropdown. */
export declare function getYearOptions(navStart: Date | undefined, navEnd: Date | undefined, formatters: Pick<Formatters, "formatYearDropdown">, dateLib: DateLib): DropdownOption[] | undefined;
