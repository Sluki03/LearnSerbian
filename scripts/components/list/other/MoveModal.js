import createElement from "../../../functions/createElement.js";

export default function MoveModal(componentProps) {
    const { builtIn } = componentProps;
    const { appendTo } = componentProps.params;

    const moveModal = builtIn ? builtIn : createElement({
        tag: "button",
        attributes: { class: "move-modal" },
        events: [{ on: "mousedown", call: startMove }],
        appendTo
    });

    createElement({
        tag: "img",
        attributes: { src: "./images/icons/move-icon.png", alt: "MOVE" },
        appendTo: moveModal
    });

    return moveModal;

    function startMove(e) {
        window.eventList.add({
            moveModalMouseMove: { type: "mousemove", listener: move },
            moveModalMouseUp: { type: "mouseup", listener: cancelMove }
        });

        moveModal.classList.add("active-move-modal");

        const { height, width } = e.target.getBoundingClientRect();
        const { top, left } = appendTo.getBoundingClientRect();

        appendTo.style.transform = "none";
        appendTo.style.transition = "0ms";

        appendTo.style.top = `${top.toFixed(2)}px`,
        appendTo.style.left = `${left.toFixed(2)}px`

        function move(e) {
            const mouse = {
                x: e.clientX - width / 2 - 10,
                y: e.clientY - height / 2 - 10
            };
            
            appendTo.style.top = `${mouse.y}px`,
            appendTo.style.left = `${mouse.x}px`
        }
        
        function cancelMove() {
            window.eventList.remove("moveModalMouseMove", "moveModalMouseUp");
            moveModal.classList.remove("active-move-modal");

            appendTo.style.transition = "";
        }
    }
}