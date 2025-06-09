import { supportsFlags } from './flags.mjs';
import { memo } from '../../../../../motion-utils/dist/es/memo.mjs';

function memoSupports(callback, supportsFlag) {
    const memoized = memo(callback);
    return () => supportsFlags[supportsFlag] ?? memoized();
}

export { memoSupports };
