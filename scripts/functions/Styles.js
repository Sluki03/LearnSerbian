import { Convert } from "./Convert.js";

export const Styles = { set, remove };

function set(element, styles) {
    Object.keys(styles).forEach((key, index) => {
        const style = Object.values(styles)[index];
        element.style.setProperty(Convert.jsToCssStandard(key), style);
    });
}

function remove(element, styles) {
    Object.keys(styles).forEach(key => {
        element.style.removeProperty(Convert.jsToCssStandard(key));
    });
}