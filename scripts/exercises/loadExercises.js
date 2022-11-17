import { Component } from "../components/Component.js";
import { exercisesData } from "../../data/exercises/index.js";
import createElement from "../functions/createElement.js";
import getDifficultyColor from "./getDifficultyColor.js";
import closeExerciseModal from "./closeExerciseModal.js";

export default function loadExercises() {
    const list = document.querySelector(".exercises-list");
    const listEnd = document.getElementById("exercises-list-end");

    const searchInput = document.querySelector(".exercises-search input");
    let prevSearchInputValue = searchInput.value;

    let activeExerciseId = 0;

    search();
    searchInput.oninput = search;

    function search() {
        let exercises = exercisesData;
        const exerciseHolders = document.querySelectorAll(".exercise-holder");

        if((exerciseHolders.length > 0) && (searchInput.value === prevSearchInputValue)) return;
        prevSearchInputValue = searchInput.value;

        if(searchInput.value) exercises = getMatches();

        [...list.children].forEach(child => {
            if(child.classList.contains("exercise-holder")) child.remove();
        });

        exercises.forEach((exercise, index) => {
            const exerciseHolder = document.querySelector("[data-template='exercise-holder']").content.firstElementChild.cloneNode(true);
            list.insertBefore(exerciseHolder, listEnd);

            const [exerciseTitle, articleExercise] = [...exerciseHolder.children];
            const [exerciseDifficulty, exerciseP] = [...exerciseTitle.children];

            exerciseDifficulty.style.backgroundColor = getDifficultyColor(exercise.difficulty);
            exerciseP.innerText = exercise.name;

            articleExercise.onclick = () => openExerciseModal(articleExercise, exercise, index + 1);

            const [exerciseContent] = [...articleExercise.children];

            if(exercise.icon) createElement({ tag: "img", attributes: { src: exercise.icon, alt: exercise.name }, appendTo: exerciseContent });
            else Component.create("InteractiveTitle", { title: index + 1, appendTo: exerciseContent });
        });

        function getMatches() {
            const newExercisesList = [];

            exercises.forEach(exercise => {
                if(exercise.name.indexOf(searchInput.value) > -1) newExercisesList.push(exercise);
            });

            return newExercisesList;
        }
    }
    
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