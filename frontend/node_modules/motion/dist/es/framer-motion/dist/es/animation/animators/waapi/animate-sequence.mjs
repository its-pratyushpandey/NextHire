import { createAnimationsFromSequence } from '../../sequence/create.mjs';
import { animateElements } from './animate-elements.mjs';
import { GroupAnimationWithThen } from '../../../../../../motion-dom/dist/es/animation/GroupAnimationWithThen.mjs';

function animateSequence(definition, options) {
    const animations = [];
    createAnimationsFromSequence(definition, options).forEach(({ keyframes, transition }, element) => {
        animations.push(...animateElements(element, keyframes, transition));
    });
    return new GroupAnimationWithThen(animations);
}

export { animateSequence };
