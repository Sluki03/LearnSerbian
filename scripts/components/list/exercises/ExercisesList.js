import { exercisesData } from "../../../../data/exercises/index.js";
import { Component } from "../../Component.js";
import createElement from "../../../functions/createElement.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function ExercisesList(componentProps) {
    const list = document.querySelector(".exercises-list");
    if(componentProps.params === undefined) return list;

    createElement({
        tag: "div",
        attributes: { class: "exercises-list-line" },
        appendTo: list
    });

    for(let i = 0; i < 2; i++) createElement({
        tag: "strong",
        attributes: { class: `exercises-list-${i === 0 ? "start" : "end"}` },
        innerText: i === 0 ? "start" : "end",
        appendTo: list
    });
    
    const listEnd = document.getElementById("exercises-list-end");

    let activeExerciseId = 0;

    exercisesData.forEach((exercise, index) => {
        const exerciseHolder = document.querySelector("[data-template='exercise-holder']").content.firstElementChild.cloneNode(true);
        list.insertBefore(exerciseHolder, listEnd);

        const [exerciseTitle, articleExercise] = [...exerciseHolder.children];
        const [exerciseDifficulty, exerciseP] = [...exerciseTitle.children];

        exerciseDifficulty.style.backgroundColor = getDifficultyColor(exercise.difficulty);
        exerciseP.innerText = exercise.name;

        articleExercise.onclick = () => openExerciseModal(articleExercise, exercise, index + 1);

        const [exerciseContent] = [...articleExercise.children];

        Component.create("InteractiveTitle", { title: index + 1, appendTo: exerciseContent });
    });

    return list;

    function openExerciseModal(activeExercise, exercise, id) {
        const exerciseModal = document.querySelector(".exercise-modal");

        if(exerciseModal === null && activeExerciseId > 0) activeExerciseId = 0;
        if(activeExerciseId === id) return;
        
        if(activeExerciseId !== 0) closeExerciseModal(false, { activeExercise, exercise });
        
        else {
            activeExercise.setAttribute("id", "active-exercise");
            Component.create("ExerciseModal", { exercise });
        }

        activeExerciseId = id;
    }
}
