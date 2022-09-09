import createElement from "../../../functions/createElement.js";

export default function ConfirmModal(componentProps) {
    const { question, options, confirmFunction, appendTo } = componentProps.params;

    const existingConfirmModal = document.querySelector(".confirm-modal");
    if(existingConfirmModal !== null) return;
    
    const confirmModal = createElement({
        tag: "div",
        attributes: { class: "confirm-modal" },
        appendTo
    });

    setTimeout(() => { confirmModal.classList.add("active-confirm-modal") }, 100);

    createElement({
        tag: "strong",
        innerText: question,
        appendTo: confirmModal
    });

    const buttonHolder = createElement({
        tag: "div",
        attributes: { class: "button-holder" },
        appendTo: confirmModal
    });

    const buttons = options ? options : ["yes", "no"];

    buttons.forEach(button => createElement({
        tag: "button",
        innerText: button,
        events: [{ on: "click", call: () => cancelModal(button) }],
        appendTo: buttonHolder
    }));

    function cancelModal(button) {
        confirmModal.style.opacity = "0";
        confirmModal.style.top = "55%";

        setTimeout(() => {
            confirmModal.remove();
            if(button === "yes" && confirmFunction) confirmFunction();
        }, 300);
    }

    return confirmModal;
}