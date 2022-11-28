import { Component } from "../components/Component.js";
import { exercisesData } from "../../data/exercises/index.js";
import { Convert } from "../functions/Convert.js";
import createElement from "../functions/createElement.js";
import initializeStats from "./initializeStats.js";
import getDifficultyColor from "./getDifficultyColor.js";
import openExerciseModal from "./openExerciseModal.js";

export default function loadExercises() {
    const data = [];

    exercisesData.forEach((exercise, index) => {
        const id = `${Convert.cssToJsStandard(exercise.name.replaceAll(" ", "-").toLowerCase())}_${index}`;
        data.push({...exercise, id});
    });
    
    const list = document.querySelector(".exercises-list");
    const listEnd = document.getElementById("exercises-list-end");

    const searchInput = document.querySelector(".exercises-search input");
    let prevSearchInputValue = searchInput.value;
    
    load();
    searchInput.oninput = load;

    function load() {
        let exercises = data;
        const exerciseHolders = document.querySelectorAll(".exercise-holder");

        if((exerciseHolders.length > 0) && (searchInput.value === prevSearchInputValue)) return;
        prevSearchInputValue = searchInput.value;

        if(searchInput.value) exercises = search();

        [...list.children].forEach(child => {
            if(child.classList.contains("exercise-holder")) child.remove();
        });

        exercises.forEach((exercise, index) => {
            const exerciseHolder = document.querySelector("[data-template='exercise-holder']").content.firstElementChild.cloneNode(true);
            list.insertBefore(exerciseHolder, listEnd);

            const [articleExercise, exerciseInfo] = [...exerciseHolder.children];
            const [exerciseTitle] = [...exerciseInfo.children];
            const [exerciseDifficulty, exerciseP] = [...exerciseTitle.children];

            articleExercise.id = exercise.noResults ? "" : exercise.id;
            articleExercise.onmouseenter = exerciseHover;

            exerciseDifficulty.style.backgroundColor = getDifficultyColor(exercise.difficulty || "none");
            exerciseP.innerHTML = exercise.name;

            if(exercise.noResults) exerciseHolder.id = "exercise-holder-error";
            else articleExercise.onclick = () => openExerciseModal(articleExercise, exercise, index + 1);

            const exerciseContent = articleExercise.children[1];

            if(exercise.icon) createElement({ tag: "img", attributes: { src: exercise.icon, alt: exercise.name }, appendTo: exerciseContent });
            else Component.create("InteractiveTitle", { title: exercise.searchIndex ? exercise.searchIndex : index + 1, appendTo: exerciseContent });
        });

        initializeStats();

        function search() {
            const newExercises = [];

            exercises.forEach((exercise, index) => {
                const matches = [...exercise.name.toLowerCase().matchAll(searchInput.value.toLowerCase())];
                if(matches.length === 0) return;

                const validCaseMatches = [];

                matches.forEach(match => {
                    let validCaseMatch = "";
                    for(let i = match.index; i < match.index + searchInput.value.length; i++) validCaseMatch += exercise.name[i];
                
                    validCaseMatches.push(validCaseMatch);
                });

                let newName = exercise.name;

                validCaseMatches.forEach(validMatch => {
                    newName = exercise.name.replaceAll(validMatch, `<mark>${validMatch}</mark>`);
                });

                newExercises.push({...exercise, name: newName, searchIndex: index + 1});
            });

            if(newExercises.length === 0) newExercises.push({
                name: "No results",
                icon: "./images/icons/exclamation-icon.png",
                noResults: true
            });

            return newExercises;
        }
    }

    function exerciseHover(e) {
        const exercise = e.target;
        const exerciseInfo = exercise.parentNode.children[1];

        exerciseInfo.classList.add("active-exercise-info");
        exercise.onmouseleave = () => { exerciseInfo.classList.remove("active-exercise-info") };
    }
}