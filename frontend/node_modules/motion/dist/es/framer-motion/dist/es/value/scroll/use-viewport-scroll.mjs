import { useScroll } from '../use-scroll.mjs';
import { warnOnce } from '../../../../../motion-utils/dist/es/warn-once.mjs';

/**
 * @deprecated useViewportScroll is deprecated. Convert to useScroll()
 */
function useViewportScroll() {
    if (process.env.NODE_ENV !== "production") {
        warnOnce(false, "useViewportScroll is deprecated. Convert to useScroll().");
    }
    return useScroll();
}

export { useViewportScroll };
