import { useScroll } from '../use-scroll.mjs';
import { warnOnce } from '../../../../../motion-utils/dist/es/warn-once.mjs';

/**
 * @deprecated useElementScroll is deprecated. Convert to useScroll({ container: ref })
 */
function useElementScroll(ref) {
    if (process.env.NODE_ENV === "development") {
        warnOnce(false, "useElementScroll is deprecated. Convert to useScroll({ container: ref }).");
    }
    return useScroll({ container: ref });
}

export { useElementScroll };
