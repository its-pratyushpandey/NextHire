import { useMulti } from "./selection/useMulti.js";
import { useRange } from "./selection/useRange.js";
import { useSingle } from "./selection/useSingle.js";
export function useSelection(props, dateLib) {
    const single = useSingle(props, dateLib);
    const multi = useMulti(props, dateLib);
    const range = useRange(props, dateLib);
    switch (props.mode) {
        case "single":
            return single;
        case "multiple":
            return multi;
        case "range":
            return range;
        default:
            return undefined;
    }
}
//# sourceMappingURL=useSelection.js.map