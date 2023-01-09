import createElement from "../../../../functions/element/createElement.js";

export default function ModalOptions(componentProps) {
    const { builtIn } = componentProps;
    const { functions, appendTo } = componentProps.params;

    const modalOptions = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "modal-options" },
        appendTo
    });

    Object.keys(functions).forEach((key, index) => createElement({
        tag: "img",
        attributes: { src: `./images/icons/${key}-icon.png`, alt: key.toUpperCase() },
        events: [{ on: "click", call: () => Object.values(functions)[index]() }],
        appendTo: modalOptions
    }));

    window.eventList.add({ id: "modalOptionsKeyDown", type: "keydown", listener: keyboardTrigger });

    return modalOptions;

    function keyboardTrigger(e) {
        const xKey = "Escape";

        if(xKey === e.key) {
            window.eventList.remove("modalOptionsKeyDown");
            functions.x();
        }
    }
}