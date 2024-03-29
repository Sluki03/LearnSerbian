import createElement from "../../../functions/element/createElement.js";

export default function InteractiveTitle(componentProps) {
    const { builtIn } = componentProps;
    const { title, appendTo, before } = componentProps.params;

    const interactiveTitle = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "interactive-title" },
        appendTo,
        before
    });

    for(let i = 0; i < 3; i++) createElement({
        tag: "span",
        innerText: title,
        appendTo: interactiveTitle
    });

    return interactiveTitle;
}
