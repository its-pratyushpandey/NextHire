import { camelToDash } from '../../render/dom/utils/camel-to-dash.mjs';
import { transformProps } from '../../../../../motion-dom/dist/es/render/utils/keys-transform.mjs';
import { acceleratedValues } from '../../../../../motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs';

function getWillChangeName(name) {
    if (transformProps.has(name)) {
        return "transform";
    }
    else if (acceleratedValues.has(name)) {
        return camelToDash(name);
    }
}

export { getWillChangeName };
