import createElement from "../../../functions/createElement.js";

export default function modalOptions(componentProps) {
    const { builtIn } = componentProps;
    const [closeFunction, appendTo] = componentProps.params;

    const modalOptionsElement = builtIn ? builtIn : createElement({
        tag: "div",
        attributes: { class: "modal-options" },
        appendTo
    });

    const options = ["resize", "x"];

    options.forEach(option => createElement({
        tag: "div",
        attributes: { class: `modal-${option}` },
        events: [{ on: "click", call: () => chooseFunction(option) }],
        appendTo: modalOptionsElement
    }));

    function chooseFunction(option) {
        if(option === "resize") return changeResizeStatus();
        else if(closeFunction !== undefined) return closeFunction();
        return null;
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