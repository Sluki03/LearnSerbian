export const Shorten = { elementInnerText, placeholder };

function elementInnerText(element, elementSrc) {
    let shortenElementInnerText = "";
    let dots = false;

    const validElementInnerText = elementSrc ? elementSrc : element.innerText;
    element.innerText = validElementInnerText;

    if(element.scrollWidth > element.clientWidth) {
        dots = true;

        while(element.scrollWidth > element.clientWidth) element.innerText = element.innerText.substring(0, element.innerText.length - 1);
        shortenElementInnerText = element.innerText.substring(0, element.innerText.length - 3);
    }

    else shortenElementInnerText = validElementInnerText;

    element.innerText = `${shortenElementInnerText}${dots ? "..." : ""}`;
}

function placeholder(input, placeholderSrc) {
    const inputValueStorage = input.value ? input.value : "";

    let placeholder = "";
    let dots = false;

    const validPlaceholder = placeholderSrc ? placeholderSrc : input.placeholder;
    input.value = validPlaceholder;

    if(input.scrollWidth > input.clientWidth) {
        dots = true;
        
        while(input.scrollWidth > input.clientWidth) input.value = input.value.substring(0, input.value.length - 1);
        placeholder = input.value.substring(0, input.value.length - 3);
    }

    else placeholder = validPlaceholder;

    input.value = inputValueStorage;
    input.placeholder = `${placeholder}${dots ? "..." : ""}`;
}

