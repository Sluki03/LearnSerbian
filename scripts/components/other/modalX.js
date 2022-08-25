export default function modalX(componentParams) {
    const [closeFunction, appendTo] = componentParams;

    const modalX = document.createElement("div");
    modalX.setAttribute("class", "modal-x");
    appendTo.appendChild(modalX);

    modalX.addEventListener("click", () => closeFunction());
}