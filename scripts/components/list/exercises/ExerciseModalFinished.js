import { Component } from "../../Component.js";
import initializeStats from "../../../exercises/initializeStats.js";

export default function ExerciseModalFinished(componentProps) {
    const { exercise, results, score, appendTo } = componentProps.params;

    const stats = JSON.parse(localStorage.getItem("exercisesStats"));

    if(stats === null) setStats({ xp: score.xp, time: score.time });
    else checkStats();

    const exerciseModalFinished = document.querySelector("[data-template='exercise-modal-finished']").content.firstElementChild.cloneNode(true);
    appendTo.appendChild(exerciseModalFinished);

    const [finishedHolder, continueButton] = [...exerciseModalFinished.children];

    continueButton.onclick = continueToRYA;
    window.eventList.add({ id: "exerciseModalFinishedKeyDown", type: "keydown", listener: continueToRYA });

    const exerciseModalTitle = document.querySelector("[data-template='exercise-modal-title']").content.firstElementChild.cloneNode(true);
    exerciseModalTitle.classList.add("disabled-exercise-modal-title");

    appendTo.insertBefore(exerciseModalTitle, exerciseModalFinished);

    continueButton.style.bottom = "-100px";

    setTimeout(() => {
        exerciseModalTitle.classList.remove("disabled-exercise-modal-title");
        finishedHolder.classList.add("active-finished-holder");

        continueButton.style.bottom = "";
    }, 100);

    Component.create("InteractiveTitle", { title: exercise.name, appendTo: exerciseModalTitle });
    
    const activeExercise = document.getElementById("active-exercise-holder").children[0];
    const activeExerciseClone = activeExercise.cloneNode(true);
    
    activeExerciseClone.id = "";
    activeExerciseClone.classList.add("exercise-clone");

    exerciseModalTitle.appendChild(activeExerciseClone);

    const overviewBlockStrong = document.querySelectorAll(".overview-block strong");
    const scorePropOrder = ["xp", "correct", "time"];
    const suffix = [" XP", "%"];

    overviewBlockStrong.forEach((strong, index) => {
        let scoreValue;

        Object.keys(score).forEach((key, scoreIndex) => {
            if(scorePropOrder[index] === key) scoreValue = Object.values(score)[scoreIndex];
        });

        strong.innerText = scoreValue + (suffix[index] ? suffix[index] : "");
    });

    let inProgress = false;

    function continueToRYA(e) {
        if(e.key !== "Enter" && e.type === "keydown") return;
        
        if(inProgress) return;
        inProgress = true;

        window.eventList.remove("exerciseModalFinishedKeyDown");

        exerciseModalTitle.classList.add("disabled-exercise-modal-title");
        
        finishedHolder.classList.remove("active-finished-holder");
        finishedHolder.style.opacity = "0";
        finishedHolder.style.left = "-20px";

        continueButton.style.bottom = "-100px";

        setTimeout(() => {
            exerciseModalTitle.remove();
            exerciseModalFinished.remove();

            Component.create("ExerciseModalReview", { exercise, results, appendTo });
            inProgress = false;
        }, 300);
    }

    function setStats(updates) {
        const validStats = getValidStats() === null ? { xp: 0, time: "00:00" } : getValidStats();
        
        localStorage.setItem("exercisesStats", JSON.stringify({...stats, [exercise.id]: {...validStats, ...updates}}));
        initializeStats();
    }
    
    function checkStats() {
        const validStats = getValidStats();
        
        if((score.xp > (validStats === null ? 0 : validStats.xp)) && isQuicker()) setStats({ xp: score.xp, time: score.time });

        else {
            if((score.xp > (validStats === null ? 0 : validStats.xp))) setStats({ xp: score.xp });
            if(isQuicker()) setStats({ time: score.time });
        }
        
        function isQuicker() {
            let result = false;
            if(validStats === null) return true;
            
            const dividedTime = {
                score: divideTime(score.time),
                stats: divideTime(validStats.time)
            };

            const scoreTime = {
                minutes: dividedTime.score[0],
                seconds: dividedTime.score[1]
            };

            const statsTime = {
                minutes: dividedTime.stats[0],
                seconds: dividedTime.stats[1]
            };

            if(
                (scoreTime.minutes === statsTime.minutes) &&
                (scoreTime.seconds < statsTime.seconds)
            ) result = true;

            else if(scoreTime.minutes < statsTime.minutes) result = true;

            return result;

            function divideTime(time) {
                let timeArray = time.split(":");
                for(let i = 0; i < timeArray.length; i++) timeArray[i] = parseInt(timeArray[i]);

                return timeArray;
            }
        }
    }

    function getValidStats() {
        let validStats = null;

        if(stats) Object.keys(stats).forEach((key, index) => {
            if(exercise.id === key) validStats = Object.values(stats)[index];
        });

        return validStats;
    }

    return exerciseModalFinished;
}