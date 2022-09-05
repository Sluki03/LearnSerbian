import { exercisesData } from "../../../../data/exercisesData.js";
import { Component } from "../../Component.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function ExercisesList() {
    const tree = document.querySelector(".exercises-tree");
    const treeEnd = document.getElementById("exercises-tree-end");

    let activeExerciseId = 0;

    exercisesData.forEach((exercise, index) => {
        const exerciseHolder = document.querySelector("[data-template='exercise']").content.firstElementChild.cloneNode(true);
        tree.insertBefore(exerciseHolder, treeEnd);

        const [exerciseTitle, articleExercise] = [...exerciseHolder.children];
        const [exerciseDifficulty, exerciseP] = [...exerciseTitle.children];

        exerciseDifficulty.style.backgroundColor = getDifficultyColor(exercise.difficulty);
        exerciseP.innerText = exercise.name;

        articleExercise.onclick = () => openExerciseModal(articleExercise, exercise, index + 1);

        const [exerciseContent] = [...articleExercise.children];

        Component.create("InteractiveTitle", index + 1, exerciseContent);
    });

    function openExerciseModal(activeExercise, exercise, id) {
        const exerciseModal = document.querySelector(".exercise-modal");

        if(exerciseModal === null && activeExerciseId > 0) activeExerciseId = 0;
        if(activeExerciseId === id) return;
        
        if(activeExerciseId !== 0) closeExerciseModal({ activeExercise, exercise });
        
        else {
            activeExercise.setAttribute("id", "active-exercise");
            Component.create("ExerciseModal", exercise);
        }

        activeExerciseId = id;
    }
}
