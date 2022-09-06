import { Component } from "../../Component.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function ExerciseModal(componentProps) {
    const { exercise } = componentProps.params;

    const main = document.querySelector("main");
    const exerciseModal = document.querySelector("[data-template='exercise-modal']").content.firstElementChild.cloneNode(true);
    main.insertBefore(exerciseModal, main.firstChild);

    Component.render(exerciseModal);

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    Component.create("ModalOptions", {
        functions: { resize: modalOptionsResize, x: closeExerciseModal },
        appendTo: exerciseModal
    });

    function modalOptionsResize() {
        const exerciseModalWith = parseInt(getComputedStyle(exerciseModal).getPropertyValue("width"));
        
        if(exerciseModalWith !== window.innerWidth) exerciseModal.style.width = "100%";
        else exerciseModal.style.width = "";
    }

    const exerciseModalTitleDivider = document.querySelector("[data-template='exercise-modal-title-divider']").content.firstElementChild.cloneNode(true);
    const [exerciseModalTitle, exerciseModalDivider] = [...exerciseModalTitleDivider.children];

    exerciseModal.appendChild(exerciseModalTitle);
    exerciseModal.appendChild(exerciseModalDivider);

    Component.create("InteractiveTitle", { title: exercise.name, appendTo: exerciseModalTitle });

    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    Component.create("ExerciseModalContent", { exercise, appendTo: exerciseModal });

    return exerciseModal;
}
