"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeks = getWeeks;
/** Returns an array of calendar weeks from an array of calendar months. */
function getWeeks(months) {
    const initialWeeks = [];
    return months.reduce((weeks, month) => {
        return [...weeks, ...month.weeks];
    }, initialWeeks);
}
//# sourceMappingURL=getWeeks.js.map