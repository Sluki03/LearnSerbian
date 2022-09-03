import { Component } from "../../Component.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";
import realParseInt from "../../../functions/realParseInt.js";

export default function SingleExercise(componentProps) {
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

    const exerciseModalContent = Component.create("SingleContent", exercise, exerciseModal);
    const contentButton = document.querySelector(".exercise-modal-content button");

    let isExerciseStarted = false;
    
    contentButton.onclick = () => {
        if(isExerciseStarted) return;
        isExerciseStarted = true;
        
        const exerciseModalHeight = parseFloat(getComputedStyle(exerciseModal).getPropertyValue("height"));
        const buttonAnimation = exerciseModal.scrollHeight - 10 > realParseInt(exerciseModal.scrollTop + exerciseModalHeight);

        if(buttonAnimation) contentButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalContent.classList.add("started-exercise-modal-content");

            exerciseModalTitle.style.opacity = "0";
            exerciseModalTitle.style.top = "-10px";

            exerciseModalDivider.style.opacity = "0";
            exerciseModalDivider.style.top = "-10px";

            setTimeout(() => {
                exerciseModalContent.remove();
                exerciseModalTitle.remove();
                exerciseModalDivider.remove();

                Component.create("SingleTask", exercise, exerciseModal);
            }, 300);
        }, buttonAnimation ? 300 : 0);
    }

    return exerciseModal;
}
