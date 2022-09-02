import createElement from "../../../functions/createElement.js";

export default function InteractiveTitle(componentProps) {
    const { builtIn } = componentProps;
    const [title, appendTo] = componentProps.params;

    const interactiveTitle = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "interactive-title" },
        appendTo
    });

    for(let i = 0; i < 3; i++) createElement({
        tag: "span",
        innerText: title,
        appendTo: interactiveTitle
    });

    return interactiveTitle;
}