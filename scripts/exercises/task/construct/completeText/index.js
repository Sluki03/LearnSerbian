import taskInterface from "./interface.js";
import createElement from "../../../../functions/createElement.js";
import { Inputs, Spans, emptyFieldSelector } from "./functions.js";

export default function completeText(thisTask, changeMode) {
    if(changeMode) return taskInterface(thisTask, changeMode);
    
    const { taskHolder } = thisTask.elements;

    const completeTextHolder = createElement({
        tag: "div",
        attributes: { class: "complete-text-holder" },
        appendTo: taskHolder
    });

    createElement({ tag: "div", attributes: { class: "interface" }, appendTo: completeTextHolder });

    const hintsButton = document.querySelector("[data-template='exercise-modal-task-complete-text-hints-button']").content.firstElementChild.cloneNode(true);
    if(thisTask.currentTask.hints?.switch) completeTextHolder.appendChild(hintsButton);

    if(thisTask.currentTask.hints.status) hintsButton.classList.add("active-hints-button");

    hintsButton.onclick = () => {
        const Elements = thisTask.currentTask.mode.type === "write" ? Inputs : Spans;
        
        if(thisTask.currentTask.hints.status) {
            hintsButton.classList.remove("active-hints-button");
            thisTask.currentTask.hints.status = false;

            Elements.reset();
        }

        else {
            hintsButton.classList.add("active-hints-button");
            thisTask.currentTask.hints.status = true;

            Elements.set(thisTask);
        }

        if(thisTask.currentTask.mode.type === "write") emptyFieldSelector({ key: "Enter" });
    }

    taskInterface(thisTask, changeMode);
}