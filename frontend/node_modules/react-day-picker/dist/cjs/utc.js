"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayPicker = DayPicker;
const react_1 = __importDefault(require("react"));
const index_js_1 = require("./index.js");
function DayPicker(props) {
    return react_1.default.createElement(index_js_1.DayPicker, { timeZone: "utc", ...props });
}
//# sourceMappingURL=utc.js.map