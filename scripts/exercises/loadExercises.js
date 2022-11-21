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

    load();
    searchInput.oninput = load;

    function load() {
        let exercises = exercisesData;
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

            const [exerciseTitle, articleExercise] = [...exerciseHolder.children];
            const [exerciseDifficulty, exerciseP] = [...exerciseTitle.children];

            articleExercise.onmouseover = e => changeExerciseTitle(e, true);
            articleExercise.onmouseleave = e => changeExerciseTitle(e, false);

            exerciseDifficulty.style.backgroundColor = getDifficultyColor(exercise.difficulty || "none");
            exerciseP.innerHTML = exercise.name;

            if(exercise.noResults) exerciseHolder.id = "exercise-holder-error";
            else articleExercise.onclick = () => openExerciseModal(articleExercise, exercise, index + 1);

            const exerciseContent = articleExercise.children[1];

            if(exercise.icon) createElement({ tag: "img", attributes: { src: exercise.icon, alt: exercise.name }, appendTo: exerciseContent });
            else Component.create("InteractiveTitle", { title: exercise.searchIndex ? exercise.searchIndex : index + 1, appendTo: exerciseContent });
        });

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

    function changeExerciseTitle(e, status) {
        const exerciseTitle = getExerciseTitle();
        
        if(status) exerciseTitle.classList.add("active-exercise-title");
        else exerciseTitle.classList.remove("active-exercise-title");

        function getExerciseTitle() {
            let result = null;
            
            e.path.forEach(pathElement => {
                if(!pathElement.classList?.contains("exercise")) return;
                result = pathElement.parentNode.children[0];
            });

            return result;
        }
    }
}