import taskInterface from "./interface.js";
import createElement from "../../../../functions/createElement.js";
import { Inputs, Spans, emptyFieldSelector } from "./functions.js";

export default function completeText(thisExercise, changeMode) {
    if(changeMode) return taskInterface(thisExercise, changeMode);
    
    const { taskHolder } = thisExercise.elements;

    const completeTextHolder = createElement({
        tag: "div",
        attributes: { class: "complete-text-holder" },
        appendTo: taskHolder
    });

    createElement({ tag: "div", attributes: { class: "interface" }, appendTo: completeTextHolder });

    const hintsButton = document.querySelector("[data-template='exercise-modal-task-complete-text-hints-button']").content.firstElementChild.cloneNode(true);
    if(thisExercise.currentTask.hints?.switch) completeTextHolder.appendChild(hintsButton);

    if(thisExercise.currentTask.hints.status) hintsButton.classList.add("active-hints-button");

    hintsButton.onclick = () => {
        const Elements = thisExercise.currentTask.mode.type === "write" ? Inputs : Spans;
        
        if(thisExercise.currentTask.hints.status) {
            hintsButton.classList.remove("active-hints-button");
            thisExercise.currentTask.hints.status = false;

            Elements.reset();
        }

        else {
            hintsButton.classList.add("active-hints-button");
            thisExercise.currentTask.hints.status = true;

            Elements.set(thisExercise);
        }

        if(thisExercise.currentTask.mode.type === "write") emptyFieldSelector({ key: "Enter" });
    }

    taskInterface(thisExercise, changeMode);
}