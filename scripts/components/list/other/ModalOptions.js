import createElement from "../../../functions/createElement.js";

export default function ModalOptions(componentProps) {
    const { builtIn } = componentProps;
    const { options, functions, appendTo } = componentProps.params;

    const modalOptionsElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "modal-options" },
        appendTo
    });

    const validOptions = options ? options : ["resize", "x"];

    validOptions.forEach(option => createElement({
        tag: "div",
        attributes: { class: `modal-${option}` },
        events: [{ on: "click", call: () => getClickFunction(option) || null }],
        appendTo: modalOptionsElement
    }));

    return modalOptionsElement;
    
    function getClickFunction(option) {
        switch(option) {
            case "resize":
                changeResizeStatus();
                functions.resize();

                break;
            case "x":
                functions.x();
            
            default: return;
        }
    }
    
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
