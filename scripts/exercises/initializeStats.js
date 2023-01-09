import { Component } from "../components/Component.js";
import setExercisesStats from "./setExercisesStats.js";

let initialLoad = true;

export default function initializeStats() {
    const stats = JSON.parse(localStorage.getItem("exercisesStats"));
    const articleExercises = document.querySelectorAll(".exercise");

    articleExercises.forEach(articleExercise => {
        let validStats = null;

        if(stats) Object.keys(stats).forEach((key, index) => {
            if(articleExercise.id === key) validStats = Object.values(stats)[index];
        });

        const exerciseHolder = articleExercise.parentNode;
        if(!exerciseHolder.classList.contains("exercise-holder")) return;
        
        const exerciseInfo = exerciseHolder.children[1];
        const [exerciseTitle, exerciseStats] = [...exerciseInfo.children];
        
        if(validStats === null && exerciseStats) {
            exerciseStats.style.opacity = "0";
            exerciseStats.style.bottom = "-60px";

            setTimeout(() => exerciseStats.remove(), 300);
        }

        else if(validStats) {
            let validExerciseStats = exerciseStats;
            
            if(exerciseStats === undefined) {
                validExerciseStats = Component.create("ExerciseStats", { score: validStats, appendTo: exerciseInfo });

                exerciseTitle.classList.add("exercise-title-with-stats");
                
                setTimeout(() => {
                    validExerciseStats.style.opacity = "1";
                    validExerciseStats.style.bottom = "-70px";
                }, 100);
            }

            const allStats = validExerciseStats.children[1].children;

            [...allStats].forEach((stat, index) => {
                const statProp = index ? validStats.time : validStats.xp;
                const statP = stat.children[1];

                if(statProp !== statP.innerText) statP.innerText = statProp;
            });
        }
    });

    if(initialLoad) return initialLoad = false;
    
    const statsContent = setExercisesStats();
    const statsHolder = document.querySelector(".exercises-stats .holder");

    Object.values(statsContent).forEach((value, index) => {
        const statsHolderP = statsHolder.children[index].children[1];
        statsHolderP.innerText = value;
    });
}