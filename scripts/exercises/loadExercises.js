import { Component } from "../components/Component.js";
import { exercisesData } from "../../data/exercises/index.js";
import createElement from "../functions/createElement.js";
import getDifficultyColor from "./getDifficultyColor.js";
import closeExerciseModal from "./closeExerciseModal.js";
import getRotateValue from "../functions/getRotateValue.js";

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

            const [articleExercise, exerciseTitle] = [...exerciseHolder.children];
            const [exerciseDifficulty, exerciseP] = [...exerciseTitle.children];

            articleExercise.onmouseenter = exerciseHover;

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
        const [exerciseBorder, exerciseContent] = [...activeExercise.children];

        exerciseBorder.style.transform = "";

        exerciseContent.style.height = "";
        exerciseContent.style.width = "";
        
        const exerciseModal = document.querySelector(".exercise-modal");
        const exerciseHolder = activeExercise.parentNode;

        if(exerciseModal === null && activeExerciseId > 0) activeExerciseId = 0;
        if(activeExerciseId === id) return;
        
        if(activeExerciseId !== 0) closeExerciseModal(false, { exerciseHolder, exercise });
        
        else {
            exerciseHolder.id = "active-exercise-holder";
            Component.create("ExerciseModal", { exercise });
        }

        activeExerciseId = id;
    }

    let intervals = {
        over: null,
        leave: null
    };

    function exerciseHover(e) {
        if(intervals.leave) {
            clearInterval(intervals.leave);
            intervals.leave = null;
        }

        const exercise = e.target;
        const [exerciseBorder, exerciseContent] = [...exercise.children];
        const exerciseHolder = exercise.parentNode;

        let angle = getRotateValue(exerciseBorder);

        exerciseBorder.style.transform = `rotate(${angle}deg)`;
        
        intervals.over = setInterval(() => {
            if(exerciseHolder.id === "active-exercise-holder") return mouseLeave();
            if(angle === 360) angle = 0;
            
            exerciseBorder.style.transform = `rotate(${angle}deg)`;
            angle++;
        }, 10);

        exerciseContent.style.height = "150px";
        exerciseContent.style.width = "150px";
        
        const exerciseTitle = exerciseHolder.children[1];
        exerciseTitle.classList.add("active-exercise-title");
        
        exercise.onmouseleave = mouseLeave;

        function mouseLeave() {
            clearInterval(intervals.over);
            intervals.over = null;
    
            exerciseBorder.style.transform = `rotate(${angle}deg)`;
            exerciseTitle.classList.remove("active-exercise-title");
    
            intervals.leave = setInterval(() => {
                if(angle === 0) {
                    clearInterval(intervals.leave);
                    intervals.leave = null;
    
                    exerciseBorder.style.transition = "";
                    exerciseBorder.style.transform = "";
    
                    exerciseContent.style.height = "";
                    exerciseContent.style.width = "";
                }

                else {
                    exerciseBorder.style.transform = `rotate(${angle}deg)`;
                    angle--;
                }
            }, 1);
        }
    }
}