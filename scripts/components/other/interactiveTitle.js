export default function interactiveTitle(componentParams) {
    const [title, appendTo] = componentParams;

    const interactiveTitle = document.createElement("div");
    interactiveTitle.setAttribute("class", "interactive-title");
    appendTo.appendChild(interactiveTitle);

    for(let i = 0; i < 3; i++) {
        const span = document.createElement("span");
        span.innerText = title;
        interactiveTitle.appendChild(span);
    }
}