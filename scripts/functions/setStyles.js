import { Convert } from "./Convert.js";

export default function setStyles(element, styles) {
    Object.keys(styles).forEach((key, index) => {
        const style = Object.values(styles)[index];
        element.style.setProperty(Convert.jsToCssStandard(key), style);
    });
}