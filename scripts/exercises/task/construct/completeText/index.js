import taskInterface from "./interface.js";
import createElement from "../../../../functions/createElement.js";
import { Inputs, Spans } from "./functions.js";

export default function completeText(thisTask, changeMode) {
    if(changeMode) return taskInterface(thisTask, changeMode);
    
    const { taskHolder } = thisTask.elements;

    const completeTextHolder = createElement({
        tag: "div",
        attributes: { class: "complete-text-holder" },
        appendTo: taskHolder
    });

    createElement({
        tag: "p",
        attributes: { class: "complete-text-p interface" },
        innerText: thisTask.currentTask.text,
        appendTo: completeTextHolder
    });

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

        if(thisTask.currentTask.mode.type === "write") emptyInputSelector({ key: "Enter" });
    }

    window.eventList.add({ id: "taskCompleteTextKeydown", type: "keydown", listener: emptyInputSelector });
    taskInterface(thisTask, changeMode);

    function emptyInputSelector(e) {
        if(thisTask.answer || e.key !== "Enter" || thisTask.currentTask.mode.type !== "write") return;

        const allInputs = document.querySelectorAll("p input");
        let targetInput = null;

        allInputs.forEach(input => {
            if(!input.value && targetInput === null) targetInput = input;
        });

        targetInput.focus();
    }
}