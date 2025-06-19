import { createRenderBatcher } from './batcher.mjs';
import { noop } from '../../../../motion-utils/dist/es/noop.mjs';

const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps, } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);

export { cancelFrame, frame, frameData, frameSteps };
