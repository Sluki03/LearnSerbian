import createElement from "../../../functions/createElement.js";

export default function ArrowButton(componentProps) {
    const { builtIn } = componentProps;
    const [tag, href, appendTo] = componentProps.params;

    const arrowButtonElement = builtIn ? builtIn : createElement({
        tag,
        attributes: { class: "arrow-button", href: href ? href : "" },
        appendTo: appendTo
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/arrow.png", alt: "ARROW" },
        appendTo: arrowButtonElement
    });

    return arrowButtonElement;
}