import createElement from "../../../functions/createElement.js";
import { Convert } from "../../../functions/Convert.js";

export default function ClassicModal(componentProps) {
    const { text, buttons, buttonsTrigger, functions, appendTo } = componentProps.params;

    const existingClassicModal = document.querySelector(".classic-modal");
    if(existingClassicModal !== null) return;
    
    const classicModal = createElement({
        tag: "div",
        attributes: { class: "classic-modal" },
        appendTo
    });

    setTimeout(() => { classicModal.classList.add("active-classic-modal") }, 100);

    createElement({
        tag: "strong",
        innerText: text,
        appendTo: classicModal
    });

    const buttonHolder = createElement({
        tag: "div",
        attributes: { class: "button-holder" },
        appendTo: classicModal
    });

    buttons.forEach(button => createElement({
        tag: "button",
        attributes: { class: `button-holder-${convertButtonText(button, "cssStandard")}` },
        innerText: button,
        events: [{ on: "click", call: () => cancelModal(button) }],
        appendTo: buttonHolder
    }));

    if(buttonsTrigger) {
        window.eventCollector.add({ id: "classicModalKeyDown", type: "keydown", listener: keyboardTrigger });

        function keyboardTrigger(e) {
            window.eventCollector("classicModalKeyDown");

            let button;
            
            Object.values(buttonsTrigger).forEach((keyboardKey, index) => {
                if(e.key === keyboardKey) button = Object.keys(buttonsTrigger)[index];
            });

            cancelModal(button);
        }
    }

    function cancelModal(button) {
        classicModal.style.opacity = "0";
        classicModal.style.top = "55%";

        setTimeout(() => {
            classicModal.remove();

            const validButton = convertButtonText(button, "jsStandard");
            
            const functionKeys = Object.keys(functions);
            const functionValues = Object.values(functions);

            if(functionKeys.indexOf(validButton) > -1) functionValues[functionKeys.indexOf(validButton)]();
        }, 300);
    }

    function convertButtonText(buttonText, type) {
        const cssStandard = buttonText.replaceAll(" ", "-");
        
        if(type === "cssStandard") return cssStandard;
        return Convert.cssToJsStandard(cssStandard);
    }

    return classicModal;
}