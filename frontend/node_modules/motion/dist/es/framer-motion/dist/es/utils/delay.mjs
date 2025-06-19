import { time } from '../../../../motion-dom/dist/es/frameloop/sync-time.mjs';
import { frame, cancelFrame } from '../../../../motion-dom/dist/es/frameloop/frame.mjs';
import { secondsToMilliseconds } from '../../../../motion-utils/dist/es/time-conversion.mjs';

/**
 * Timeout defined in ms
 */
function delay(callback, timeout) {
    const start = time.now();
    const checkElapsed = ({ timestamp }) => {
        const elapsed = timestamp - start;
        if (elapsed >= timeout) {
            cancelFrame(checkElapsed);
            callback(elapsed - timeout);
        }
    };
    frame.setup(checkElapsed, true);
    return () => cancelFrame(checkElapsed);
}
function delayInSeconds(callback, timeout) {
    return delay(callback, secondsToMilliseconds(timeout));
}

export { delay, delayInSeconds };
