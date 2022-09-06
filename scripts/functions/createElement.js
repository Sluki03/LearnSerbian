import setStyles from "./setStyles.js";

export default function createElement(element) {
    const newElement = document.createElement(element.tag);
    
    const attributes = {
        keys: element.attributes ? Object.keys(element.attributes) : [],
        values: element.attributes ? Object.values(element.attributes) : []
    };

    attributes.keys.forEach((key, index) => newElement.setAttribute(key, attributes.values[index]));

    if(element.style) setStyles(newElement, element.style);

    if(element.innerText) newElement.innerText = element.innerText;

    if(element.events) for(let i = 0; i < element.events.length; i++) {
        const { on, call } = element.events[i];
        newElement.addEventListener(on, call);
    }

    if(element.appendTo === undefined) console.log(element)
    
    if(element.before) element.appendTo.insertBefore(newElement, element.before);
    else element.appendTo.appendChild(newElement);

    return newElement;
}