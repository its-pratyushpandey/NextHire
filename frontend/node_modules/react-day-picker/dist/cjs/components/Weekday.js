"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weekday = Weekday;
const react_1 = __importDefault(require("react"));
/**
 * Render the column header with the weekday name (e.g. "Mo", "Tu", etc.).
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
function Weekday(props) {
    return react_1.default.createElement("th", { ...props });
}
//# sourceMappingURL=Weekday.js.map