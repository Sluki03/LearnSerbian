import { Styles } from "./Styles.js";
import { buildEventList } from "./EventControl.js";

export default function createElement(element) {
    const newElement = document.createElement(element.tag);
    
    const attributes = {
        keys: element.attributes ? Object.keys(element.attributes) : [],
        values: element.attributes ? Object.values(element.attributes) : []
    };

    attributes.keys.forEach((key, index) => newElement.setAttribute(key, attributes.values[index]));

    if(element.style) Styles.set(newElement, element.style);

    if(element.innerText) newElement.innerText = element.innerText;
    if(element.innerHTML) newElement.innerHTML = element.innerHTML;
    if(element.value) newElement.value = element.value;

    if(element.events) for(let i = 0; i < element.events.length; i++) {
        const { on, call } = element.events[i];
        newElement.addEventListener(on, call);
    }
    
    if(element.before) element.appendTo.insertBefore(newElement, element.before);
    else element.appendTo.appendChild(newElement);

    buildEventList(newElement);
    return newElement;
}