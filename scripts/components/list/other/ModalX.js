import createElement from "../../../functions/createElement.js";

export default function ModalX(componentProps) {
    const { builtIn } = componentProps;
    const { onClick, appendTo } = componentProps.params;

    const modalX = builtIn ? builtIn : createElement({
        tag: "img",
        attributes: { src: "./images/icons/x-icon.png", alt: "X", class: "modal-x" },
        events: [{ on: "click", call: () => onClick() }],
        appendTo
    });

    if(window.eventList.get("modalXKeyDown") === null) window.eventList.add({ id: "modalXKeyDown", type: "keydown", listener: keyboardTrigger });

    return modalX;

    function keyboardTrigger(e) {
        const xKey = "Escape";
        if(xKey === e.key) onClick();
    }
}