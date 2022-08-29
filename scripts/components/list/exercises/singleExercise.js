import { Component } from "../../component.js";
import createElement from "../../../functions/createElement.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function singleExercise(componentParams) {
    const [exercise] = componentParams;

    const exerciseModal = document.querySelector(".exercise-modal");
    exerciseModal.id = "";

    setTimeout(() => exerciseModal.setAttribute("id", "active-exercise-modal"), 100);

    const modalX = document.querySelector(".exercise-modal .modal-x");
    modalX.onclick = () => closeExerciseModal();

    const exerciseModalTitle = document.querySelector(".exercise-modal-title");

    Component.create("interactiveTitle", exercise.name, exerciseModalTitle);

    const activeExerciseClone = document.getElementById("active-exercise").cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");
    
    exerciseModalTitle.appendChild(activeExerciseClone);

    const contentDifficultyCircles = document.querySelector(".content-difficulty-circles");
    const contentDifficultyI = document.querySelector(".content-difficulty i");

    for(let i = 0; i < getDifficultyIndex(); i++) createElement({
        tag: "div",
        attributes: { class: "content-difficulty-circle" },
        style: { backgroundColor: getDifficultyColor(exercise.difficulty) },
        appendTo: contentDifficultyCircles
    });

    contentDifficultyI.innerText = `(${exercise.difficulty})`;
    contentDifficultyI.style.color = getDifficultyColor(exercise.difficulty);

    function getDifficultyIndex() {
        const difficultyRow = ["easy", "medium", "hard"];
        
        let index;
        for(let i = 0; i < difficultyRow.length; i++) if(exercise.difficulty === difficultyRow[i]) index = i;

        return index + 1;
    }
}