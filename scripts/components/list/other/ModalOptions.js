import createElement from "../../../functions/createElement.js";

export default function ModalOptions(componentProps) {
    const { builtIn } = componentProps;
    const { options, functions, resizeId, appendTo } = componentProps.params;

    const modalOptionsElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "modal-options" },
        appendTo
    });

    const validOptions = options ? options : ["resize", "x"];

    validOptions.forEach(option => createElement({
        tag: "div",
        attributes: { class: `modal-${option}`, id: option === "resize" && resizeId ? resizeId : "" },
        events: [{ on: "click", call: () => getClickFunction(option) || null }],
        appendTo: modalOptionsElement
    }));

    if(window.eventList.get("modalOptionsKeyDown") === null) window.eventList.add({ id: "modalOptionsKeyDown", type: "keydown", listener: keyboardTrigger });

    return modalOptionsElement;
    
    function getClickFunction(option) {
        switch(option) {
            case "resize":
                const isIconRotated = functions.resize();
                changeResizeStatus(isIconRotated);

                break;
            case "x":
                functions.x();
            
                break;
            default: return;
        }
    }
    
    function changeResizeStatus(isIconRotated) {
        let modalResize = null;
        const children = [...modalOptionsElement.children];

        children.forEach(child => {
            if(child.className === "modal-resize") modalResize = child;
        });

        if(isIconRotated) modalResize.id = "";
        else modalResize.id = "active-modal-resize";
    }

    function keyboardTrigger(e) {
        const eKeys = {
            resize: "f",
            x: "Escape"
        };

        let validKey = "";

        Object.values(eKeys).forEach((value, index) => {
            if(e.key === value) validKey = Object.keys(eKeys)[index];
        });

        if(validKey && validOptions.indexOf(validKey) > -1) getClickFunction(validKey);
    }
}