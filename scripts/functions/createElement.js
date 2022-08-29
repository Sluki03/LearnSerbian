export default function createElement(element) {
    const newElement = document.createElement(element.tag);
    
    const attributes = {
        keys: element.attributes ? Object.keys(element.attributes) : [],
        values: element.attributes ? Object.values(element.attributes) : []
    };

    attributes.keys.forEach((key, index) => newElement.setAttribute(key, attributes.values[index]));

    if(element.style) Object.keys(element.style).forEach((key, index) => {
        const value = Object.values(element.style)[index];
        newElement.style.setProperty(jsToCssStandard(key), value);
    });

    if(element.innerText) newElement.innerText = element.innerText;

    if(element.events) for(let i = 0; i < element.events.length; i++) {
        const { on, call } = element.events[i];
        newElement.addEventListener(on, call);
    }
    
    if(element.before) element.appendTo.insertBefore(newElement, element.before);
    else element.appendTo.appendChild(newElement);

    return newElement;

    function jsToCssStandard(string) {
        let newString = "";

        for(let i = 0; i < string.length; i++) {
            if(string[i] === string[i].toUpperCase()) newString += `-${string[i].toLowerCase()}`;
            else newString += string[i];
        }

        return newString;
    }
}