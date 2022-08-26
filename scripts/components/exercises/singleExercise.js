import createComponent from "../../functions/createComponent.js";
import createElement from "../../functions/createElement.js";
import closeExerciseModal from "../../exercises/closeExerciseModal.js";

export default function singleExercise(componentParams) {
    const [exercise] = componentParams;

    const main = document.querySelector("main");
    
    const exerciseModal = createElement({
        tag: "div",
        attributes: { class: "exercise-modal" },
        appendTo: main
    });

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    createComponent("modalX", closeExerciseModal, exerciseModal);

    const exerciseModalTitle = createElement({
        tag: "div",
        attributes: { class: "exercise-modal-title" },
        appendTo: exerciseModal
    });

    createComponent("interactiveTitle", exercise.name, exerciseModalTitle);

    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    createElement({
        tag: "div",
        attributes: { class: "exercise-modal-divider" },
        appendTo: exerciseModal
    });

    createElement({
        tag: "div",
        attributes: { class: "exercise-modal-content" },
        appendTo: exerciseModal
    });
}