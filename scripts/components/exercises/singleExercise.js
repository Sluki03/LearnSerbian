import createComponent from "../index.js";
import closeExerciseModal from "../../exercises/closeExerciseModal.js";

export default function singleExercise(componentParams) {
    const [exercise] = componentParams;
    
    const main = document.querySelector("main");

    const exerciseModal = document.createElement("div");
    exerciseModal.setAttribute("class", "exercise-modal");
    main.appendChild(exerciseModal);

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    createComponent("modalX", closeExerciseModal, exerciseModal);

    const exerciseModalTitle = document.createElement("div");
    exerciseModalTitle.setAttribute("class", "exercise-modal-title");
    exerciseModal.appendChild(exerciseModalTitle);

    createComponent("interactiveTitle", exercise.name, exerciseModalTitle);

    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    const divider = document.createElement("div");
    divider.setAttribute("class", "exercise-modal-divider");
    exerciseModal.appendChild(divider);
}