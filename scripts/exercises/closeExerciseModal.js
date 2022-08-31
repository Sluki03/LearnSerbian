import { Component } from "../components/component.js";

export default function closeExerciseModal(openNew) {
    const exerciseModal = document.querySelector(".exercise-modal");
    const activeExercise = document.getElementById("active-exercise");

    exerciseModal.id = "";
    activeExercise.id = "";

    setTimeout(() => {        
        exerciseModal.remove();
        
        if(openNew !== undefined) {
            const { activeExercise, exercise } = openNew;

            activeExercise.setAttribute("id", "active-exercise");
            Component.create("singleExercise", exercise);
        }
    }, 300);
}