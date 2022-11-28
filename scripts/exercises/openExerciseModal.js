import { Component } from "../components/Component.js";
import closeExerciseModal from "./closeExerciseModal.js";

let activeExerciseId = 0;

export default function openExerciseModal(activeExercise, exercise, id = -1) {
    const [exerciseBorder, exerciseContent] = [...activeExercise.children];

    exerciseBorder.style.transform = "";

    exerciseContent.style.height = "";
    exerciseContent.style.width = "";
        
    const exerciseModal = document.querySelector(".exercise-modal");
    const exerciseHolder = activeExercise.parentNode;

    if(exerciseModal === null && activeExerciseId > 0) activeExerciseId = 0;
    if(activeExerciseId === id) return;
        
    if(activeExerciseId !== 0) closeExerciseModal(false, { activeExercise, exercise });
        
    else {
        exerciseHolder.id = "active-exercise-holder";
        Component.create("ExerciseModal", { exercise });
    }

    activeExerciseId = id;
}