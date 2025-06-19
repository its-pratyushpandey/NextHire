/** Returns an array of calendar weeks from an array of calendar months. */
export function getWeeks(months) {
    const initialWeeks = [];
    return months.reduce((weeks, month) => {
        return [...weeks, ...month.weeks];
    }, initialWeeks);
}
//# sourceMappingURL=getWeeks.js.map