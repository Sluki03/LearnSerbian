import createElement from "../../../functions/createElement.js";

export default function modalX(componentProps) {
    const [closeFunction, appendTo] = componentProps.params;

    createElement({
        tag: "div",
        attributes: { class: "modal-x" },
        events: [{ on: "click", call: () => closeFunction() }],
        appendTo
    });
}