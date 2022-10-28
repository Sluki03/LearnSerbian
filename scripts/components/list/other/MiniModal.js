import createElement from "../../../functions/createElement.js";

export default function MiniModal(componentProps) {
    const { builtIn } = componentProps;
    const { target, id, content } = componentProps.params;

    const body = document.querySelector("body");
    
    const miniModal = builtIn ? builtIn : createElement({
        tag: "p",
        attributes: { class: "mini-modal", id: `mini-modal-${id}` },
        innerText: content,
        appendTo: body
    });

    const rect = {
        target: target.getBoundingClientRect(),
        modal: miniModal.getBoundingClientRect()
    };

    const globalPositions = { top: parseInt(rect.target.y), left: parseInt(rect.target.x) };

    const positions = {
        target: {
            height: parseInt(rect.target.height),
            width: parseInt(rect.target.width)
        },

        modal: {
            height: parseInt(rect.modal.height),
            width: parseInt(rect.modal.width)
        }
    };

    const miniModalPositions = {
        top: globalPositions.top - positions.modal.height,
        left: (globalPositions.left + positions.target.width / 2) - positions.modal.width / 2
    };

    const existingMiniModal = document.querySelector(".active-mini-modal");
    if(existingMiniModal) closeMiniModal(existingMiniModal);

    miniModal.style.top = `${miniModalPositions.top - 10}px`;
    miniModal.style.left = `${miniModalPositions.left}px`;

    setTimeout(() => {
        miniModal.classList.add("active-mini-modal");
        miniModal.style.top = `${miniModalPositions.top}px`;
    }, 300);

    window.eventList.remove("miniModalClick");
    window.eventList.add({ id: "miniModalClick", type: "click", listener: closeMiniModal });

    function closeMiniModal(e) {
        if(e.target) e.stopPropagation();

        const currentTarget = e.target ? e.target : e;
            
        const existingMiniModal = document.querySelector(".active-mini-modal");
        if(existingMiniModal === null || (e.target && currentTarget.classList.contains("mini-modal"))) return;
            
        const activeTarget = existingMiniModal.component.params.target;
        if(activeTarget !== null) activeTarget.style.borderBottom = "";
            
        existingMiniModal.classList.remove("active-mini-modal");
        existingMiniModal.style.top = `${miniModalPositions.top - 10}px`;

        setTimeout(() => { existingMiniModal.remove() }, 300);

        if(currentTarget.className === activeTarget.className) window.eventList.remove("miniModalClick");
    }

    return miniModal;
}