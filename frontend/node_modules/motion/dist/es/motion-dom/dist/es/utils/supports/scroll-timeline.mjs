import { memo } from '../../../../../motion-utils/dist/es/memo.mjs';

const supportsScrollTimeline = /* @__PURE__ */ memo(() => window.ScrollTimeline !== undefined);

export { supportsScrollTimeline };
