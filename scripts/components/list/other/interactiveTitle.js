import createElement from "../../../functions/createElement.js";

export default function interactiveTitle(componentParams) {
    const [title, appendTo] = componentParams;

    const interactiveTitle = createElement({
        tag: "div",
        attributes: { class: "interactive-title" },
        appendTo
    });

    for(let i = 0; i < 3; i++) createElement({
        tag: "span",
        innerText: title,
        appendTo: interactiveTitle
    });
}