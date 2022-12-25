import createElement from "../../../functions/createElement.js";

export default function ArrowButton(componentProps) {
    const { builtIn } = componentProps;
    const { tag, href, appendTo } = componentProps.params;

    const arrowButtonElement = builtIn ? builtIn : createElement({
        tag: tag ? tag : "button",
        attributes: { class: "arrow-button", href: href ? href : "" },
        appendTo
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/arrow.png", alt: "ARROW" },
        appendTo: arrowButtonElement
    });

    return arrowButtonElement;
}