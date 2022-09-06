import createElement from "../../../functions/createElement.js";

export default function ModalOptions(componentProps) {
    const { builtIn } = componentProps;
    const [appendTo, optionsList] = componentProps.params;

    const modalOptionsElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "modal-options" },
        appendTo
    });

    const options = optionsList ? optionsList : ["resize", "x"];

    options.forEach(option => createElement({
        tag: "div",
        attributes: { class: `modal-${option}` },
        appendTo: modalOptionsElement
    }));

    return modalOptionsElement;
    
    function changeResizeStatus() {
        let modalResize = null;
        const children = [...modalOptionsElement.children];

        children.forEach(child => {
            if(child.className === "modal-resize") modalResize = child;
        });

        if(modalResize.id) modalResize.id = "";
        else modalResize.id = "active-modal-resize";
    }
}
