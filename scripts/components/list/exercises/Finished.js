import { Component } from "../../Component.js";

export default function Finished(componentProps) {
    const [exercise, exerciseModal] = componentProps.params;

    const finishedElement = document.querySelector("[data-template='exercise-modal-finished']").content.firstElementChild.cloneNode(true);
    exerciseModal.appendChild(finishedElement);

    const [finishedHolder, continueButton] = [...finishedElement.children];

    const exerciseModalTitleDivider = document.querySelector("[data-template='exercise-modal-title-divider']").content.firstElementChild.cloneNode(true);
    const [exerciseModalTitle, exerciseModalDivider] = [...exerciseModalTitleDivider.children];

    exerciseModalTitle.classList.add("disabled-exercise-modal-title");

    finishedElement.insertBefore(exerciseModalTitle, finishedHolder);
    finishedElement.insertBefore(exerciseModalDivider, finishedHolder);
    
    exerciseModalDivider.style.opacity = "0";
    exerciseModalDivider.style.top = "-10px";

    continueButton.style.bottom = "-100px";

    setTimeout(() => {
        exerciseModalTitle.classList.remove("disabled-exercise-modal-title");
        finishedHolder.classList.add("active-finished-holder");

        exerciseModalDivider.style.opacity = "";
        exerciseModalDivider.style.top = "";

        continueButton.style.bottom = "";
    }, 100);

    Component.create("InteractiveTitle", exercise.name, exerciseModalTitle);
    
    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");

    exerciseModalTitle.appendChild(activeExerciseClone);

    continueButton.onclick = () => {
        finishedHolder.classList.remove("active-finished-holder");
        continueButton.style.bottom = "-100px";

        setTimeout(() => {
            finishedElement.remove();
            
            
        });
    }

    return finishedElement;
}