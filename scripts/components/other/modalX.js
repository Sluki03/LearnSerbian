import createElement from "../../functions/createElement.js";

export default function modalX(componentParams) {
    const [closeFunction, appendTo] = componentParams;

    createElement({
        tag: "div",
        attributes: { class: "modal-x" },
        events: [{ on: "click", call: () => closeFunction() }],
        appendTo
    });
}