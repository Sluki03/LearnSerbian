import { Component } from "../../component.js";
import createElement from "../../../functions/createElement.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";
import markup from "../../../functions/markup.js";

export default function singleExercise(componentProps) {
    const [exercise] = componentProps.params;

    const exerciseModal = document.querySelector(".exercise-modal");
    exerciseModal.id = "";

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

    const contentDifficultyCircles = document.querySelector(".content-difficulty-circles");

    for(let i = 0; i < getDifficultyIndex(); i++) createElement({
        tag: "div",
        attributes: { class: "content-difficulty-circle" },
        style: { backgroundColor: getDifficultyColor(exercise.difficulty) },
        appendTo: contentDifficultyCircles
    });

    const contentP = document.querySelector(".exercise-modal-content .content-p");
    contentP.innerHTML = exercise.tips ? markup(exercise.tips) : "This exercise has no tips.";

    const exerciseModalContent = document.querySelector(".exercise-modal-content");

    if(exerciseModal.scrollHeight < window.innerHeight) exerciseModalContent.id = "extended-exercise-modal-content";
    else exerciseModalContent.id = "";

    function getDifficultyIndex() {
        const difficultyRow = ["easy", "medium", "hard"];
        
        let index;
        for(let i = 0; i < difficultyRow.length; i++) if(exercise.difficulty === difficultyRow[i]) index = i;

        return index + 1;
    }
}