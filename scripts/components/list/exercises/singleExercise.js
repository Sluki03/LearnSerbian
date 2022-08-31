import { Component } from "../../component.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function singleExercise(componentProps) {
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

    const exerciseModalTitle = document.querySelector(".exercise-modal-title");

    Component.create("interactiveTitle", exercise.name, exerciseModalTitle);

    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    const exerciseModalContent = Component.create("singleContent", exercise, exerciseModal);
    const contentButton = document.querySelector(".exercise-modal-content button");
    
    contentButton.onclick = () => {
        contentButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalContent.classList.add("started-exercise-modal-content");

            setTimeout(() => {
                exerciseModalContent.remove();
                Component.create("singleTask", exercise.tasks, exerciseModal);
            }, 300);
        }, 300);
    }

    return exerciseModal;
}