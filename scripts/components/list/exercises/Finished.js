import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";

export default function Finished(componentProps) {
    const [exercise, exerciseModal] = componentProps.params;

    const finishedElement = document.querySelector("[data-template='exercise-modal-finished']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(finishedElement);

    const [finishedTitle, finishedDivider, finishedHolder, continueButton] = [...finishedElement.children];

    finishedDivider.style.opacity = "0";
    finishedDivider.style.top = "-10px";

    continueButton.style.bottom = "-100px";

    setTimeout(() => {
        finishedTitle.classList.add("active-finished-title");
        finishedHolder.classList.add("active-finished-holder");

        finishedDivider.style.opacity = "";
        finishedDivider.style.top = "";

        continueButton.style.bottom = "";
    }, 100);

    Component.create("InteractiveTitle", exercise.name, finishedTitle);
    
    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");

    finishedTitle.appendChild(activeExerciseClone);

    return finishedElement;
}