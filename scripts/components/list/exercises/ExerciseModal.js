import { Component } from "../../Component.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function ExerciseModal(componentProps) {
    const [exercise] = componentProps.params;

    const main = document.querySelector("main");
    const exerciseModal = document.querySelector("[data-template='exercise-modal']").content.firstElementChild.cloneNode(true);
    main.insertBefore(exerciseModal, main.firstChild);

    Component.render(exerciseModal);

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    const modalOptionsChildren = [...document.querySelector(".exercise-modal .modal-options").children];
    const [modalResize, modalX] = modalOptionsChildren;
    
    modalResize.onclick = () => {
        if(modalResize.id) exerciseModal.style.width = "100%";
        else exerciseModal.style.width = "";
    }
    
    modalX.onclick = () => closeExerciseModal();

    const exerciseModalTitleDivider = document.querySelector("[data-template='exercise-modal-title-divider']").content.firstElementChild.cloneNode(true);
    const [exerciseModalTitle, exerciseModalDivider] = [...exerciseModalTitleDivider.children];

    exerciseModal.appendChild(exerciseModalTitle);
    exerciseModal.appendChild(exerciseModalDivider);

    Component.create("InteractiveTitle", exercise.name, exerciseModalTitle);

    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    Component.create("ExerciseModalContent", exercise, exerciseModal);

    return exerciseModal;
}
