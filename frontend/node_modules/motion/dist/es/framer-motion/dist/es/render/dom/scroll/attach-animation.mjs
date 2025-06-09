import { getTimeline } from './utils/get-timeline.mjs';
import { observeTimeline } from '../../../../../../motion-dom/dist/es/scroll/observe.mjs';

function attachToAnimation(animation, options) {
    const timeline = getTimeline(options);
    return animation.attachTimeline({
        timeline: options.target ? undefined : timeline,
        observe: (valueAnimation) => {
            valueAnimation.pause();
            return observeTimeline((progress) => {
                valueAnimation.time = valueAnimation.duration * progress;
            }, timeline);
        },
    });
}

export { attachToAnimation };
