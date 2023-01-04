import createElement from "../../../functions/element/createElement.js";

export default function OptionImage(componentProps) {
    const { builtIn } = componentProps;
    const { image, text, appendTo } = componentProps.params;

    const optionImage =  builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "option-image" },
        appendTo
    });

    createElement({
        tag: "img",
        attributes: { src: image, alt: text ? text.toUpperCase() : "IMAGE" },
        appendTo: optionImage
    });

    if(text) createElement({
        tag: "p",
        innerText: text,
        appendTo: optionImage
    });

    return optionImage;
}