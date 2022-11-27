import { Component } from "../components/Component.js";
import { exercisesData } from "../../data/exercises/index.js";

export default function initializeStats() {
    const stats = JSON.parse(localStorage.getItem("exercisesStats"));
    const articleExercises = document.querySelectorAll(".exercise");

    articleExercises.forEach(articleExercise => {
        let validStats = null;

        if(stats) Object.keys(stats).forEach((key, index) => {
            if(articleExercise.id === key) validStats = Object.values(stats)[index];
        });

        const exerciseHolder = articleExercise.parentNode;
        const exerciseInfo = exerciseHolder.children[1];
        const [exerciseTitle, exerciseStats] = [...exerciseInfo.children];
        
        if(validStats === null && exerciseStats) {
            exerciseStats.style.opacity = "0";
            exerciseStats.style.bottom = "-60px";

            setTimeout(() => exerciseStats.remove(), 300);
        }

        else if(validStats) {
            if(exerciseStats === undefined) {
                const newExerciseStats = Component.create("ExerciseStats", { score: validStats, appendTo: exerciseInfo });

                exerciseTitle.classList.add("exercise-title-with-stats");
                
                setTimeout(() => {
                    newExerciseStats.style.opacity = "1";
                    newExerciseStats.style.bottom = "-70px";
                }, 100);
            }

            const allStats = document.querySelectorAll(".stats-holder .stat");

            allStats.forEach((stat, index) => {
                const statProp = index ? validStats.time : validStats.xp;
                const statP = stat.children[1];

                if(statProp !== statP.innerText) statP.innerText = statProp;
            });
        }
    });

    const trophyCounterP = document.querySelector(".trophy-counter p");
    const numberOfTrophies = Object.keys(stats ? stats : {}).length;

    trophyCounterP.innerText = `${numberOfTrophies} / ${exercisesData.length}`;
}