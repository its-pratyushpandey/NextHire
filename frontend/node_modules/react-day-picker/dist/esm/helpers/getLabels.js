import * as defaultLabels from "../labels/index.js";
/** Return the formatters from the props merged with the default formatters. */
export function getLabels(customLabels) {
    return {
        ...defaultLabels,
        ...customLabels
    };
}
//# sourceMappingURL=getLabels.js.map