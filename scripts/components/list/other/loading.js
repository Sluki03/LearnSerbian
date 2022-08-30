import createElement from "../../../functions/createElement.js";

export default function loading(componentProps) {
    const { builtIn } = componentProps;
    const [appendTo] = componentProps.params;

    const loadingElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "loading" },
        appendTo
    });

    const rotating = createElement({ tag: "div", attributes: { class: "rotating" }, appendTo: loadingElement });
    createElement({ tag: "div", attributes: { class: "circle" }, appendTo: rotating });
}