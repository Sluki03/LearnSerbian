import { exercisesData } from "../../../../data/exercisesData.js";
import { Component } from "../../component.js";
import createElement from "../../../functions/createElement.js";
import getDifficultyColor from "../../../exercises/getDifficultyColor.js";
import closeExerciseModal from "../../../exercises/closeExerciseModal.js";

export default function exercisesList() {
    const tree = document.querySelector(".exercises-tree");
    const treeEnd = document.getElementById("exercises-tree-end");

    let activeExerciseId = 0;

    exercisesData.forEach((exercise, index) => {
        const exerciseHolder = createElement({
            tag: "div",
            attributes: { class: "exercise-holder" },
            appendTo: tree,
            before: treeEnd
        });

        const exerciseTitle = createElement({
            tag: "div",
            attributes: { class: "exercise-title" },
            appendTo: exerciseHolder
        });

        createElement({
            tag: "div",
            attributes: { class: "exercise-difficulty" },
            style: { backgroundColor: getDifficultyColor(exercise.difficulty) },
            appendTo: exerciseTitle
        });

        createElement({
            tag: "p",
            innerText: exercise.name,
            appendTo: exerciseTitle
        });

        const articleExercise = createElement({
            tag: "article",
            attributes: { class: "exercise" },
            events: [{ on: "click", call: () => openExerciseModal(articleExercise, exercise, index + 1) }],
            appendTo: exerciseHolder
        });

        const exerciseContent = createElement({
            tag: "div",
            attributes: { class: "exercise-content" },
            appendTo: articleExercise
        });

        Component.create("interactiveTitle", index + 1, exerciseContent);
    });

    function openExerciseModal(activeExercise, exercise, id) {
        const exerciseModal = document.querySelector(".exercise-modal");

        if(exerciseModal.id === "disabled-exercise-modal" && activeExerciseId > 0) activeExerciseId = 0;
        if(activeExerciseId === id) return;
        
        if(activeExerciseId !== 0) closeExerciseModal({ activeExercise, exercise });
        
        else {
            activeExercise.setAttribute("id", "active-exercise");
            Component.create("singleExercise", exercise);
        }

        activeExerciseId = id;
    }
}